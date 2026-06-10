import Home from './pages/Home'
import Profile from './pages/Profile'
import Exercises from './pages/Exercises'
import LessonGroups from './pages/LessonGroups'
import DefaultLayout from "./components/Layouts/DefaultLayout"
import Dictation from "./pages/Dictation"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Account from "./pages/Account"
import ChangeEmail from "./pages/ChangeEmail"
import ChangeUsername from "./pages/ChangeUsername"
import TopUser from "./pages/TopUser"
import FavouriteLessons from "./pages/FavouriteLessons"
import ChangePassword from "./pages/ChangePassword"
import DailyDictationChat from './components/DailyDictationChat'

import { API_URL } from './utils/constants'


import { useEffect, useContext } from 'react'
import { AuthContext } from './store/AuthContext'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {
  const { token, user } = useContext(AuthContext)

  useEffect(() => {
    // Chỉ update nếu đang xem profile của chính mình
    if (!token) return

    fetch(`${API_URL}/auth/profile/last-active`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
  }, [user, token])

  // Đọc basename từ embed-config hoặc tự detect
  const getBasename = () => {
    const embedMeta = document.querySelector('meta[name="embed-path"]')
    if (embedMeta) return embedMeta.getAttribute('content') || '/'
    // Nếu chạy trong /embed/daily-dictation → dùng làm basename
    const path = window.location.pathname
    const match = path.match(/^(\/embed\/[^/]+)/)
    return match ? match[1] : '/'
  }

  return (
    <>
      {/* <Router basename="/embed/daily-dictation"> */}
            <Router basename="/">

        <div>
          <Routes>
            <Route path='/' element={<DefaultLayout><Home /></DefaultLayout>} />
            <Route path='/exercises' element={<DefaultLayout><Exercises /></DefaultLayout>} />
            <Route path='/exercises/:topicSlug' element={<DefaultLayout><LessonGroups /></DefaultLayout>} />
            <Route path='/exercises/:topicSlug/:lessonSlug' element={<DefaultLayout><Dictation /></DefaultLayout>} />
            <Route path='/top-users' element={<DefaultLayout><TopUser /></DefaultLayout>} />
            <Route path='/profile' element={<DefaultLayout><Profile /></DefaultLayout>} />
            <Route path='/login' element={<DefaultLayout><Login /></DefaultLayout>} />
            <Route path='/register' element={<DefaultLayout><Register /></DefaultLayout>} />
            <Route path='/profile/:userId' element={<DefaultLayout><Profile /></DefaultLayout>} />
            <Route path='/user/account-information' element={<DefaultLayout><Account /></DefaultLayout>} />
            <Route path='/user/change-email' element={<DefaultLayout><ChangeEmail /></DefaultLayout>} />
            <Route path='/user/change-password' element={<DefaultLayout><ChangePassword /></DefaultLayout>} />
            <Route path='/user/change-username' element={<DefaultLayout><ChangeUsername /></DefaultLayout>} />
            <Route path='/user/favourite-lessons' element={<DefaultLayout><FavouriteLessons /></DefaultLayout>} />

          </Routes>
        </div>
      </Router>

      <DailyDictationChat />
    </>
  )
}

export default App
