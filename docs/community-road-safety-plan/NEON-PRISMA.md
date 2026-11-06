# Neon + Prisma implementation brief

Status: approved technology preference, documented setup task; commands below have not been executed. Prisma is the application database access layer and migration tool. Neon provides Postgres. This does not add public accounts, paid access, or public data downloads.

## Target and working directory

- Organization: `org-wild-dream-41366162`
- Project: `silent-mud-20568152`
- Production branch: `production`
- Service: Postgres only
- Application root: `website/` (the repository root has no application package.json)

Keep Prisma schema, migrations, config and generated client configuration with the Next.js application. Keep Neon configuration there too unless an existing repository configuration establishes another location. Inspect existing configuration and environment variable names without printing credentials before changing anything.

## Copyable implementation task

Set up this project's Next.js app on the specified Neon project, using Prisma for all normal application database access and Prisma Migrate for schema changes.

### 1. Install and authenticate

```bash
npm i -g neon@latest
```

If global installation fails, use `npx neon@latest` instead of `neon` for every Neon command. If a command opens browser sign-in, tell the user to complete it there. If sign-in times out or fails, ask the user to run `neon login`, then retry. Do not ask for passwords or tokens in chat or create a substitute project.

Read installed Neon/Neon Postgres skills and current Prisma documentation. Check installed CLI help and runtime compatibility before using version-specific flags or configuration.

### 2. Link the intended app and provision Postgres

From the repository root:

```bash
cd website
neon init -y --org-id org-wild-dream-41366162 --project-id silent-mud-20568152 --branch production --services postgres
```

Review generated `neon.ts` and existing project configuration before applying it; retain existing services/settings and avoid unrelated provisioning.

```bash
neon deploy
```

Verify environment variables landed in the application's `.env.local` or existing `.env`, preserving unrelated entries. Confirm the destination project/branch without printing secrets. Neon deployment configures backend services; it does not deploy the Next.js frontend or run Prisma migrations.

Create an isolated development branch from the intended production branch before schema experimentation:

```bash
neon checkout dev-prisma-setup --create
```

Verify the selected branch and pulled URLs before any migration or test write. Do not use `migrate dev`, reset, or experimental `db push` against production. If the named development branch already exists, inspect its ownership/state and use an isolated alternative where necessary.

### 3. Install and configure Prisma

For the existing serverless-oriented Next.js app, use the Neon Prisma adapter, subject to confirming the actual host/runtime:

```bash
npm install @prisma/client @prisma/adapter-neon @neondatabase/serverless
npm install --save-dev prisma
```

Keep Prisma CLI, client and adapter versions compatible and lock them in package-lock.json. Check Node/TypeScript requirements for the selected Prisma version and update engine declarations only when needed. Do not substitute Prisma Postgres, Drizzle, or a second ORM.

Create:

- `prisma/schema.prisma`: Postgres datasource, explicit client generation path, and reviewed models.
- `prisma.config.ts`: migration configuration using the direct URL. For modern Prisma, follow the current config format rather than copying legacy datasource URL properties.
- `src/lib/db.ts`: server-only Prisma client using `PrismaNeon`, pooled `DATABASE_URL`, and a development singleton to avoid hot-reload client proliferation.
- A reliable environment-loading strategy shared by Prisma CLI commands and Next.js. Prisma commands must explicitly load whichever env file Neon actually wrote; do not assume `.env.local` is automatically loaded by Prisma. For example, use Next's environment loader in Prisma config with its dependency declared directly.
- Package scripts for client generation, migration development/deployment, and migration status. Generate the client before `next build`; never run production migrations as an incidental build side effect.
- An example env file with names/placeholders only; ignore real env files in git.

Connection roles:

- `DATABASE_URL`: pooled runtime connection; server-side only, never `NEXT_PUBLIC_*`.
- `DATABASE_URL_UNPOOLED`: direct connection for Prisma migrations/introspection; verify it belongs to the same selected database/branch.

Instantiate the adapter/client according to the installed package APIs. Use Node runtime route handlers or server actions; do not import Prisma into browser components. Configure the hosting environment separately before deploying the app; local env files alone do not configure hosted functions.

### 4. Model and wire the approved features

Start with city requests, data requests and their policy acknowledgments. Schema details below are proposed implementation structure, not an already-created database:

- City request: city/county, optional email and explanation/help offer, status, submission time and retention deadline.
- Data request: geography, requested date range/information, reply email, optional intended use, status, submission time and retention deadline.
- Policy acceptance associated with each request: Terms version, Privacy version and acceptance time. Store separate ongoing-collaboration agreement when applicable.

Use validated server-side writes, abuse protection, and explicit field selection. Keep request records private; do not expose a public request-list endpoint. Reuse approved operating workflows rather than adding an unsolicited admin account system. Keep form submission acknowledgment distinct from promises of fulfillment.

Implement the monthly review/12-month deletion policy, including associated acknowledgment records and optional ongoing collaboration. Do not introduce indefinite retention by default. Document how maintainers execute review and deletion before intake goes live.

Treat crash-data migration as a separate work item: inspect and reconcile existing source data first, design crash/coverage models and indexes, import reproducibly, and compare counts before replacing ArcGIS-backed reads. Do not assume adding Prisma means the crash dataset has been migrated. Return only permitted crash-level fields and aggregate injury counts to the map. No bulk download or self-service export endpoint.

Do not provision Auth, Functions, storage or payment services merely to complete this Postgres integration. Optional donations remain a separate provider handoff.

### 5. Migrate and prove the integration

Inspect any existing database schema first. If nonempty, establish an appropriate Prisma baseline rather than resetting it. Create and review migrations on the isolated development branch:

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev --name community_requests
npx prisma migrate status
npm run build
npm run start
```

Ensure the development branch is selected before migration/testing. Test the running application, not only a SQL connection:

1. Submit a synthetic city request and data request through the real application forms/handlers with required acknowledgments.
2. Read back each row through Prisma and verify fields, policy versions, timestamp and retention deadline; use no real personal information.
3. Prove missing acknowledgment and invalid fields are rejected without storing rows.
4. Verify private requests cannot be read through public endpoints or browser payloads.
5. Verify the deletion routine against expired synthetic records and an ongoing-collaboration exception.
6. Clean up only the synthetic test records and verify removal.
7. If crash reads were migrated in this task, verify map/list/filter results against reconciled source counts, including missing-location cases.

After reviewing migration SQL and development evidence, promote reviewed migration files through `prisma migrate deploy` on the intended production connection as a separate release step. Confirm production target and recovery approach first; never reset production. Do not claim end-to-end completion for pathways still lacking required operator/policy readiness.

### 6. Report evidence

Report changed files, installed versions, selected non-secret project/branch identifiers, migration status, build exit code/output, startup evidence and actual end-to-end results. Include failures and unresolved launch prerequisites. Redact connection strings, credentials and submitted personal data. A successful build alone does not prove database wiring or deploy the app.

## Official references

- [Neon Prisma integration](https://neon.com/docs/guides/prisma)
- [Prisma PostgreSQL configuration](https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql)
- [Prisma driver adapters](https://docs.prisma.io/docs/orm/v7/core-concepts/supported-databases/database-drivers)
- [Neon CLI](https://neon.com/cli)
- [Neon declarative configuration](https://neon.com/blog/introducing-neon-ts)

Recheck exact APIs against the versions installed at implementation time.
