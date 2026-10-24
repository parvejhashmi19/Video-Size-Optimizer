// Ye Home page file hai: hero, illustration, About, Features, steps, CTA aur footer yahin hain.
import { Link } from "react-router-dom"

// Features cards ka text, rang aur SVG icon is list mein edit karo.
const features = [
  { title: "Smaller video files", description: "Reduce file size to make videos easier to store and share.", color: "bg-emerald-100 text-emerald-600", icon: <path d="M13 2 4 14h6l-1 8 11-13h-7l1-7Z" /> },
  { title: "Common formats", description: "Work with popular video formats supported by the compressor.", color: "bg-sky-100 text-sky-600", icon: <><path d="M12 3 4.5 6v5.5c0 4.7 3.2 8 7.5 9.5 4.3-1.5 7.5-4.8 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></> },
  { title: "Simple process", description: "Choose a video and target size with a clear, easy-to-follow flow.", color: "bg-rose-100 text-rose-600", icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
  { title: "Ready to share", description: "Create a more compact file for email, messaging, or social posts.", color: "bg-violet-100 text-violet-600", icon: <><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M8 21h8m-4-4v4m-4-13 3 2 3-2 3 3" /></> },
]

// How It Works ke chaar steps ka text aur icon yahan edit karo.
const steps = [
  { number: "01", title: "Upload video", description: "Choose a video file from your device.", icon: <><path d="M12 16V4m-5 5 5-5 5 5" /><path d="M5 14v5h14v-5" /></> },
  { number: "02", title: "Choose size", description: "Enter the target size you want.", icon: <><path d="M4 7h16M4 12h16M4 17h16" /><circle cx="9" cy="7" r="2" fill="currentColor" /><circle cx="15" cy="12" r="2" fill="currentColor" /><circle cx="8" cy="17" r="2" fill="currentColor" /></> },
  { number: "03", title: "Compress", description: "Let the tool process your video.", icon: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.9h-3l-.3-1.9a8 8 0 0 1-1.8-1l-1.7.7-1.5-2.6 1.5-1.1a8 8 0 0 1 0-2l-1.5-1.1 1.5-2.6 1.7.7a8 8 0 0 1 1.8-1l.3-1.9h3l.3 1.9a8 8 0 0 1 1.8 1l1.7-.7 1.5 2.6-1.5 1.1a8 8 0 0 1 0 2Z" transform="translate(-1 -1) scale(.95)" /></> },
  { number: "04", title: "Download", description: "Save the compressed file to your device.", icon: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 17v4h14v-4" /></> },
]

// Hero ke right side ka video file illustration is function mein bana hai.
function VideoCompressionIllustration() {
  return (
    <div className="mx-auto w-full max-w-[460px]" role="img" aria-label="Illustration showing a large video file becoming smaller">
      <div className="rounded-2xl border border-white/10 bg-slate-900/75 p-4 shadow-xl shadow-slate-950/30 sm:p-5">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-300" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs font-medium text-slate-400">Video size optimizer</span>
        </div>
                {/* SVG ka viewBox drawing ka area hai; width 100% hone se ye container ke saath scale hota hai. */}
<svg width="560" height="300" viewBox="0 0 560 300" style={{ width: "100%", height: "auto" }} className="mx-auto block" aria-hidden="true" fill="none">
          <defs>
            <linearGradient id="largeFile" x1="90" y1="42" x2="240" y2="260" gradientUnits="userSpaceOnUse"><stop stopColor="#A5B4FC" /><stop offset="1" stopColor="#6366F1" /></linearGradient>
            <linearGradient id="smallFile" x1="370" y1="112" x2="490" y2="262" gradientUnits="userSpaceOnUse"><stop stopColor="#67E8F9" /><stop offset="1" stopColor="#3B82F6" /></linearGradient>
          </defs>
          {/* Bada video file card aur uska play symbol yahan se shuru hota hai. */}
          <rect x="62" y="38" width="174" height="222" rx="24" fill="url(#largeFile)" />
          <rect x="76" y="52" width="146" height="194" rx="17" fill="#0F172A" fillOpacity=".16" />
          <circle cx="149" cy="126" r="35" fill="white" fillOpacity=".22" /><path d="m143 109 28 17-28 17v-34Z" fill="white" />
          <text x="149" y="208" fill="white" fontSize="20" fontWeight="700" textAnchor="middle">250 MB</text>
          <path d="M250 149h91" stroke="#60A5FA" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" /><path d="m330 136 14 13-14 13" stroke="#67E8F9" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="294" cy="149" r="23" fill="#1E293B" stroke="#64748B" /><path d="m286 149 6 6 11-13" stroke="#A5F3FC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {/* Chhota output file card yahan hai. */}
          <rect x="360" y="91" width="138" height="169" rx="22" fill="url(#smallFile)" /><rect x="372" y="103" width="114" height="145" rx="16" fill="#0F172A" fillOpacity=".15" />
          <circle cx="429" cy="151" r="28" fill="white" fillOpacity=".22" /><path d="m424 137 22 14-22 14v-28Z" fill="white" /><text x="429" y="216" fill="white" fontSize="19" fontWeight="700" textAnchor="middle">25 MB</text>
          <text x="149" y="285" fill="#CBD5E1" fontSize="14" textAnchor="middle">Large video</text><text x="429" y="285" fill="#CBD5E1" fontSize="14" textAnchor="middle">Smaller file</text>
        </svg>
        <p className="mt-1 text-center text-xs text-slate-400">Example only. Results vary by video and settings.</p>
      </div>
    </div>
  )
}

function HomePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* HERO: heading, short detail, CTA buttons, benefit labels aur illustration. */}
      <section id="home" className="scroll-mt-28 bg-gradient-to-br from-slate-950 via-[#0b1730] to-blue-950 px-5 pb-12 pt-28 text-white sm:px-8 sm:pb-14 sm:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-9 md:grid-cols-[1.05fr_0.95fr] md:gap-8 lg:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-sky-300 sm:text-base">Simple video compression</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">Optimize Your Videos <span className="block">Without <span className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-transparent">Losing Quality</span></span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">Reduce video size with a straightforward tool. Choose a target size and prepare your videos for easier sharing.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/compress" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">↓ Reduce Video Size <span aria-hidden="true">→</span></Link>
              <a href="#features" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">Learn More</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm font-medium text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">✓ Smaller Size</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">✓ Simple Controls</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">✓ Easy Sharing</span>
            </div>
          </div>
          <VideoCompressionIllustration />
        </div>
      </section>

      {/* ABOUT: tool ka chhota introduction. */}
      <section id="about" className="scroll-mt-28 bg-slate-50 px-5 py-12 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-semibold text-blue-600">About the tool</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">A simple way to prepare video files</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">Set a target size and use a clear workflow to create a more compact video file for your needs.</p>
        </div>
      </section>

      {/* FEATURES: chaar cards upar wali features list se bante hain. */}
      <section id="features" className="scroll-mt-28 bg-white px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl"><div className="text-center"><p className="text-sm font-semibold text-blue-600">Useful tools, clear steps</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Why use Video Size Optimizer?</h2></div>
          {/* Responsive grid: mobile par 1, tablet par 2, desktop par 4 columns. */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => <article key={feature.title} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"><span className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.color}`}><svg width="20" height="20" viewBox="0 0 24 24" className="block" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{feature.icon}</svg></span><h3 className="mt-4 font-semibold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p></article>)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS: upload, size choose, compress aur download ke steps. */}
      <section id="how-it-works" className="scroll-mt-28 bg-slate-50 px-5 py-12 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl"><div className="text-center"><p className="text-sm font-semibold text-blue-600">Four clear steps</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2><p className="mt-3 text-slate-600">From your video file to a ready-to-save result.</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => <article key={step.number} className="rounded-xl border border-slate-200 bg-white p-5 text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><svg width="22" height="22" viewBox="0 0 24 24" className="block" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{step.icon}</svg></span><p className="mt-3 text-xs font-bold tracking-widest text-blue-600">STEP {step.number}</p><h3 className="mt-1 font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p></article>)}
          </div>
        </div>
      </section>

      {/* CTA banner: button user ko /compress page par bhejta hai. */}
      <section className="px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 rounded-2xl bg-slate-950 px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8"><div><h2 className="text-xl font-bold">Ready to reduce your video size?</h2><p className="mt-1 text-sm text-slate-300">Choose a target size and get started in a few steps.</p></div><Link to="/compress" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold hover:bg-blue-500">Reduce Video Size <span className="ml-2" aria-hidden="true">→</span></Link></div></section>

      {/* FOOTER: brand, quick links, feature names aur contact status. */}
      <footer id="contact" className="scroll-mt-28 bg-slate-950 px-5 py-10 text-slate-300 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><Link to="/" className="font-bold text-white">Video Size Optimizer</Link><p className="mt-3 max-w-xs text-sm leading-6">A straightforward way to make video files more compact for sharing.</p></div>
          <div><h2 className="text-sm font-semibold text-white">Quick Links</h2><ul className="mt-3 space-y-2 text-sm"><li><a href="/#home" className="hover:text-white">Home</a></li><li><a href="/#about" className="hover:text-white">About</a></li><li><a href="/#features" className="hover:text-white">Features</a></li><li><a href="/#how-it-works" className="hover:text-white">How It Works</a></li></ul></div>
          <div><h2 className="text-sm font-semibold text-white">Features</h2><ul className="mt-3 space-y-2 text-sm"><li>Video size reduction</li><li>Common video formats</li><li>Target size control</li><li>Downloadable results</li></ul></div>
          <div><h2 className="text-sm font-semibold text-white">Contact</h2><p className="mt-3 text-sm">hashmiparvej19@gmail.com</p></div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-slate-400">© {new Date().getFullYear()} Video Size Optimizer</div>
      </footer>
    </main>
  )
}

export default HomePage
