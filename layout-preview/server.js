/*
  Name:       Jackson [last name]
  Course:     CSC351 Database Management
  Date:       2026-11-12
  Assignment: Semester project
  Purpose:    Throwaway preview server for the shared layout and the draft
              Clubs & Invitations pages. It renders the real views in
              ../views with FAKE data (no database, no real login), so the
              team can click through the look and feel before app.js exists.
              Delete this folder once the real app runs.

  Run:  cd layout-preview && npm install && npm start
        then open http://localhost:3000
*/
const path = require('path');
const express = require('express');

const ROOT = path.join(__dirname, '..');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));
app.use(express.static(path.join(ROOT, 'public')));
app.use(express.urlencoded({ extended: true }));

// ---- Fake login: one global switch, good enough for a demo ----------------
let loggedIn = true;

app.use((req, res, next) => {
  res.locals.currentUser = loggedIn ? { id: 1, firstName: 'Jackson' } : null;
  res.locals.currentPath = req.path;
  const messages = {
    joined: { type: 'success', text: 'You joined the club.' },
    left: { type: 'info', text: 'You left the club.' },
    created: { type: 'success', text: 'Club created. You are its organizer.' },
    accepted: { type: 'success', text: 'Invitation accepted. Welcome to the club!' },
    declined: { type: 'info', text: 'Invitation declined.' },
  };
  res.locals.message = messages[req.query.msg] || null;
  next();
});

// ---- Fake data, shaped like the route contract ----------------------------
const clubs = [
  { club_id: 1, name: 'Queens Knights', city: 'Jamaica', state: 'NY', zip: '11432', distance_miles: 1.2,
    description: 'Weekly blitz nights every Thursday and a monthly rapid tournament. All levels welcome.' },
  { club_id: 2, name: 'Forest Hills Chess Café', city: 'Forest Hills', state: 'NY', zip: '11375', distance_miles: 3.5,
    description: 'Casual games over coffee on weekend mornings. Boards provided.' },
  { club_id: 3, name: 'Flushing Endgame Society', city: 'Flushing', state: 'NY', zip: '11354', distance_miles: 4.8,
    description: 'Study group focused on endgames and opening prep. Bring your own puzzles.' },
  { club_id: 4, name: 'Long Island City Rooks', city: 'Long Island City', state: 'NY', zip: '11101', distance_miles: 7.9,
    description: 'Competitive club with USCF-rated events and team league play.' },
];

const members = {
  1: [
    { user_id: 1, first_name: 'Jackson', last_name: 'Doe', role: 'organizer', accounts: [{ platform: 'Lichess', rating: 1720 }] },
    { user_id: 2, first_name: 'Ana', last_name: 'Ruiz', role: 'organizer', accounts: [{ platform: 'USCF', rating: 1840 }, { platform: 'chess.com', rating: 1910 }] },
    { user_id: 3, first_name: 'Sam', last_name: 'Lee', role: 'member', accounts: [] },
    { user_id: 4, first_name: 'Priya', last_name: 'Shah', role: 'member', accounts: [{ platform: 'chess.com', rating: 1350 }] },
  ],
  2: [
    { user_id: 5, first_name: 'Marco', last_name: 'Bianchi', role: 'organizer', accounts: [{ platform: 'FIDE', rating: 2010 }] },
    { user_id: 1, first_name: 'Jackson', last_name: 'Doe', role: 'member', accounts: [{ platform: 'Lichess', rating: 1720 }] },
  ],
  3: [
    { user_id: 6, first_name: 'Grace', last_name: 'Kim', role: 'organizer', accounts: [{ platform: 'Lichess', rating: 2105 }] },
  ],
  4: [],
};

const inDays = (n, hour = 19) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(hour, 0, 0, 0); return d; };
const meetups = {
  1: [
    { event_id: 11, title: 'Thursday Blitz Night', starts_at: inDays(2), venue_name: 'Jamaica Library' },
    { event_id: 12, title: 'November Rapid (15+10)', starts_at: inDays(9, 13), venue_name: 'Queens Community Hall' },
  ],
  2: [{ event_id: 21, title: 'Saturday Coffee & Casual', starts_at: inDays(3, 10), venue_name: 'Austin St Café' }],
  3: [],
  4: [],
};

