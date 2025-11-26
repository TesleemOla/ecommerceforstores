## Multi-store Ecommerce API (NestJS + MongoDB)

This service allows multiple stores to list products while customers place orders across stores. A dedicated superadmin approves stores and manages onboarding.

### Architecture

- `AuthModule`: local+JWT auth, registration for customers/store owners, login.
- `UsersModule`: Mongo user store, automatic superadmin bootstrap via env vars.
- `StoresModule`: store CRUD + approval flow (pending/approved/rejected).
- `ProductsModule`: product catalogue per store, ownership checks.
- `OrdersModule`: order placement, per-store order management, stock tracking.
- `DatabaseModule`: Mongo connection via `MongooseModule`.
- Cross-cutting helpers (roles decorator, guards, pagination DTO, etc.).

### Environment

Copy `.env.example` (coming soon) or export variables via shell:

```
MONGODB_URI=mongodb://localhost:27017/multi-store
JWT_SECRET=super-secret
JWT_EXPIRES_IN=1h
SUPERADMIN_EMAIL=superadmin@shop.com
SUPERADMIN_PASSWORD=ChangeMe123!
PORT=3000
```

The first boot creates the default superadmin user using the values above.

### Getting Started

```bash
npm install          # install deps (rerun if network fails)
npm run start:dev    # start local dev server on http://localhost:3000/api
```

The API is namespaced under `/api`. A basic health check lives at `GET /api/health`.

### Core Flows

- **Auth**
  - `POST /api/auth/register/customer`
  - `POST /api/auth/register/store-owner`
  - `POST /api/auth/login`
- **Stores**
  - Owners: `POST /api/stores` to request approval.
  - Superadmin: `GET /api/stores/pending`, `PATCH /api/stores/:id/status`.
  - Public: `GET /api/stores` returns approved stores only.
- **Products**
  - Owners (approved stores only): `POST /api/products`, `PATCH /api/products/:id`.
  - Public catalogue: `GET /api/products?storeId=...`.
- **Orders**
  - Customers: `POST /api/orders`, `GET /api/orders/me`.
  - Store owners: `GET /api/orders/store`, `PATCH /api/orders/:id/status`.

All protected routes require a `Bearer` token retrieved from the auth module. Role-based access is enforced through guards.

### Testing

```bash
npm run test        # unit tests (includes sample health spec)
```

### Next Steps

- Harden error handling and logging (e.g., use interceptors/winston).
- Add refresh tokens + password reset flows.
- Expand testing (integration/e2e, store/product/order services).
- Expose Swagger/OpenAPI docs for easier onboarding.
