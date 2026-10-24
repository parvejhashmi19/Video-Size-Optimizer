// Is file mein / aur /compress ke page routes set hain.
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar.jsx"
import CompressionPage from "./CompressionPage.jsx"
import HomePage from "./HomePage.jsx"

function App() {
  return (
    <BrowserRouter>
      {/* Navbar routes ke bahar hai, isliye Home aur Compressor dono pages par dikhai deta hai. */}
      <Navbar />
      {/* Yahan URL ke hisaab se dikhne wala page set hota hai. */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compress" element={<CompressionPage />} />
        {/* Baaki unknown URLs ko Home page par bhejte hain. */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
