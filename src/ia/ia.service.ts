import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

// --- Imports de Servicios ---
import { TareasService } from '../tareas/tareas.service';
import { CultivosService } from '../cultivos/cultivos.service';
import { VentasService } from '../ventas/ventas.service';
import { ProductosService } from '../productos/productos.service';
import { InsumosService } from '../insumos/insumos.service';

// --- Imports de Catálogos ---
import { TiposTareaService } from '../catalogos/services/tipos-tarea/tipos-tarea.service';
import { UbicacionesService } from '../catalogos/services/ubicaciones/ubicaciones.service';
import { CategoriasCultivoService } from '../catalogos/services/categorias-cultivo/categorias-cultivo.service';
import { TiposInsumoService } from '../catalogos/services/tipos-insumo/tipos-insumo.service';

@Injectable()
export class IaService {
  private ai: GoogleGenAI;

  constructor(
    private configService: ConfigService,
    private tareasService: TareasService,
    private cultivosService: CultivosService,
    private ventasService: VentasService,
    private productosService: ProductosService,
    private insumosService: InsumosService,
    private tiposTareaService: TiposTareaService,
    private ubicacionesService: UbicacionesService,
    private categoriasService: CategoriasCultivoService,
    private tiposInsumoService: TiposInsumoService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY no definida');
    
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  // ==========================================
  // MÉTODO 1: CHAT DE TEXTO
  // ==========================================
  async consultarAsistente(pregunta: string, contexto: string = '') {
    try {
      const prompt = `
        Actúa como un ingeniero agrónomo experto para la app Agronova.
        Contexto opcional del usuario: ${contexto}.
        Pregunta: "${pregunta}"
        Responde de forma técnica pero breve y amigable. Usa formato Markdown.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ],
      });

      // CORRECCIÓN: Accedemos directamente a .text (la librería nueva lo facilita)
      const text = response.text;

      if (!text) {
        throw new Error('No se recibió texto de la IA');
      }

      return { respuesta: text };

    } catch (error) {
      console.error('Error chat:', error);
      
      // Verificamos si es error de cuota (puede venir como status o code)
      if (error?.status === 429 || error?.code === 429) {
        return { 
          respuesta: "⏳ He alcanzado mi límite de consultas gratuitas. Inténtalo en un minuto." 
        };
      }
      
      return { respuesta: "Lo siento, tuve un error técnico al pensar tu respuesta." };
    }
  }

  // ==========================================
  // MÉTODO 2: COMANDOS DE VOZ (Acciones)
  // ==========================================
  async procesarComandoDeVoz(textoUsuario: string, idAgricultor: string) {
    try {
      // 1. Contexto Rápido
      const [
        misCultivos, misProductos, 
        catUbicaciones, catCategorias, catTiposTarea, catTiposInsumo
      ] = await Promise.all([
        this.cultivosService.findByField('idAgricultor', idAgricultor),
        this.productosService.findByField('idAgricultor', idAgricultor),
        this.ubicacionesService.findAllActive(),
        this.categoriasService.findAllActive(),
        this.tiposTareaService.findAllActive(),
        this.tiposInsumoService.findAllActive(),
      ]);

      // 2. Mapeo para el Prompt
      const ctx = {
        cultivos: misCultivos.map(c => `${c.nombre} (ID: ${c.id})`).join(', '),
        ubicaciones: catUbicaciones.map(u => `${u.nombre} (ID: ${u.id})`).join(', '),
        categorias: catCategorias.map(c => `${c.nombre} (ID: ${c.id})`).join(', '),
        tiposTarea: catTiposTarea.map(t => `${t.nombre} (ID: ${t.id})`).join(', '),
        tiposInsumo: catTiposInsumo.map(t => `${t.nombre} (ID: ${t.id})`).join(', '),
        productos: misProductos.map(p => `${p.nombre} (ID: ${p.id})`).join(', ')
      };

      // 3. Prompt de Ejecución
      const prompt = `
        Eres el Sistema Operativo de Agronova. Traduce voz a JSON para Firebase.
        
        DATOS REALES:
        - Cultivos: [${ctx.cultivos}]
        - Ubicaciones: [${ctx.ubicaciones}]
        - Categorías: [${ctx.categorias}]
        - Tareas: [${ctx.tiposTarea}]
        - Insumos: [${ctx.tiposInsumo}]
        - Productos: [${ctx.productos}]
        
        COMANDO: "${textoUsuario}"
        FECHA: ${new Date().toISOString()}

        RESPUESTA JSON (Sin markdown):
        {
          "accion": "crear_tarea" | "crear_venta" | "crear_cultivo" | "crear_insumo",
          "datos": { ...campos del DTO... },
          "resumen": "Texto confirmación"
        }
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ],
      });

      // CORRECCIÓN: Usamos .text directamente
      const text = response.text;
      
      if (!text) throw new Error('No se recibió respuesta de la IA');

      const textResponse = text.replace(/```json|```/g, '').trim();
      
      // A veces la IA añade texto antes del JSON, aseguramos limpieza
      const jsonStartIndex = textResponse.indexOf('{');
      const jsonEndIndex = textResponse.lastIndexOf('}');
      const jsonClean = textResponse.substring(jsonStartIndex, jsonEndIndex + 1);

      const comando = JSON.parse(jsonClean);
      
      // 4. Ejecución
      const datosFinales = { ...comando.datos, idAgricultor };

      switch (comando.accion) {
        case 'crear_tarea':
          await this.tareasService.create(datosFinales);
          break;
        case 'crear_cultivo':
          await this.cultivosService.create(datosFinales);
          break;
        case 'crear_venta':
          await this.ventasService.create(datosFinales);
          break;
        case 'crear_insumo':
          await this.insumosService.create(datosFinales);
          break;
        default:
          return { exito: false, mensaje: "No entendí la acción." };
      }

      return { exito: true, mensaje: comando.resumen, accion: comando.accion };

    } catch (error) {
      console.error("IA Error:", error);
      return { exito: false, mensaje: "No pude procesar la orden." };
    }
  }
}