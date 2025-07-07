import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import OpraQuestionnaire from '../pages/OpraQuestionnaire'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OpraQuestionnaire />} />
        <Route path="/view-pdf/:filename" element={<PdfViewer />} />
      </Routes>
    </Router>
  )
}

export default App