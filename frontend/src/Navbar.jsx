// Ye common navbar Home aur Compressor dono page par aata hai.
import { useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

// Is list mein navbar ke labels aur Home page ke section links badal sakte ho.
const links = [
  ["Home", "/#home"],
  ["About", "/#about"],
  ["Features", "/#features"],
  ["How It Works", "/#how-it-works"],
  ["Contact", "/#contact"],
]

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const pendingSection = useRef(null)

  // Compressor se Home par aane ke baad target section smooth scroll se kholte hain.
  useEffect(() => {
    if (location.pathname !== "/" || !pendingSection.current) return

    const sectionId = pendingSection.current
    pendingSection.current = null
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [location.pathname])

  // Home par wahi rehte hue section scroll karo; doosre route par pehle Home kholo.
  function handleSectionClick(event, href) {
    event.preventDefault()
    const sectionId = href.split("#")[1]

    if (location.pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }

    pendingSection.current = sectionId
    navigate("/")
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950 text-white">
      {/* Fixed header scroll karte waqt bhi screen ke top par rehta hai. */}
      <nav aria-label="Main navigation" className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-y-2 px-5 py-2.5 sm:px-8 sm:py-3">
        {/* Brand par click karne se Home page khulta hai. */}
        <Link to="/" className="flex items-center gap-2.5" aria-label="Video Size Optimizer home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold" aria-hidden="true">▶</span>
          <span className="text-sm font-semibold tracking-tight sm:text-base">Video Size Optimizer</span>
        </Link>

        {/* Ye links Home page sections tak le jaate hain; chhoti screen par row scroll hoti hai. */}
        <div className="order-3 flex w-full items-center justify-between gap-4 overflow-x-auto whitespace-nowrap pb-1 text-xs font-medium text-slate-300 sm:justify-center sm:gap-6 sm:text-sm md:order-none md:w-auto md:pb-0 lg:gap-8">
          {links.map(([label, href]) => <a key={label} href={href} onClick={(event) => handleSectionClick(event, href)} className="transition-colors hover:text-white">{label}</a>)}
        </div>

        {/* Get Started button asli compressor page kholta hai. */}
        <Link to="/compress" className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 sm:px-4 sm:text-sm">
          Get Started <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
