import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import TopNav, { BottomNav } from './components/layout/TopNav'

import Home from './pages/Home'
import LooseClothes from './pages/clothing/LooseClothes'
import SavedOutfits from './pages/outfits/SavedOutfits'
import Upload from './pages/upload/Upload'
import UploadTags from './pages/upload/UploadTags'
import UploadConfirmation from './pages/upload/UploadConfirmation'
import Profile from './pages/user/Profile'
import Settings from './pages/user/Settings'
import EditProfile from './pages/user/EditProfile'
import SignInPage from './pages/auth/SignIn'
import SignUpPage from './pages/auth/SignUp'
import OutfitBuilderCanvas from './pages/outfits/OutfitBuilderCanvas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route
          path="/outfits/builder"
          element={
            <>
              <SignedIn>
                <OutfitBuilderCanvas />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/outfits/builder/:id"
          element={
            <>
              <SignedIn>
                <OutfitBuilderCanvas />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <SignedIn>
                <TopNav />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/clothes" element={<LooseClothes />} />
                  <Route path="/outfits" element={<SavedOutfits />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/upload/tags" element={<UploadTags />} />
                  <Route path="/upload/confirm" element={<UploadConfirmation />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/settings/edit-profile" element={<EditProfile />} />
                </Routes>
                <BottomNav />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
