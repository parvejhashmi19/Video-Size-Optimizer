# Frontend files ka simple guide

- `src/App.jsx`: `/` aur `/compress` ke routes yahan hain; shared Navbar bhi yahin include hota hai.
- `src/Navbar.jsx`: website ke top links, brand aur Get Started button yahan hain.
- `src/HomePage.jsx`: Home page ke hero, illustration, About, Features, How It Works, CTA aur footer yahan hain.
- `src/CompressionPage.jsx`: compressor ka form aur uska upload/progress/result/download code yahan hai. Is file ko comments ke liye is baar nahi chhua.
- `src/main.jsx`: React app ko HTML ke `#root` area mein start karta hai.
- `src/index.css`: Tailwind ki global CSS yahan load hoti hai.
- `src/App.css`: purani Vite template CSS; filhaal commented aur inactive hai.
- `index.html`: browser tab ka title/icon, mobile viewport aur React mount point yahan hain.
- `vite.config.js`: React aur Tailwind ke dev/build plugins yahan configure hain.
- `package.json`: frontend commands aur packages; JSON format comments allow nahi karta.
- `src/assets/` aur `public/`: images aur SVG icons hain. PNG binary hoti hai, uske andar comment nahi likh sakte.
- `.oxlintrc.json`: lint rules; JSON comments allow nahi karta. `.gitignore` batata hai Git kin files ko ignore kare.
- `node_modules/` packages hain aur `dist/` build output hai; inhe manually edit nahi karna.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
