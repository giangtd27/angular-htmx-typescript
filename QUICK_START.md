# Quick Start Guide

Get the Angular CMS up and running in minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment (Optional)

The default configuration works for development. If you need to change settings:

1. Edit `src/environments/environment.ts` for development
2. Edit `src/environments/environment.prod.ts` for production

Or create a `.env` file (for reference):

```bash
cp .env.example .env
# Edit .env with your values
```

## Step 3: Start Development Server

```bash
npm start
```

The app will open at: **http://localhost:4200**

## Step 4: Login

Use these demo credentials:

- **Email:** `superadmin@example.com`
- **Password:** `password`

## That's It! 🎉

You're ready to explore the Angular CMS.

## Common Commands

```bash
# Start with browser auto-open
npm run start:open

# Start on different port
npm run start:port 4300

# Build for production
npm run build:prod

# Preview production build
npm run preview
```

## Need Help?

- Check `README.md` for detailed documentation
- Review `HTMX_ARCHITECTURE.md` for architecture details
- See `DIALOG_DESIGN_GUIDE.md` for dialog usage

