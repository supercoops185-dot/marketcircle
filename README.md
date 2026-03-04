# 🌿 MarketCircle

South Florida's local farmers market community platform.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Routing**: React Router v6
- **Fonts**: DM Sans (Google Fonts)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run the app locally
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for production
```bash
npm run build
```

## Firebase Setup
Your Firebase config is already wired in `src/firebase/config.js`.

### Enable Firebase Storage
1. Go to Firebase Console → Storage → Get Started
2. Start in test mode
3. Choose nam5 region (same as Firestore)

### Deploy Firestore Security Rules
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Init: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

## Project Structure
```
src/
├── firebase/
│   └── config.js          # Firebase connection
├── context/
│   └── AuthContext.jsx    # Auth state + user profile
├── components/
│   └── Navbar.jsx         # Sticky navigation
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Login.jsx          # Login
│   ├── Signup.jsx         # Sign up
│   ├── Feed.jsx           # Social feed
│   ├── Discover.jsx       # Browse markets & vendors
│   ├── MarketPage.jsx     # Individual market page
│   ├── VendorPage.jsx     # Individual vendor page
│   ├── Dashboard.jsx      # User dashboard (role-aware)
│   ├── ApplyVendor.jsx    # Vendor application
│   ├── ApplyOrganizer.jsx # Organizer application
│   └── Profile.jsx        # User profile
└── App.jsx                # Routes
```

## User Roles
| Role | Description |
|------|-------------|
| CommunityMember | Default. Can post, follow, RSVP |
| Vendor | Can create vendor profile, post business updates |
| MarketOrganizer | Can create market page, add events |
| Admin | Full access (set manually in Firestore) |

## Database Collections
- `users` - All user profiles
- `markets` - Market pages
- `events` - Market events
- `posts` - Social feed posts
- `alertSubscriptions` - Follow relationships
- `rsvps` - Event RSVPs
- `roleApplications` - Vendor/organizer applications
- `comments` - Post comments

## Deployment
Deploy to Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Next Steps (Phase 2)
- [ ] Stripe subscription integration
- [ ] Featured upgrade flow
- [ ] Admin approval dashboard
- [ ] Push notifications for alerts
- [ ] Comments on posts
- [ ] Vendor analytics dashboard
- [ ] Market event creation UI
