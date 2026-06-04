# Digital Closet

A full-stack MERN application that catalogues your wardrobe. Upload clothing photos, tag and categorize items, and build saved outfits.

**CSCI 342 – Web Scripting | Spring 2026**

---

## Tech Stack

| | |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Routing | React Router v7 |
| Auth | Clerk |
| Backend | Node.js, Express 5, tsx |
| Database | MongoDB Atlas, Mongoose |
| File Storage | Multer, AWS S3 |
| Background Removal | @imgly/background-removal (in-browser, WebAssembly) |
| AI Analysis | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Analytics | Vercel Analytics |
| Deployment | Vercel (frontend), Render (backend) |
| CI/CD | GitHub Actions |

## Team

| Member | Role |
|---|---|
| Israel | Frontend / Backend |
| Lawson | Database |
| Harper | UI/UX |

---

## Setup

**Prerequisites:** Node.js v18+

```bash
git clone https://github.com/israelavendanojr/digital-closet.git
```

**Frontend** — create `frontend/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

**Backend** — create `backend/.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=8080

CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key

AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name

GEMINI_API=your_gemini_api_key

```

Install dependencies:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Running Locally

Both servers must be running. The Vite dev server proxies `/api` to the backend.

```bash
# Backend (port 8080)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

## Testing

Tests use [Vitest](https://vitest.dev/) and React Testing Library. Only when testing, the backend uses an in-memory MongoDB instance (no database connection required).

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

Additional scripts available in both packages:
```bash
npm run test:watch     # re-run on file save
npm run test:coverage  # generate coverage report
```

> **Note:** The first `npm test` in the backend downloads a MongoDB binary (~780 MB). Afterwards, runs use the cached binary and are much faster.

## CI/CD

GitHub Actions runs frontend and backend tests automatically on every push and pull request to `main`. The workflow caches both `node_modules` and the MongoDB binary to speed up runs.

---

## Pages & Routes

All app routes require authentication via Clerk. Unauthenticated users are redirected to `/sign-in`. `TopNav` and `BottomNav` are rendered on every protected page.

| Route | Page | Description |
|---|---|---|
| `/sign-in` | SignIn | Clerk sign-in |
| `/sign-up` | SignUp | Clerk sign-up |
| `/sso-callback` | — | Clerk SSO redirect handler |
| `/` | Home | Main dashboard |
| `/clothes` | LooseClothes | Browse closet items |
| `/outfits` | SavedOutfits | Browse saved outfits |
| `/outfits/builder` | OutfitBuilderCanvas | Build a new outfit on canvas |
| `/outfits/builder/:id` | OutfitBuilderCanvas | Edit an existing outfit on canvas |
| `/upload` | Upload | Upload a clothing photo |
| `/upload/tags` | UploadTags | Tag and categorize the item |
| `/upload/confirm` | UploadConfirmation | Review before saving |
| `/profile` | Profile | Account info |
| `/settings` | Settings | App preferences |
| `/settings/edit-profile` | EditProfile | Edit profile details |

---

## Components

| Component | Description |
|---|---|
| `TopNav` | Shared top navigation bar |
| `BottomNav` | Shared bottom navigation bar (mobile) |
| `Button` | Reusable styled button |
| `Card` | Base card container |
| `ClothingCard` | Clothing item with image and tags |
| `OutfitCard` | Saved outfit card |
| `OutfitBuilder` | Drag-and-select canvas for building outfits |
| `CanvasItem` | Draggable/resizable clothing item on the outfit canvas |
| `PanelClothingCard` | Clothing card in the outfit builder side panel |
| `CategoryTabs` | Filter closet by category |
| `ImageDropzone` | Drag-and-drop image upload area |
| `TagChip` | Tag pill/badge display |
| `TagInput` | Input for adding tags |
| `CreateClothingModal` | Modal for creating a clothing item |
| `EditClothingModal` | Modal for editing a clothing item |
| `CreateOutfitModal` | Modal for creating an outfit |
| `EditOutfitModal` | Modal for editing an outfit |
| `EditProfileModal` | Modal for editing profile details |

---

## API Routes

All routes are protected by Clerk auth middleware (`requireAuth`). Uploaded images are stored in AWS S3 and served via public S3 URLs.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/clothes/analyze` | AI-analyze a clothing image (Gemini) — returns name, category, tags |
| GET | `/api/clothes/user/:userId` | Get all clothing items for a user |
| POST | `/api/clothes/` | Upload a new clothing item (multipart) |
| GET | `/api/clothes/:id` | Get a single clothing item |
| PUT | `/api/clothes/:id` | Update a clothing item |
| DELETE | `/api/clothes/:id` | Delete a clothing item |
| GET | `/api/outfits/user/:userId` | Get all outfits for a user |
| POST | `/api/outfits/` | Create a new outfit |
| GET | `/api/outfits/:id` | Get a single outfit |
| PUT | `/api/outfits/:id` | Update an outfit |
| DELETE | `/api/outfits/:id` | Delete an outfit |
| GET/POST | `/api/users/...` | User profile management |

---

## Deployment

| | URL |
|---|---|
| Frontend | https://digital-closet-iota.vercel.app |
| Backend | https://digital-closet-backend.onrender.com |

The frontend is deployed on Vercel with a proxy rewrite that forwards `/api/*` to the Render backend. The backend is deployed on Render using `npx tsx src/index.ts`.

> **Note:** Render free instances spin down after inactivity — the first request after idle may take ~30 seconds to cold start.

---

## Links

- **Figma:** https://www.figma.com/design/WjEcSV8ckoe3d5Eq7BsqJa/CSCI-342-Group-Project
- **Primary Notion:** https://www.notion.so/SP26-CSCI-342-Final-Project-Digital-Closet-App-344445435554807ca3f5e325ec764c6f?source=copy_link
