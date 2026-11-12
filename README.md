# CSC351_group_project

Chess Club Finder: a web app for finding chess clubs, players and meetups nearby.

## Branch `Jackson_dev_brand`: layout and Clubs draft

This branch contains Jackson's draft of the shared layout (header, nav,
footer, CSS) and the Clubs & Invitations pages. It runs on a small
**preview server with fake data**: no database, no real login. It's for
trying out the look and feel before the real `app.js` exists.

### Requirements

- [Node.js](https://nodejs.org/) 18 or newer (check with `node -v`)
- Git

### Run it

1. Get the branch.

   If you haven't cloned the repo yet:
   ```bash
   git clone -b Jackson_dev_brand https://github.com/Krishna75981/CSC351_group_project.git
   cd CSC351_group_project
   ```

   If you already have it:
   ```bash
   git fetch origin
   git checkout Jackson_dev_brand
   ```

2. Install and start the preview server:
   ```bash
   cd layout-preview
   npm install
   npm start
   ```

3. Open http://localhost:3000 in your browser.

4. Stop the server with `Ctrl + C` in the terminal.

If port 3000 is taken, pick another port:
```bash
PORT=3001 npm start                         # macOS, Linux, Git Bash
$env:PORT=3001; npm start                   # Windows PowerShell
```

### What to try

| Page | URL | What to check |
| --- | --- | --- |
| Find clubs | `/clubs` | Search by keyword and distance |
| Club detail | `/clubs/1`, `/clubs/2`, `/clubs/3` | Buttons change by role: organizer, member, not a member |
| Create club | `/clubs/new` | Submit it empty, or with the name `Queens Knights`, to see form errors |
| My clubs | `/my/clubs` | Clubs you belong to, with your role |
| Invitations | `/invitations` | Accept or Decline shows a banner |

- **Log out** in the nav shows the logged-out header. **Log in** switches back. Neither asks for a password.
- Make the window narrower than 1000px to see the phone menu.
- Meetups, Venues, Players and Profile show a "Not built yet" page. They belong to other features.
- Join, Leave, Accept, Decline and Create show a success message but don't save anything.

### What's in this branch

| Path | What it is |
| --- | --- |
| `views/partials/header.ejs`, `footer.ejs` | Shared page shell and nav, used by every page |
| `views/partials/form-errors.ejs`, `field-error.ejs` | Shared way to show form errors |
| `public/css/style.css` | Shared stylesheet |
| `public/js/nav.js` | Phone menu toggle |
| `views/clubs/`, `views/invitations/`, `views/my/clubs.ejs` | Draft Clubs & Invitations pages |
| `layout-preview/` | Throwaway preview server with fake data. Delete once the real app runs. |

`layout-preview/README.md` describes what the header expects from
`app.js` and the team's form-error convention.
