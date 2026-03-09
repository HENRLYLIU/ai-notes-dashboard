import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import NewNoteDetailPage from './pages/NewNoteDetailPage'
import NoteDetailPage from './pages/NoteDetailPage'
import ReviewDetailPage from './pages/ReviewDetailPage'
import ReviewPage from './pages/ReviewPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/notes/new" element={<NewNoteDetailPage />} />
      <Route path="/notes/:id" element={<NoteDetailPage />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/review/detail" element={<ReviewDetailPage />} />
      <Route path="/review/detail/:id" element={<ReviewDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
