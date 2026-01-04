# Angular CMS

A modern Content Management System built with Angular, HTMX, and TypeScript. Features user management with role-based access control, native dialog elements, and Material Design-inspired styling with light/dark mode support.

## Features

- ✅ **Angular 21** - Latest Angular framework
- ✅ **HTMX Integration** - HTMX-first architecture for dynamic views
- ✅ **TypeScript** - Full type safety
- ✅ **Native Dialog Elements** - Modern HTML5 dialog with advanced styling
- ✅ **Role-Based Access Control** - Superadmin, Admin, Moderator, User roles
- ✅ **User CRUD Operations** - Complete user management
- ✅ **Light/Dark Mode** - Google Material Design inspired
- ✅ **Authentication Middleware** - Secure route protection
- ✅ **Confirmation Dialogs** - For create, update, and delete actions

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v10 or higher) - comes with Node.js
- **Angular CLI** (v21 or higher)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd angular_learning
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # For development, the default values should work
   ```

## Environment Configuration

The project uses environment files for configuration. Edit `src/environments/environment.ts` for development or `src/environments/environment.prod.ts` for production.

### Environment Variables (.env)

Create a `.env` file in the root directory (see `.env.example`):

```env
API_URL=http://localhost:3000/api
APP_NAME=Angular CMS
HTMX_ENABLED=true
ENABLE_LOGGING=true
```

**Note:** Angular doesn't directly read `.env` files. The `.env` file is for documentation and can be used with build tools. Update `environment.ts` files directly for Angular.

## Development Server

### Start the Development Server

```bash
npm start
```

Or use Angular CLI directly:

```bash
ng serve
```

The application will be available at:
- **URL:** http://localhost:4200
- **Hot Reload:** Enabled (automatically refreshes on file changes)

### Development Server Options

```bash
# Start with custom port
ng serve --port 4300

# Start with open browser automatically
ng serve --open

# Start with specific host
ng serve --host 0.0.0.0

# Start with HTTPS
ng serve --ssl

# Start with all options
ng serve --port 4300 --open --host 0.0.0.0
```

### Preview Build

To preview the production build locally:

```bash
# Build for production
npm run build

# Serve the production build (requires http-server or similar)
npx http-server dist/angular_learning/browser -p 4200
```

Or use Angular's preview server:

```bash
# Build and preview
npm run build
cd dist/angular_learning/browser
npx http-server -p 4200
```

## Available Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm run watch          # Build and watch for changes
npm test               # Run unit tests

# Angular CLI commands
ng serve               # Start dev server
ng build               # Build project
ng test                # Run tests
ng generate component  # Generate new component
```

## Project Structure

```
angular_learning/
├── src/
│   ├── app/
│   │   ├── components/      # Angular components
│   │   ├── services/        # Business logic services
│   │   ├── guards/          # Route guards
│   │   ├── models/          # TypeScript models
│   │   └── views/           # HTMX view templates
│   ├── environments/        # Environment configuration
│   └── styles.scss          # Global styles
├── .env                     # Environment variables
├── .env.example            # Environment template
└── angular.json             # Angular configuration
```

## Default Login Credentials

For testing purposes, use these demo credentials:

| Role | Email | Password |
|------|-------|----------|
| Superadmin | superadmin@example.com | password |
| Admin | admin@example.com | password |
| Moderator | moderator@example.com | password |
| User | user@example.com | password |

## Architecture

### HTMX-First Approach

This project uses **HTMX-first architecture**:

- **HTMX** handles all view updates and dynamic content
- **Angular** manages business logic, state, and services
- **TypeScript** provides type safety
- **Native Dialog** elements for modals

See `HTMX_ARCHITECTURE.md` for detailed architecture guide.

### Key Technologies

- **Angular 21** - Component framework
- **HTMX 2.0** - Dynamic HTML updates
- **TypeScript 5.9** - Type-safe JavaScript
- **SCSS** - Styling with CSS variables
- **RxJS** - Reactive programming

## Building for Production

```bash
# Build production bundle
npm run build

# The build artifacts will be stored in dist/angular_learning/browser/
```

### Production Environment

Update `src/environments/environment.prod.ts` before building:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  // ... other settings
};
```

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:

```bash
ng serve --port 4300
```

### Module Not Found Errors

Clear node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### HTMX Not Working

1. Check that HTMX is loaded in `index.html`
2. Verify `HtmxService.init()` is called in `app.ts`
3. Check browser console for errors

### Dialog Not Opening

1. Ensure you're using a modern browser (Chrome 37+, Firefox 98+, Safari 15.4+)
2. Check that `showModal()` is called after view initialization
3. Verify dialog element has `[open]` attribute or is opened programmatically

## Browser Support

- ✅ Chrome 37+
- ✅ Edge 79+
- ✅ Firefox 98+
- ✅ Safari 15.4+
- ✅ Opera 24+

## Documentation

- [HTMX Architecture Guide](./HTMX_ARCHITECTURE.md)
- [Dialog Design Guide](./DIALOG_DESIGN_GUIDE.md)
- [Dialog Usage Guide](./DIALOG_USAGE.md)

## Development Tips

1. **Use Angular DevTools** - Install browser extension for debugging
2. **Hot Reload** - Changes automatically refresh in browser
3. **TypeScript** - Leverage type safety for better development experience
4. **HTMX Attributes** - Use `hx-get`, `hx-post`, etc. for dynamic content
5. **Native Dialogs** - Use `<dialog>` element for all modals

## Contributing

1. Follow the HTMX-first architecture
2. Use TypeScript for all new code
3. Follow Angular style guide
4. Use native dialog elements for modals
5. Maintain light/dark mode compatibility

## License

This project is for learning and development purposes.

## Support

For issues or questions:
1. Check the documentation files
2. Review browser console for errors
3. Verify environment configuration
4. Check that all dependencies are installed

---

**Happy Coding! 🚀**
