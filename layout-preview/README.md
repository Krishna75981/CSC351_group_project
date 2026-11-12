# Layout preview (draft)

A throwaway server so the team can click through the shared layout and the
draft Clubs & Invitations pages before the real `app.js` exists. It uses
**fake data**: there's no database, and login is a single on/off switch.

## Run it

```bash
cd layout-preview
npm install
npm start
```

Then open http://localhost:3000.

## What to try

- **Find clubs** (`/clubs`): search by keyword and distance.
- **Club detail**: Queens Knights (you're the organizer), Forest Hills (you're a member), Flushing (you're not a member).
- **Create club** (`/clubs/new`): submit it empty or with `Queens Knights` to see the form errors.
- **My clubs** and **Invitations**: Accept and Decline show the success banner.
- **Log out** in the nav shows the logged-out header; **Log in** switches back.
- Narrow the window below 1000px to see the phone menu.

Links to other features (Meetups, Venues, Players, Profile) show a "Not built yet" page.

## What's shared and real

These are the real files, which the real app will use as they are:

| File | What it is |
| --- | --- |
| `views/partials/header.ejs`, `footer.ejs` | Page shell and nav. Include them at the top and bottom of every view. |
| `views/partials/form-errors.ejs`, `field-error.ejs` | Form error pattern (see below). |
| `public/css/style.css` | Shared styles: buttons, forms, cards, tables, badges, alerts. |
| `public/js/nav.js` | Phone menu toggle. |
| `views/clubs/*`, `views/invitations/*`, `views/my/clubs.ejs` | Jackson's draft pages. |

### What the header expects from `app.js` (Noah)

- `res.locals.currentUser = { id, firstName }`, or `null` when logged out
- `res.locals.currentPath = req.path`, to highlight the current nav link
- Optional `message = { type: 'success' | 'error' | 'info', text }` for a banner
- `app.use(express.static('public'))` and `app.use(express.urlencoded({ extended: true }))`

### Form error convention (everyone)

When validation fails, re-render the same view with
`errors: { fieldName: 'Message', _form: 'Message for the whole form' }` and
`values: req.body`. When it succeeds, redirect. `views/clubs/new.ejs` shows
the markup.

Delete this `layout-preview/` folder once the real app runs.
