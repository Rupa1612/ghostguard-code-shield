import { useState } from 'react';
import { Shield, Download, FileText, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SecretBadge } from '@/components/shared/SecretBadge';
import { mockApi, downloadBlob } from '@/lib/mockApi';
import { Finding, RedactionPlan } from '@/types';

// Mock findings for demonstration
const mockFindings: Finding[] = [
  {
    id: 'finding-1',
    filePath: 'src/config/database.ts',
    lineStart: 5,
    lineEnd: 5,
    secretType: 'APIKey',
    fingerprint: 'fp-1',
    severity: 'critical',
    confidence: 0.95,
    snippetBefore: 'const API_KEY = "sk-1234567890abcdef"',
    snippetAfter: 'const API_KEY = process.env.API_KEY',
    reasoning: 'Detected hardcoded API key with typical "sk-" prefix',
    envVar: 'API_KEY'
  },
  {
    id: 'finding-2',
    filePath: 'src/utils/auth.js',
    lineStart: 12,
    lineEnd: 12,
    secretType: 'Password',
    fingerprint: 'fp-2',
    severity: 'high',
    confidence: 0.88,
    snippetBefore: 'password: "admin123"',
    snippetAfter: 'password: process.env.ADMIN_PASSWORD',
    reasoning: 'Weak password found in configuration',
    envVar: 'ADMIN_PASSWORD'
  },
  {
    id: 'finding-3',
    filePath: 'backend/config.py',
    lineStart: 8,
    lineEnd: 8,
    secretType: 'Token',
    fingerprint: 'fp-3',
    severity: 'critical',
    confidence: 0.92,
    snippetBefore: 'JWT_SECRET = "your-256-bit-secret"',
    snippetAfter: 'JWT_SECRET = os.environ.get("JWT_SECRET")',
    reasoning: 'JWT secret should not be hardcoded',
    envVar: 'JWT_SECRET'
  }
];

type RedactionState = 'configure' | 'processing' | 'complete';

