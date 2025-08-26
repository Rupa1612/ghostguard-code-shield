import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Shield, Menu, X, Search, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { ThemeToggle } from './ThemeToggle';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex h-16 items-center gap-4 px-6">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-ghost"
              data-testid="menu-toggle"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2 font-bold text-lg">
              <Shield className="h-6 w-6 text-primary" />
              <span>GhostGuard</span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files, secrets, scans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="global-search"
              />
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="hover:bg-ghost">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside 
          className={cn(
            "border-r bg-card/30 backdrop-blur-sm transition-all duration-300",
            sidebarOpen ? "w-64" : "w-0 overflow-hidden"
          )}
        >
          {sidebarOpen && (
            <div className="p-4">
              <Navigation onNavigate={() => setSidebarOpen(false)} />
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};