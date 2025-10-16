import { NavLink } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-sidebar-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <img 
              src="/factoryOS.png" 
              alt="FactoryOS Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <h1 className="text-2xl font-bold tracking-tight">FactoryOS</h1>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/digital-twin"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Digital Twin
            </NavLink>
            <NavLink
              to="/procurement"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Procurement
            </NavLink>
            <NavLink
              to="/workforce"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Workforce
            </NavLink>
            <NavLink
              to="/file-viewer"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              File Viewer
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Orders
            </NavLink>
            <NavLink
              to="/warehouse"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-smooth ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                }`
              }
            >
              Warehouse
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
