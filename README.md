# Dashly — Business Dashboard

English | [Tiếng Việt](README.vi.md)

Dashly is a dashboard for managing products, inventory, purchase orders, and users. Built with React, TypeScript, and Supabase, it supports English and Vietnamese.

## Features

- Sign up, sign in with email/password or Google, and sign out.
- Request a password reset, set a new password, and display invalid-link messages.
- Navigate based on Admin, Staff, and Viewer roles.
- View dashboard metrics, low-stock products, and recent purchase orders.
- View, create, edit, and delete products.
- Edit products in a spreadsheet, import/export Excel files, and receive unsaved-change warnings.
- Manage purchase orders and view order details.
- View users and update their names, roles, and account statuses.
- Update profile details, passwords, and personal preferences.
- Receive realtime notifications as Admin or Staff, mark them as read, or delete them.
- Switch between EN/VI, display translated errors, and load pages on demand.

## Tech stack

| Technology | Purpose |
| --- | --- |
| React + TypeScript | Build the UI and check data types |
| Vite | Run locally and create production builds |
| React Router | Navigate between pages and check route access |
| Redux Toolkit | Manage shared data and API request state |
| Supabase | Authentication, PostgreSQL database, and realtime updates |
| React Hook Form + Zod | Manage forms and validate input |
| Tailwind CSS + SCSS Modules | Style the UI |
| i18next | Support English and Vietnamese |
| ReactGrid + SheetJS (`xlsx`) | Product spreadsheet and Excel import/export |
| Vitest + ESLint | Test logic and check code |
| GitHub Actions | Run lint, tests, and builds automatically |

## Run locally

### 1. Prerequisites

- Node.js 22.12 or later within the 22.x release line.
- pnpm 8.15.9, matching the CI configuration.
- A Supabase project with the required database and Auth configuration.

**Note:** this repository does not yet include SQL setup scripts or migrations. Creating an empty Supabase project and setting environment variables alone is not enough to run the data management features.

### 2. Clone and install

```bash
git clone https://github.com/0xhuy/react-business-dashboard.git
cd react-business-dashboard
git checkout develop
pnpm install --frozen-lockfile
```

`--frozen-lockfile` installs the versions recorded in `pnpm-lock.yaml` to keep local and CI environments consistent.

### 3. Set environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase project details:

```dotenv
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
```

- `VITE_SUPABASE_URL`: your Supabase project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the publishable key for frontend use.

Variables prefixed with `VITE_` are included in browser code. Do not put a Google Client Secret or Supabase service-role key here. The `.env` file is excluded from Git.

### 4. Start the app

```bash
pnpm dev
```

Open the URL printed in your terminal, usually `http://localhost:5173`. Keep the terminal running while using the app. Restart the server after changing `.env`.

## Backend requirements

The app uses these tables:

| Table | Data |
| --- | --- |
| `profiles` | Profiles, roles, and account statuses |
| `user_settings` | Personal preferences |
| `products` | Products and inventory |
| `purchase_orders` | Purchase orders |
| `purchase_order_items` | Items in each order |
| `notifications` | User notifications |

The database needs the matching columns, relationships, and Row Level Security (RLS) policies. RLS determines which data an account can read or change in the database; frontend route guards do not replace it.

Accounts need a corresponding profile in `profiles`. Profile creation during registration and notification generation require backend setup, which is not yet provided as scripts in this repository. Realtime must be configured for `notifications` to receive changes.

### Google login and password reset

Google login requires configuration in Google Cloud and Supabase. Store the Google Client ID and Client Secret in the Supabase Google provider settings.

These two URLs serve different purposes:

- Supabase callback: `https://<project-ref>.supabase.co/auth/v1/callback`. Google sends the sign-in result here. Use the Callback URL shown in the Supabase Google provider settings.
- App return URL: the code uses `<window.location.origin>/login` for Google login and `<window.location.origin>/create-new-password` for password reset.

Configure Supabase Redirect URLs for the address where your app runs. For local development on port 5173:

```text
http://localhost:5173/login
http://localhost:5173/create-new-password
```

Add the corresponding URLs if using port 4173 or a deployed domain. The app keeps sessions using the default Supabase configuration. The Remember me option is commented out and hidden.

## Common commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server with updates as you edit code |
| `pnpm lint` | Check code against ESLint rules |
| `pnpm test` | Run tests once and exit |
| `pnpm test:watch` | Rerun tests when related files change |
| `pnpm build` | Check TypeScript and create a build in `dist/` |
| `pnpm preview` | Preview the build locally, usually on port 4173 |

Before opening a PR, run:

```bash
pnpm lint
pnpm test
pnpm build
```

Current tests are in `src/utils/errors/errors.test.ts`. They cover four `normalizeError` cases: duplicate records, permission errors, network errors, and server errors. These tests check error mapping logic; they do not provide automated coverage of the entire app.

## Project structure

```text
public/locales/     EN/VI translations
src/
  assets/          Images and icons
  components/      Reusable components and providers
  features/        Feature APIs, logic, and types
  layouts/         Auth and dashboard layouts
  pages/           Application screens
  redux/           Store, slices, and thunks
  router/          Routes, lazy loading, and access checks
  services/        Service connections, including the Supabase client
  utils/           Helpers, constants, enums, and i18n
```

## CI and builds

The workflow in `.github/workflows/ci.yml` runs on pushes and on PRs opened or updated against `develop` and `main`. It installs dependencies, runs lint and tests, and builds the app. It does not deploy the app automatically.

To preview a build locally:

```bash
pnpm build
pnpm preview
```

For deployment, the output directory is `dist/`. Provide both Supabase environment variables before building. Configure the host to serve `index.html` for application routes so refreshing `/login` or `/admin` does not return a 404. Use `pnpm preview` to check builds locally.

## Manual checks before handoff

- Sign in with a password and Google, sign out, and sign in again.
- Check Admin, Staff, and Viewer access, including direct URL navigation.
- Try password reset with both a fresh link and an expired link.
- Check products, the Excel spreadsheet, purchase orders, and user updates.
- Check realtime notifications, EN/VI switching, and smaller screens.

Use test data when checking create, update, and delete actions.
