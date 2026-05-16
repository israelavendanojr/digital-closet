# Digital Closet
 
A full-stack MERN application that catalogues your wardrobe. Can upload clothing photos, tag and categorize items, and build saved outfits.
 
**CSCI 342 – Web Scripting | Spring 2026**
 
---
 
## Tech Stack
 
| | |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Routing | React Router v7 |
| Backend | Node.js, Express *(in progress)* |
| Database | MongoDB Atlas *(in progress)* |
 
## Team
 
| Member | Role |
|---|---|
| Israel | Frontend |
| Ashley | Backend |
| Lawson | Database |
| Harper | UI/UX |
 
---
 
## Setup
 
**Prerequisites:** Node.js v18+
 
```bash
git clone https://github.com/israelavendanojr/digital-closet.git
cd digital-closet/frontend
npm install
```
 
## Running Locally
 
```bash
# Frontend
cd frontend
npm run dev        # http://localhost:5173
```
 
> Backend is not yet integrated. The frontend runs fully standalone.
 
---
 
## Pages & Routes
 
All navigation is client-side via React Router. `TopNav` is rendered on every page.
 
| Route | Page | Description |
|---|---|---|
| `/` | Home | Main dashboard |
| `/clothes` | LooseClothes | Browse closet items |
| `/outfits` | SavedOutfits | Browse saved outfits |
| `/outfits/new` | SavedOutfitCreation | Build a new outfit |
| `/outfits/:id` | SavedOutfitDetail | View a saved outfit |
| `/upload` | Upload | Upload a clothing photo |
| `/upload/tags` | UploadTags | Tag and categorize the item |
| `/upload/confirm` | UploadConfirmation | Review before saving |
| `/profile` | Profile | Account info |
| `/settings` | Settings | App preferences |
 
---
 
## Components
 
| Component | Description |
|---|---|
| `TopNav` | Shared navigation bar |
| `Button` | Reusable styled button |
| `Card` | Base card container |
| `ClothingCard` | Clothing item with image and tags |
| `OutfitCard` | Saved outfit card |
| `CategoryTabs` | Filter closet by category |
| `ImageDropzone` | Drag-and-drop image upload area |
| `TagChip` | Tag pill/badge display |
| `TagInput` | Input for adding tags |
 
---
 
## Links
 
- **Figma:** https://www.figma.com/design/WjEcSV8ckoe3d5Eq7BsqJa/CSCI-342-Group-Project
- **Primary Notion:** https://www.notion.so/SP26-CSCI-342-Final-Project-Digital-Closet-App-344445435554807ca3f5e325ec764c6f?source=copy_link
