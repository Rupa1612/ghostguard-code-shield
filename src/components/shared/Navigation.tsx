import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  FileSearch, 
  Shield, 
  Settings, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavigationProps {
  onNavigate?: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview & quick actions'
  },
  {
    name: 'Run Scan', 
    href: '/scan',
    icon: Scan,
    description: 'Scan files or repositories'
  },
  {
    name: 'Recent Scans',
    href: '/scans',
    icon: FileSearch,
    description: 'View scan history'
  },
  {
    name: 'Redaction',
    href: '/redact', 
    icon: Shield,
    description: 'Auto-redact secrets'
  },
  {
    name: 'Rules',
    href: '/rules',
    icon: AlertTriangle,
    description: 'Custom detection rules'
  },
  {
    name: 'Activity',
    href: '/activity',
    icon: Activity,
    description: 'Security timeline'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences'
  }
];

export const Navigation = ({ onNavigate }: NavigationProps) => {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href || 
           (href !== '/' && location.pathname.startsWith(href));
  };

  return (
    <nav className="space-y-2">
      {/* Quick Status */}
      <div className="mb-6 p-3 bg-success-light rounded-lg border border-success/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-4 w-4 text-success" />
          <span className="text-sm font-medium text-success">System Status</span>
        </div>
        <p className="text-xs text-success/80">
          All scans up to date
        </p>
      </div>

      {/* Main Navigation */}
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        
        return (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
              active 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground hover:bg-ghost"
            )}
            data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
          >
            <Icon className={cn(
              "h-4 w-4 transition-colors",
              active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
            )} />
            
            <div className="flex-1">
              <div className={cn(
                "font-medium",
                active ? "text-primary-foreground" : ""
              )}>
                {item.name}
              </div>
              <div className={cn(
                "text-xs opacity-75 mt-0.5",
                active ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {item.description}
              </div>
            </div>

            {/* Status badges */}
            {item.name === 'Recent Scans' && (
              <Badge variant="secondary" className="text-xs">
                12
              </Badge>
            )}
            {item.name === 'Activity' && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            )}
          </NavLink>
        );
      })}

      {/* Quick Actions */}
      <div className="pt-6 mt-6 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h4>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 h-8"
            asChild
          >
            <NavLink to="/scan">
              <Scan className="h-3 w-3" />
              Quick Scan
            </NavLink>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 h-8 text-muted-foreground"
            asChild
          >
            <NavLink to="/activity">
              <Clock className="h-3 w-3" />
              Last Activity
            </NavLink>
          </Button>
        </div>
      </div>
    </nav>
  );
};