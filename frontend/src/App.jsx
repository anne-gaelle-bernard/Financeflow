import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('ff_token')

  return (
    <>
      {isLoggedIn && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}> 
          <Route path="/" element={<Home />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}
