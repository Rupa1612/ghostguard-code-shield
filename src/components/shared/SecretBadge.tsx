import { Badge } from '@/components/ui/badge';
import { SecretType, Severity } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Key, 
  Lock, 
  Mail, 
  Shield, 
  FileKey, 
  FileText, 
  User, 
  Link, 
  AlertTriangle 
} from 'lucide-react';

interface SecretBadgeProps {
  secretType: SecretType;
  severity: Severity;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const getSecretIcon = (type: SecretType) => {
  const iconProps = { className: "h-3 w-3" };
  
  switch (type) {
    case 'APIKey': return <Key {...iconProps} />;
    case 'Password': return <Lock {...iconProps} />;
    case 'Email': return <Mail {...iconProps} />;
    case 'Token': return <Shield {...iconProps} />;
    case 'PrivateKey': return <FileKey {...iconProps} />;
    case 'Certificate': return <FileText {...iconProps} />;
    case 'PII': return <User {...iconProps} />;
    case 'URL': return <Link {...iconProps} />;
    default: return <AlertTriangle {...iconProps} />;
  }
};

const getSeverityStyle = (severity: Severity) => {
  switch (severity) {
    case 'critical':
      return 'status-critical';
    case 'high':
      return 'bg-critical/10 text-critical border-critical/20';
    case 'medium':
      return 'status-warning-light border-warning/20';
    case 'low':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export const SecretBadge = ({ 
  secretType, 
  severity, 
  confidence, 
  size = 'md',
  showIcon = true 
}: SecretBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm', 
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <Badge 
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border",
        getSeverityStyle(severity),
        sizeClasses[size]
      )}
    >
      {showIcon && getSecretIcon(secretType)}
      
      <span>{secretType}</span>
      
      {confidence && (
        <span className="opacity-75 text-xs">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </Badge>
  );
};