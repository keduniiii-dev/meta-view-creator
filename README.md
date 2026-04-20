# Meta-Verse - 3D Architectural Visualization Platform

A modern, high-performance marketing website for Meta-Verse, a leading provider of photorealistic 3D visualization services for developers, architects, and urban planners.

## 🎯 Overview

Meta-Verse transforms how the world visualizes architectural projects through cutting-edge 3D technology. This website showcases our services, case studies, and expertise in accelerating project approvals and stakeholder communication.

## ✨ Features

### Pages & Routes
- **Home (`/`)** - Hero section with value proposition, how it works, case studies, problem/solution overview, and CTA
- **Services (`/services`)** - Detailed service offerings with 6 core services, our process, and consultation CTA
- **Case Studies (`/case-studies`)** - In-depth project showcases with challenges, solutions, and metrics
- **Blog (`/blog`)** - Thought leadership content with category filtering and article metadata
- **About (`/about`)** - Company mission, vision, core values, team profiles, and company statistics

### Core Components
- **Dynamic Demo Dialog** - Contextual demo booking form accessible from throughout the site
- **Navigation** - Responsive navbar with smooth scrolling and mobile support
- **Footer** - Comprehensive site navigation and company information
- **3D Visualization Showcase** - Hero section with 3D architectural imagery
- **Shadcn UI Components** - Pre-built, accessible UI components (buttons, dialogs, badges, etc.)

### Design & Experience
- ✅ Smooth animations with Framer Motion
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark/light theme support via Tailwind CSS
- ✅ Accessible components (WCAG compliant)
- ✅ SEO optimized structure
- ✅ Fast performance with Vite

## 🛠 Tech Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling

### Libraries & Tools
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Query** - State management & data fetching
- **Shadcn UI** - Pre-built component library
- **Lucide React** - Icon library
- **Radix UI** - Headless UI components

### Backend & SSR
- **Express.js** - Node.js server framework
- **Vite SSR** - Server-side rendering capability

## 📁 Project Structure

```
meta-view-creator/
├── src/
│   ├── components/
│   │   ├── ui/                    # Shadcn UI components
│   │   ├── Navbar.tsx             # Main navigation
│   │   ├── Footer.tsx             # Site footer
│   │   ├── HeroSection.tsx         # Home hero
│   │   ├── CaseStudiesSection.tsx  # Home case studies
│   │   ├── BookDemoDialog.tsx      # Demo request form
│   │   └── ...other components
│   ├── pages/
│   │   ├── Index.tsx              # Home page
│   │   ├── Services.tsx           # Services page
│   │   ├── CaseStudies.tsx        # Case studies page
│   │   ├── Blog.tsx               # Blog page
│   │   ├── About.tsx              # About page
│   │   └── NotFound.tsx           # 404 page
│   ├── contexts/
│   │   └── DemoDialogContext.tsx  # Global demo dialog state
│   ├── hooks/
│   │   └── use-toast.ts           # Toast notifications
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # React entry point
│   ├── entry-server.ts            # SSR entry point
│   └── index.css                  # Global styles
├── public/
│   └── robots.txt                 # SEO metadata
├── server.ts                      # Express SSR server
├── vite.config.ts                 # Vite configuration
├── tailwind.config.ts             # Tailwind styling config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun runtime
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meta-view-creator
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 📦 Available Scripts

### Development
```bash
bun run dev              # Start Vite dev server (port 8080)
bun run lint             # Run ESLint
bun run test             # Run tests once
bun run test:watch       # Run tests in watch mode
```

### Production Build
```bash
bun run build            # Build for production
bun run build:dev        # Build in development mode
bun run preview          # Preview production build locally
```

### SSR (Server-Side Rendering)
```bash
bun run build:client     # Build client assets to dist/client
bun run build:ssr        # Build SSR server bundle to dist/server
bun run build:full       # Build both client and server
bun run preview:ssr      # Run SSR server locally (port 3000)
```

## 🎨 Styling & Design

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theme customization
- **Dark theme** support built-in
- **Responsive Design** - Mobile-first approach
- **Animations** - Smooth Framer Motion transitions

### Color Scheme
- Primary color for CTAs and highlights
- Hero background for dark sections
- Muted tones for secondary elements
- Gradient text effects for emphasis

## 🔐 Form & Data Handling

### Demo Dialog Form
The "Book a Demo" dialog captures:
- First/Last Name
- Email (required)
- Phone
- Company (required)
- Job Title
- Country (dropdown)
- Newsletter consent checkbox

Form validation and toast notifications are included.

## 🌐 Routing Structure

All routes use React Router with automatic code splitting:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Index | Home page with full overview |
| `/services` | Services | Detailed service offerings |
| `/case-studies` | CaseStudies | Project showcases |
| `/blog` | Blog | Thought leadership articles |
| `/about` | About | Company information & team |
| `*` | NotFound | 404 error page |

## ⚙️ Configuration

### Vite Config
- Configured for SPA and SSR modes
- Path alias `@` pointing to `src/`
- React Fast Refresh for HMR
- Component tagging for development

### Tailwind Config
- Custom color palette (hero, primary, etc.)
- Responsive breakpoints
- Custom animations
- Extended typography

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loading via React Router
- **Image Optimization** - Responsive images with proper dimensions
- **CSS Purging** - Tailwind removes unused styles
- **Tree Shaking** - Unused code removed in production
- **Compression** - Gzip/Brotli compression on server

## 📱 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- IE11 not supported

## 🔄 SSR (Server-Side Rendering)

This project includes optional SSR capabilities:

1. **Development**: Run with Vite dev server (CSR)
2. **Production**: Build and run with Express server (SSR-ready)

### SSR Benefits
- Better SEO (server-rendered HTML)
- Faster initial page load
- Improved performance on slow connections

### To use SSR:
```bash
bun run build:full       # Build for both client and server
bun run preview:ssr      # Run SSR server on port 3000
```

## 🎯 Next Steps / Future Enhancements

- [ ] Add actual blog articles with content management
- [ ] Implement contact form backend integration
- [ ] Add image gallery for case studies
- [ ] Integrate analytics
- [ ] Add testimonials carousel
- [ ] Implement team member profiles with images
- [ ] Add FAQ accordion section
- [ ] Newsletter signup integration

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Contact & Support

- Email: hello@meta-dology.com
- Website: https://meta-verse.com

---

**Built with ❤️ by the Meta-Verse team**
