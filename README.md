✈ HorizonHub — Nepal Travel Booking Platform

> A UI/UX Design project built for BCSIT 2nd Semester at Pokhara College of Management (PCM).

Live Site: https://sujitchhetri.com.np

What Is This?

HorizonHub is a travel booking website focused entirely on Nepal destinations — treks, cultural tours, wildlife safaris, and more. The idea came from a simple frustration: most travel websites either hide their pricing or make it really hard to figure out what you're actually paying per person once you add guides, hotels, and transport.

We wanted to fix that. So we built something clean, honest, and interactive.

Pages

| Page              | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| index.html        | Homepage with hero, features, destination preview, and testimonials      |
| destinations.html | Full destination listing with search, filters, detail modal, and booking |
| bookings.html     | View and manage your saved trip bookings                                 |
| login.html        | Login with name and password                                             |
| register.html     | Create a new account                                                     |
| about.html        | Project background, team info, and tech stack                            |
| contact.html      | Contact form and developer info                                          |

Features

- Live search and filters — search by name, filter by category (trekking, cultural, adventure,
  relaxation) and budget range. No page reload.

- Per-person cost calculator — pick your number of travelers, hotel tier, transport, and guide preference. The total updates instantly.

- Add-ons system — each destination has customizable options (e.g., Budget Teahouse vs. Premium Lodge) with prices baked into the selection.

- Simulated booking flow — fill in your travel details, and the booking gets saved locally using localStorage.

- Auth system — register and log in by name + password. Each user's bookings are stored separately.

- Responsive design — works on mobile, tablet, and desktop.

Tech Stack

This is a pure vanilla frontend — no frameworks, no build tools.

- HTML5 — semantic structure across all pages
- CSS3 — Flexbox, Grid, animations, responsive breakpoints (all in styles.css)
- JavaScript — split across focused files (main.js, auth.js, destinations.js, bookings.js, data.js)
- localStorage — for saving user accounts and booking data in the browser

File Structure
File Structure

```text
horizonhub
├── index.html Homepage
├── destinations.html Destination listing + booking modals
├── bookings.html User's saved bookings
├── login.html Login page
├── register.html Registration page
├── about.html About the project and team
└── contact.html Contact form
|
├── styles.css All styles (shared across every page)
|
├── data.js Destination data (9 Nepal destinations)
├── auth.js Auth helpers: register, login, logout, localStorage
├── main.js Shared functions: nav, toast, preview grid
├── destinations.js Destination display, filtering, modals, booking logic
└── bookings.js Booking list display and delete
```
The Team

We're three BCSIT students who built this as our 2nd Semester UI/UX Design project.

Sujit Chhetri — Lead Developer. Frontend structure, UI implementation, project coordination.

Manish Baral — JavaScript Developer. Cost calculator, booking system, interactive features.

Suaan Shrestha — UI/UX Designer. Interface design, content, responsive layout.

Known Limitations

Since this is a student project and frontend-only:

- Passwords are stored in plain text in localStorage — this is fine for a demo, but not for anything real.
- There's no backend, so bookings don't sync across devices or browsers.
- Images are loaded from Unsplash via CDN links.
- The contact form shows an alert instead of sending a real email.

Project Info

- Course: BCSIT 2nd Semester — UI/UX Design
- College: Pokhara College of Management (PCM), Pokhara, Nepal
- Year: 2026
