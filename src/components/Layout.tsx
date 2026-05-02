import { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant shadow-elevation-1">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
              Nagrik
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `font-semibold transition-colors px-3 py-1 rounded-lg ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/medicines"
                className={({ isActive }) =>
                  `transition-colors px-3 py-1 rounded-lg ${
                    isActive
                      ? 'text-primary bg-orange-50'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                Medicines
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-24 md:pb-8">{children}</main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center pt-2 pb-6 px-4 bg-white/90 backdrop-blur-lg border-t border-outline-variant shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl px-3 py-1 ${
              isActive ? 'text-primary-container bg-orange-50' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="text-[10px] font-medium mt-0.5">Home</span>
        </NavLink>
        <NavLink
          to="/medicines"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center rounded-xl px-3 py-1 ${
              isActive ? 'text-primary-container bg-orange-50' : 'text-on-surface-variant'
            }`
          }
        >
          <span className="material-symbols-outlined text-xl">pill</span>
          <span className="text-[10px] font-medium mt-0.5">Medicines</span>
        </NavLink>
      </nav>
    </div>
  );
}
