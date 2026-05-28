import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TopNav from './components/layout/TopNav'

import Home from './pages/Home'
import LooseClothes from './pages/LooseClothes'
import SavedOutfits from './pages/SavedOutfits'
import SavedOutfitDetail from './pages/SavedOutfitDetail'
import SavedOutfitCreation from './pages/SavedOutfitCreation'
import Upload from './pages/Upload'
import UploadTags from './pages/UploadTags'
import UploadConfirmation from './pages/UploadConfirmation'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ClothingDetail from './pages/ClothingDetail'

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clothes" element={<LooseClothes />} />
        <Route path="/clothes/:id" element={<ClothingDetail />} />
        <Route path="/outfits" element={<SavedOutfits />} />
        <Route path="/outfits/new" element={<SavedOutfitCreation />} />
        <Route path="/outfits/:id" element={<SavedOutfitDetail />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload/tags" element={<UploadTags />} />
        <Route path="/upload/confirm" element={<UploadConfirmation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
