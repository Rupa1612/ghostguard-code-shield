import { Finding, ScanSummary, Activity, CustomRule, ScanMode, RedactionPlan } from '@/types';

// Mock data generators
const generateFindings = (count: number = 15): Finding[] => {
  const secretTypes = ['APIKey', 'Password', 'Email', 'Token', 'PrivateKey'] as const;
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  const files = [
    'src/config/database.ts',
    'src/utils/auth.js', 
    '.env.example',
    'scripts/deploy.sh',
    'src/components/Login.tsx',
    'backend/services/email.py',
    'config/secrets.json'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `finding-${i + 1}`,
    filePath: files[i % files.length],
    lineStart: Math.floor(Math.random() * 50) + 1,
    lineEnd: Math.floor(Math.random() * 50) + 1,
    secretType: secretTypes[Math.floor(Math.random() * secretTypes.length)],
    fingerprint: `fp-${Math.random().toString(36).substr(2, 9)}`,
    severity: severities[Math.floor(Math.random() * severities.length)],
    confidence: Math.random() * 0.4 + 0.6, // 0.6 - 1.0
    snippetBefore: i === 0 ? 'const API_KEY = "sk-1234567890abcdef"' : 
                   i === 1 ? 'password: "admin123"' :
                   i === 2 ? 'email = "john.doe@company.com"' :
                   `secret_${i} = "hidden_value_${i}"`,
    snippetAfter: i === 0 ? 'const API_KEY = process.env.API_KEY' :
                  i === 1 ? 'password: process.env.ADMIN_PASSWORD' :
                  i === 2 ? 'email = process.env.USER_EMAIL' :
                  `secret_${i} = process.env.SECRET_${i.toString().toUpperCase()}`,
    reasoning: i === 0 ? 'Detected hardcoded API key with typical "sk-" prefix pattern' :
               i === 1 ? 'Weak password found in configuration file' :
               i === 2 ? 'Email address detected in source code' :
               'Pattern matches known secret format',
    isIgnored: Math.random() > 0.8
  }));
};

const generateScanSummary = (findings: Finding[]): ScanSummary => {
  const totals = findings.reduce(
    (acc, f) => {
      acc[f.severity]++;
      return acc;
    },
    { low: 0, medium: 0, high: 0, critical: 0 }
  );

  const riskScore = Math.min(100, 
    totals.critical * 25 + 
    totals.high * 15 + 
    totals.medium * 8 + 
    totals.low * 3
  );

  return {
    id: `scan-${Date.now()}`,
    startedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    finishedAt: new Date().toISOString(),
    mode: 'hybrid',
    totals: {
      files: Math.floor(Math.random() * 20) + 5,
      findings: findings.length,
      ...totals
    },
    riskScore,
    sourceType: Math.random() > 0.5 ? 'repository' : 'files',
    sourceName: Math.random() > 0.5 ? 'github.com/company/project' : '12 files selected'
  };
};

// Mock API functions
export const mockApi = {
  // Scan operations
  async scan(source: { files?: File[], repoUrl?: string }, mode: ScanMode = 'hybrid') {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const findings = generateFindings(Math.floor(Math.random() * 10) + 8);
    const summary = generateScanSummary(findings);
    
    return { summary, findings };
  },

  async getScanHistory(): Promise<ScanSummary[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return Array.from({ length: 5 }, (_, i) => ({
      id: `scan-${i + 1}`,
      startedAt: new Date(Date.now() - i * 86400000).toISOString(),
      finishedAt: new Date(Date.now() - i * 86400000 + 120000).toISOString(),
      mode: ['hybrid', 'regex', 'ai'][i % 3] as ScanMode,
      totals: {
        files: Math.floor(Math.random() * 20) + 5,
        findings: Math.floor(Math.random() * 15) + 3,
        low: Math.floor(Math.random() * 5),
        medium: Math.floor(Math.random() * 5) + 1,
        high: Math.floor(Math.random() * 3) + 1,
        critical: Math.floor(Math.random() * 2)
      },
      riskScore: Math.floor(Math.random() * 40) + 20,
      sourceType: i % 2 === 0 ? 'repository' : 'files',
      sourceName: i % 2 === 0 ? `repo-${i + 1}` : `${Math.floor(Math.random() * 10) + 3} files`
    }));
  },

  // Redaction operations  
  async applyRedactions(plan: RedactionPlan) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate file generation
    const sanitizedFiles = new Blob(['// Sanitized code files...'], { type: 'application/zip' });
    const envFile = new Blob([
      plan.findings.map(f => `${f.envVar}=${f.replacement}`).join('\n')
    ], { type: 'text/plain' });
    
    return {
      sanitizedFiles,
      envFile,
      summary: {
        redactedCount: plan.findings.length,
        filesProcessed: new Set(plan.findings.map(f => f.findingId)).size
      }
    };
  },

  // Rules management
  async getRules(): Promise<CustomRule[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      {
        id: 'rule-1',
        name: 'AWS Access Keys',
        pattern: 'AKIA[0-9A-Z]{16}',
        secretType: 'APIKey',
        severity: 'critical',
        enabled: true,
        description: 'Detects AWS access key IDs',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'rule-2', 
        name: 'GitHub Tokens',
        pattern: 'ghp_[a-zA-Z0-9]{36}',
        secretType: 'Token',
        severity: 'high',
        enabled: true,
        description: 'GitHub personal access tokens',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  },

  async createRule(rule: Omit<CustomRule, 'id' | 'createdAt'>): Promise<CustomRule> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
  },

  // Activity tracking
  async getActivity(): Promise<Activity[]> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return [
      {
        id: 'activity-1',
        type: 'scan',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        summary: 'Scanned repository: github.com/company/project',
        details: { findings: 12, riskScore: 65 }
      },
      {
        id: 'activity-2',
        type: 'redact', 
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        summary: 'Auto-redacted 8 secrets to .env file',
        details: { redactedCount: 8 }
      },
      {
        id: 'activity-3',
        type: 'rule_created',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        summary: 'Created custom rule: "Internal API Keys"',
        details: { ruleName: 'Internal API Keys' }
      }
    ];
  }
};

// Utility functions
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};