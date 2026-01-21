import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MatchDetailPage from './pages/MatchDetailPage'
import { useMatchStore } from './store/matchStore'
import { Toaster } from './components/ui/toaster'

function App() {
  const { syncMatches, fetchMatches } = useMatchStore()

  useEffect(() => {
    const init = async () => {
      await syncMatches()
      await fetchMatches()
    }
    init()
  }, [syncMatches, fetchMatches])

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/match/:id" element={<MatchDetailPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  )
}

export default App