const invitations = [
  { invite_id: 1, club_id: 3, club_name: 'Flushing Endgame Society', sender_name: 'Grace Kim', sent_at: inDays(-1), status: 'pending' },
  { invite_id: 2, club_id: 4, club_name: 'Long Island City Rooks', sender_name: 'Tom Walsh', sent_at: inDays(-4), status: 'pending' },
  { invite_id: 3, club_id: 2, club_name: 'Forest Hills Chess Café', sender_name: 'Marco Bianchi', sent_at: inDays(-20), status: 'accepted' },
];

const myRole = (clubId) => {
  if (!loggedIn) return null;
  const m = (members[clubId] || []).find((x) => x.user_id === 1);
  return m ? m.role : null;
};
const withCount = (c) => ({ ...c, member_count: (members[c.club_id] || []).length });

// ---- Pages -----------------------------------------------------------------
app.get('/', (req, res) => res.redirect('/clubs'));

app.get('/clubs', (req, res) => {
  const q = (req.query.q || '').trim();
  const distance = Number(req.query.distance) || 25;
  const found = clubs
    .filter((c) => c.distance_miles <= distance)
    .filter((c) => !q || (c.name + ' ' + c.description).toLowerCase().includes(q.toLowerCase()))
    .map(withCount);
  res.render('clubs/index', { clubs: found, filters: { q, distance } });
});

app.get('/clubs/new', (req, res) => res.render('clubs/new', { values: {}, errors: {} }));

// Mirrors the real validation rules, to show the form-error pattern.
app.post('/clubs', (req, res) => {
  const values = { name: (req.body.name || '').trim(), description: (req.body.description || '').trim(), zip: (req.body.zip || '').trim() };
  const errors = {};
  if (values.name.length < 3 || values.name.length > 80) errors.name = 'Club name must be 3 to 80 characters.';
  else if (clubs.some((c) => c.name.toLowerCase() === values.name.toLowerCase())) errors.name = 'That club name is already taken.';
  if (values.description.length > 1000) errors.description = 'Description can be up to 1,000 characters.';
  if (!/^\d{5}$/.test(values.zip)) errors.zip = 'Enter a 5-digit ZIP code.';
  if (Object.keys(errors).length) return res.status(400).render('clubs/new', { values, errors });
  res.redirect('/clubs/1?msg=created'); // the demo doesn't really save it
});

app.get('/clubs/:id', (req, res, next) => {
  const club = clubs.find((c) => c.club_id === Number(req.params.id));
  if (!club) return next(); // falls through to the 404 page
  res.render('clubs/show', {
    club, members: members[club.club_id], meetups: meetups[club.club_id], myRole: myRole(club.club_id),
  });
});

app.post('/clubs/:id/join', (req, res) => res.redirect(`/clubs/${req.params.id}?msg=joined`));
app.post('/clubs/:id/leave', (req, res) => res.redirect(`/clubs/${req.params.id}?msg=left`));

app.get('/my/clubs', (req, res) => {
  const mine = clubs.filter((c) => myRole(c.club_id)).map((c) => ({ ...withCount(c), role: myRole(c.club_id) }));
  res.render('my/clubs', { clubs: mine });
});

app.get('/invitations', (req, res) => res.render('invitations/index', { invitations }));
app.post('/invitations/:id/accept', (req, res) => res.redirect('/invitations?msg=accepted'));
app.post('/invitations/:id/decline', (req, res) => res.redirect('/invitations?msg=declined'));

// Fake login and logout, to see the logged-out header.
app.get('/login', (req, res) => { loggedIn = true; res.redirect('/clubs'); });
app.get('/register', (req, res) => { loggedIn = true; res.redirect('/clubs'); });
app.post('/logout', (req, res) => { loggedIn = false; res.redirect('/clubs'); });

// Pages owned by other features: placeholder.
app.use((req, res) => {
  res.status(404).render(path.join(__dirname, 'views', 'coming-soon'), { title: 'Coming soon' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Layout preview on http://localhost:${PORT}`));
