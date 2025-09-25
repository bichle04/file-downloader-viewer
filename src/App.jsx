import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import FileViewerPage from "./pages/FileViewerPage"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/viewer/:fileId" element={<FileViewerPage />} />
      </Routes>
    </div>
  )
}

export default App
