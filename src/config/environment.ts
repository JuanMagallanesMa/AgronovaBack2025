export type EnvironmentVariables = Record<string, string | undefined>;

const requiredVariables = ['JWT_SECRET', 'FIREBASE_SERVICE_ACCOUNT_PATH'] as const;
const recoveryVariables = [
  'FRONTEND_URL',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
] as const;

export function validateEnvironment(
  env: EnvironmentVariables,
): EnvironmentVariables {
  const missing: string[] = requiredVariables.filter((key) => !env[key]?.trim());

  const recoveryConfigured = recoveryVariables.some((key) => env[key]?.trim());
  if (recoveryConfigured) {
    missing.push(...recoveryVariables.filter((key) => !env[key]?.trim()));
  }

  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${Array.from(new Set(missing)).join(', ')}`,
    );
  }

  return env;
}

export function getCorsOrigins(env: EnvironmentVariables): string[] {
  return (env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}