export const RedactPage = () => {
  const [state, setState] = useState<RedactionState>('configure');
  const [findings] = useState<Finding[]>(mockFindings);
  const [redactionPlan, setRedactionPlan] = useState<RedactionPlan>({
    findings: findings.map(f => ({
      findingId: f.id,
      envVar: f.envVar || f.secretType.toUpperCase(),
      replacement: f.snippetAfter
    })),
    target: 'env'
  });

  const updateEnvVar = (findingId: string, newEnvVar: string) => {
    setRedactionPlan(prev => ({
      ...prev,
      findings: prev.findings.map(f => 
        f.findingId === findingId ? { ...f, envVar: newEnvVar } : f
      )
    }));
  };

  const executeRedaction = async () => {
    setState('processing');
    
    try {
      const result = await mockApi.applyRedactions(redactionPlan);
      
      // Download files
      downloadBlob(result.sanitizedFiles, 'ghostguard-sanitized-code.zip');
      downloadBlob(result.envFile, '.env');
      
      setState('complete');
    } catch (error) {
      console.error('Redaction failed:', error);
      setState('configure');
    }
  };

  if (state === 'processing') {
    return (
      <div className="p-6 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="animate-pulse">
            <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Processing Redaction</h1>
            <p className="text-muted-foreground">
              Sanitizing your code and generating environment variables...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'complete') {
    return (
      <div className="p-6 space-y-6 animate-slide-up">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="bg-success/10 border border-success/20 rounded-full p-8 w-32 h-32 mx-auto flex items-center justify-center">
            <Check className="h-16 w-16 text-success" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Redaction Complete!</h1>
            <p className="text-muted-foreground">
              Your code has been sanitized and keys moved to .env file. Your code is now GhostGuarded.
            </p>
          </div>

          <Card className="text-left">
            <CardHeader>
              <CardTitle className="text-lg">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-medium">Add .env to .gitignore</div>
                  <div className="text-sm text-muted-foreground">Ensure your environment file is not committed to version control</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-medium">Deploy with environment variables</div>
                  <div className="text-sm text-muted-foreground">Configure your production environment with the generated variables</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-medium">Run regular scans</div>
                  <div className="text-sm text-muted-foreground">Keep your code secure with periodic security scans</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => setState('configure')} variant="outline">
              Redact More Files
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Auto-Redaction Wizard</h1>
        <p className="text-muted-foreground mt-1">
          Automatically replace secrets with environment variables
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Export Target</CardTitle>
              <CardDescription>
                Choose where to store your sanitized code and environment variables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={redactionPlan.target} 
                onValueChange={(value) => setRedactionPlan(prev => ({ ...prev, target: value as 'env' | 'vault' }))}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="env" id="env" />
                  <div className="flex-1">
                    <Label htmlFor="env" className="font-medium cursor-pointer">
                      Download .env file
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generate environment file for local development and deployment
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                  <RadioGroupItem value="vault" id="vault" disabled />
                  <div className="flex-1">
                    <Label htmlFor="vault" className="font-medium cursor-not-allowed">
                      Secrets Vault (Coming Soon)
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sync directly to your organization's secrets management system
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Environment Variable Mapping */}
          <Card>
            <CardHeader>
              <CardTitle>Environment Variable Mapping</CardTitle>
              <CardDescription>
                Review and customize the environment variable names for each detected secret
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {findings.map((finding) => {
                const planItem = redactionPlan.findings.find(f => f.findingId === finding.id);
                
                return (
                  <div key={finding.id} className="space-y-3 p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <SecretBadge 
                            secretType={finding.secretType} 
                            severity={finding.severity}
                            size="sm"
                          />
                          <span className="text-sm text-muted-foreground">
                            {finding.filePath}:{finding.lineStart}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Current Code</Label>
                        <div className="bg-critical-light p-2 rounded text-sm font-mono mt-1 border border-critical/20">
                          {finding.snippetBefore}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">After Redaction</Label>
                        <div className="bg-success-light p-2 rounded text-sm font-mono mt-1 border border-success/20">
                          {finding.snippetAfter}
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`env-${finding.id}`} className="text-sm font-medium">
                        Environment Variable Name
                      </Label>
                      <Input
                        id={`env-${finding.id}`}
                        value={planItem?.envVar || ''}
                        onChange={(e) => updateEnvVar(finding.id, e.target.value)}
                        placeholder="ENVIRONMENT_VARIABLE_NAME"
                        className="mt-1 font-mono"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Redaction Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Secrets to redact:</span>
                  <Badge variant="outline">{findings.length}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Files affected:</span>
                  <Badge variant="outline">
                    {new Set(findings.map(f => f.filePath)).size}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Export format:</span>
                  <Badge variant="outline" className="capitalize">
                    {redactionPlan.target}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Security Impact</h4>
                <div className="space-y-1">
                  {findings.filter(f => f.severity === 'critical').length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-critical rounded-full"></div>
                      <span>{findings.filter(f => f.severity === 'critical').length} Critical issues resolved</span>
                    </div>
                  )}
                  {findings.filter(f => f.severity === 'high').length > 0 && (
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span>{findings.filter(f => f.severity === 'high').length} High risk issues resolved</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-medium">Remember</div>
                    <div className="text-muted-foreground mt-1">
                      Add your .env file to .gitignore to prevent accidental commits
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={executeRedaction}
                disabled={redactionPlan.findings.some(f => !f.envVar)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Start Redaction
              </Button>
            </CardContent>
          </Card>

          {/* What Gets Generated */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">sanitized-code.zip</div>
                  <div className="text-muted-foreground text-xs">Clean code with secrets removed</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm">
                  <div className="font-medium">.env</div>
                  <div className="text-muted-foreground text-xs">Environment variables file</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};