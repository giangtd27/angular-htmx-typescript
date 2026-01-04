# Environment Configuration Guide

This guide explains how to configure environment variables for the Angular CMS project using `.env` files.

## Overview

The project uses `.env` files to configure environment variables. Environment files (`environment.ts` and `environment.prod.ts`) are **auto-generated** from the `.env` file and should **not be edited manually**.

## Quick Start

1. **Create a `.env` file** in the project root (copy from `.env.example` if available):
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:
   ```env
   API_URL=http://localhost:3000/api
   APP_NAME=Angular CMS
   APP_VERSION=1.0.0
   HTMX_ENABLED=true
   ENABLE_LOGGING=true
   ```

3. **Generate environment files** from `.env`:
   ```bash
   npm run env:generate
   ```

   Or simply run:
   ```bash
   npm start
   ```
   (The `prestart` hook automatically generates environment files)

## Environment Variables

All environment variables are **required** and have **no default values**. You must provide all variables in your `.env` file.

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `http://localhost:3000/api` |
| `APP_NAME` | Application name | `Angular CMS` |
| `APP_VERSION` | Application version | `1.0.0` |
| `HTMX_ENABLED` | Enable HTMX features (`true` or `false`) | `true` |
| `ENABLE_LOGGING` | Enable console logging (`true` or `false`) | `true` |

## Configuration Workflow

### Development

1. Create/update `.env` file with development values
2. Run `npm run env:generate` (or `npm start` which runs it automatically)
3. Start the development server: `npm start`

### Production

1. Update `.env` file with production values:
   ```env
   API_URL=https://api.yourdomain.com/api
   APP_NAME=Angular CMS
   APP_VERSION=1.0.0
   HTMX_ENABLED=true
   ENABLE_LOGGING=false
   ```

2. Generate environment files:
   ```bash
   npm run env:generate
   ```

3. Build for production:
   ```bash
   npm run build:prod
   ```

## Environment Files

The following files are **auto-generated** and should **not be edited manually**:

- `src/environments/environment.ts` - Development configuration (generated from `.env`)
- `src/environments/environment.prod.ts` - Production configuration (generated from `.env`)

Both files are generated from the same `.env` file. The only difference is the `production` flag.

## Using Environment Variables in Code

### In Services

```typescript
import { environment } from '../../environments/environment'

export class ApiService {
  private readonly apiUrl = environment.apiUrl
  
  // Use environment.apiUrl in your service
}
```

### In Components

```typescript
import { environment } from '../../environments/environment'

export class MyComponent {
  apiUrl = environment.apiUrl
  isProduction = environment.production
}
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run env:generate` | Generate environment files from `.env` |
| `npm start` | Automatically generates env files, then starts dev server |
| `npm run build` | Automatically generates env files, then builds the app |
| `npm run build:prod` | Build for production (env files must be generated first) |

## Best Practices

1. **Never commit `.env` file** to version control
   - Add `.env` to `.gitignore`
   - Commit `.env.example` as a template

2. **Use different `.env` files for different environments**
   - `.env.development` for local development
   - `.env.production` for production builds
   - Copy the appropriate file to `.env` before building

3. **Never edit `environment.ts` or `environment.prod.ts` directly**
   - These files are auto-generated
   - All changes should be made in `.env`

4. **Validate your `.env` file**
   - Run `npm run env:generate` to check for missing variables
   - The script will fail if any required variable is missing

5. **Keep `.env.example` up to date**
   - Document all required variables
   - Provide example values (without sensitive data)

## Troubleshooting

### Missing Environment Variables

If you see an error like:
```
❌ Missing required environment variables:
   - API_URL
   - APP_NAME
```

**Solution:** Make sure your `.env` file exists and contains all required variables.

### Environment Variables Not Updating

1. **Regenerate environment files:**
   ```bash
   npm run env:generate
   ```

2. **Restart the development server:**
   ```bash
   npm start
   ```

3. **Clear Angular cache:**
   ```bash
   rm -rf .angular/cache
   ```

4. **Rebuild:**
   ```bash
   npm run build
   ```

### TypeScript Errors

If you see errors about missing properties in `environment`:

1. Make sure you've run `npm run env:generate`
2. Check that your `.env` file has all required variables
3. Restart your TypeScript server/IDE

## Example .env File

```env
# API Configuration
API_URL=http://localhost:3000/api

# Application Information
APP_NAME=Angular CMS
APP_VERSION=1.0.0

# Feature Flags
HTMX_ENABLED=true
ENABLE_LOGGING=true
```

## Security Notes

- **Never commit `.env` files** containing sensitive data
- Use environment-specific `.env` files for different deployments
- Consider using secret management tools for production environments
- The `.env` file is only used at build time, not in the browser

---

**Important:** Environment files (`environment.ts` and `environment.prod.ts`) are auto-generated. Always edit `.env` and run `npm run env:generate` to update them.
