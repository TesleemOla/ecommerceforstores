declare class EnvironmentVariables {
    MONGODB_URI?: string;
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    SUPERADMIN_EMAIL?: string;
    SUPERADMIN_PASSWORD?: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
export {};
