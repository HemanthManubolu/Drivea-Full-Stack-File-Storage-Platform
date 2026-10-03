import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Drive from './pages/Drive'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import SharedFile from './pages/SharedFile'
import Trash from './pages/Trash'
import SharedWithMe from './pages/SharedWithMe'

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login/*" element={<Login />}/>
          <Route path="/register/*" element={<Register />}/>
        </Route>
        <Route path="/s/:token" element={<SharedWithMe />}/>

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Drive />}/>
            <Route path="/dashboard" element={<Drive />}/>
            <Route path="/drive/:folderId" element={<Drive />}/>
            <Route path="/shared" element={<SharedFile />}/>
            <Route path="/trash" element={<Trash />}/>
          </Route>
        </Route>
        

        <Route path="*" element={<Navigate to="/" replace />}/>

      </Routes>
    </>
  )
}

export default App
