# UvU - You Versus You

A minimalist daily productivity tracker. Compete against yourself.

## Features

- **Custom tasks** with point values (5, 10, 15, 20)
- **Timed tasks** that earn 1/6 point per minute
- **Particle explosions** when completing tasks
- **Year calendar** showing daily progress
- **Streak tracking** for consecutive 70+ point days
- **Auto-save at midnight** (local timezone)
- **Persistent storage** via localStorage

## Your Tasks

- Out of bed @ alarm — 5 pts
- Applications — 5 pts
- Application + cover letter — 20 pts
- 150g protein — 10 pts
- Development/learning app — 1/6 pt/min
- Finance/IB learning — 1/6 pt/min
- SPF — 5 pts
- Minoxidil — 5 pts
- Asleep by 12 — 10 pts
- Gym — 10 pts
- Clean room — 10 pts
- Laundry — 5 pts
- Get to office @ 8:45 — 5 pts

## Deploy to Vercel (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New" → "Project"
3. Choose "Import Third-Party Git Repository" or drag-drop this folder
4. Click "Deploy"
5. Your app will be live at `your-project.vercel.app`

## Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Drag and drop the `dist` folder (after building) to deploy
3. Or connect to a Git repo for automatic deployments

## Local Development

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

This creates a `dist` folder ready to deploy.

## Add to Phone Home Screen

Once deployed:

**iPhone:**
1. Open the URL in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android:**
1. Open the URL in Chrome
2. Tap the menu (3 dots)
3. Tap "Add to Home screen"
4. Tap "Add"

The app will work offline and feel like a native app!
