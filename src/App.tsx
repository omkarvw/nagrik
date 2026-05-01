import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-elevation-1">
        <div className="flex justify-between items-center w-full px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-bold tracking-tight text-on-surface">Nagrik</span>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-primary-container font-semibold" href="#">Home</a>
              <a className="text-on-surface-variant hover:bg-surface-container transition-colors duration-300 px-3 py-1 rounded-lg" href="#">Medicines</a>
              <a className="text-on-surface-variant hover:bg-surface-container transition-colors duration-300 px-3 py-1 rounded-lg" href="#">Stores</a>
              <a className="text-on-surface-variant hover:bg-surface-container transition-colors duration-300 px-3 py-1 rounded-lg" href="#">Help</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full btn-press">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full btn-press">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
            Jan Aushadhi Medicine Portal
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Find affordable generic medicine alternatives and save up to 90% on your healthcare expenses.
          </p>
        </section>

        {/* Design System Demo */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Primary Colors</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary"></div>
                <div>
                  <p className="font-label-lg">Primary</p>
                  <p className="font-label-sm text-on-surface-variant">#8f4e00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-primary-container"></div>
                <div>
                  <p className="font-label-lg">Primary Container</p>
                  <p className="font-label-sm text-on-surface-variant">#ff9933</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-8 border border-outline-variant">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Secondary Colors</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-secondary"></div>
                <div>
                  <p className="font-label-lg">Secondary (Green)</p>
                  <p className="font-label-sm text-on-surface-variant">#056e00</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-secondary-container"></div>
                <div>
                  <p className="font-label-lg">Secondary Container</p>
                  <p className="font-label-sm text-on-surface-variant">#8dfc75</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Demo */}
        <section className="bg-surface-container rounded-2xl p-8 border border-outline-variant mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Typography Scale</h2>
          <div className="space-y-4">
            <p className="font-display-lg text-display-lg text-on-surface">Display Large (48px)</p>
            <p className="font-headline-lg text-headline-lg text-on-surface">Headline Large (32px)</p>
            <p className="font-headline-md text-headline-md text-on-surface">Headline Medium (24px)</p>
            <p className="font-body-lg text-body-lg text-on-surface">Body Large (18px) - Used for descriptions</p>
            <p className="font-body-md text-body-md text-on-surface">Body Medium (16px) - Default body text</p>
            <p className="font-label-lg text-label-lg text-on-surface">Label Large (14px) - Buttons, tags</p>
            <p className="font-label-sm text-label-sm text-on-surface">Label Small (12px) - Captions</p>
          </div>
        </section>

        {/* Component Demo */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-outline-variant card-elevation-1">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Card Component</h3>
            <p className="font-body-md text-on-surface-variant mb-4">Standard card with elevation shadow</p>
            <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg btn-press">
              Primary Button
            </button>
          </div>

          <div className="bg-secondary-container rounded-xl p-6 border border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-secondary-container mb-2">Savings Card</h3>
            <p className="font-body-md text-on-secondary-container/80 mb-4">Highlighted savings display</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-secondary">91%</span>
              <span className="font-label-lg text-on-secondary-container">Savings</span>
            </div>
          </div>

          <div className="bg-surface-container-high rounded-xl p-6 border border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Counter Demo</h3>
            <p className="font-body-md text-on-surface-variant mb-4">Testing interactivity</p>
            <button
              onClick={() => setCount(c => c + 1)}
              className="bg-surface-container-highest text-on-surface px-6 py-3 rounded-xl font-label-lg border border-outline-variant btn-press"
            >
              Count: {count}
            </button>
          </div>
        </section>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-6 px-4 bg-white/80 backdrop-blur-lg border-t border-outline-variant shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <a className="flex flex-col items-center justify-center text-primary-container bg-orange-50 rounded-xl px-4 py-1.5" href="#">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[11px] font-medium mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all" href="#">
          <span className="material-symbols-outlined">pill</span>
          <span className="text-[11px] font-medium mt-1">Medicines</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all" href="#">
          <span className="material-symbols-outlined">location_on</span>
          <span className="text-[11px] font-medium mt-1">Stores</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary-container transition-all" href="#">
          <span className="material-symbols-outlined">support_agent</span>
          <span className="text-[11px] font-medium mt-1">Help</span>
        </a>
      </nav>

      {/* FAB */}
      <button className="fixed right-6 bottom-24 md:bottom-8 bg-primary text-on-primary w-14 h-14 rounded-full flex items-center justify-center shadow-elevation-2 hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined">search</span>
      </button>
    </div>
  )
}

export default App
