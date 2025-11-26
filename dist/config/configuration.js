"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT ?? '3000', 10),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/multi-store',
    jwtSecret: process.env.JWT_SECRET ?? 'change-me',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    defaultSuperAdminEmail: process.env.SUPERADMIN_EMAIL ?? 'superadmin@shop.com',
    defaultSuperAdminPassword: process.env.SUPERADMIN_PASSWORD ?? 'changeMeNow123!',
});
//# sourceMappingURL=configuration.js.map