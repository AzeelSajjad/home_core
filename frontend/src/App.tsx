import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RentCalculator from '../pages/RentCalculator'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RentCalculator />} />
      </Routes>
    </Router>
  )
}

export default App