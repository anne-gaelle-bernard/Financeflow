import React, { useEffect, useState } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Transactions from './pages/Transactions'

export default function App() {
  function hasToken() {
    try {
      return typeof window !== 'undefined' && !!localStorage.getItem('ff_token')
    } catch {
      return false
    }
  }
  const [currentPage, setCurrentPage] = useState(() => (hasToken() ? 'home' : 'signup'))
  useEffect(() => {
    if (!hasToken()) setCurrentPage('signup')
  }, [])
  const handleNavigate = (page) => {
    if (!hasToken()) {
      if (page === 'signup' || page === 'login') setCurrentPage(page)
      else setCurrentPage('login')
    } else {
      setCurrentPage(page)
    }
  }

  return (
    <div>
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <Signup onNavigate={handleNavigate} />}
      {currentPage === 'transactions' && <Transactions onNavigate={handleNavigate} />}
    </div>
  )
}
