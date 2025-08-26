// GhostGuard TypeScript Types

export type SecretType = 
  | 'APIKey' 
  | 'Password' 
  | 'Email' 
  | 'Token' 
  | 'PrivateKey' 
  | 'Certificate' 
  | 'PII' 
  | 'URL' 
  | 'Custom';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type ScanMode = 'regex' | 'ai' | 'hybrid';

export interface Finding {
  id: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  secretType: SecretType;
  fingerprint: string;
  severity: Severity;
  confidence: number; // 0-1
  snippetBefore: string;
  snippetAfter: string;
  reasoning?: string;
  isIgnored?: boolean;
  envVar?: string;
}

export interface ScanSummary {
  id: string;
  startedAt: string;
  finishedAt?: string;
  mode: ScanMode;
  totals: {
    files: number;
    findings: number;
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  riskScore: number; // 0-100
  sourceType: 'files' | 'repository';
  sourceName: string;
}

export interface RedactionPlan {
  findings: Array<{
    findingId: string;
    envVar: string;
    replacement: string;
  }>;
  target: 'env' | 'vault';
}

export interface CustomRule {
  id: string;
  name: string;
  pattern: string;
  secretType: SecretType;
  severity: Severity;
  enabled: boolean;
  description?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'scan' | 'redact' | 'rule_created' | 'rule_updated' | 'finding_ignored';
  timestamp: string;
  summary: string;
  details?: Record<string, any>;
}

export interface ThemePreference {
  mode: 'light' | 'dark' | 'system';
}

export interface AppSettings {
  theme: ThemePreference;
  riskThreshold: number;
  aiMode: boolean;
  telemetry: boolean;
  autoRedact: boolean;
}

// Component Props Types
export interface SecretBadgeProps {
  secretType: SecretType;
  severity: Severity;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

export interface RiskScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}