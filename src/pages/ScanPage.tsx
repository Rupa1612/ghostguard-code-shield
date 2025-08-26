import { useState } from 'react';
import { Upload, Github, FolderOpen, Scan, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dropzone } from '@/components/shared/Dropzone';
import { ScanMode, Finding, ScanSummary } from '@/types';
import { mockApi } from '@/lib/mockApi';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type ScanState = 'idle' | 'scanning' | 'completed' | 'error';

export const ScanPage = () => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanMode, setScanMode] = useState<ScanMode>('hybrid');
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<{summary: ScanSummary, findings: Finding[]} | null>(null);
  const navigate = useNavigate();

  const handleFileDrop = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleScan = async () => {
    if (!repoUrl && selectedFiles.length === 0) {
      return;
    }

    setScanState('scanning');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const source = repoUrl 
        ? { repoUrl } 
        : { files: selectedFiles };
      
      const results = await mockApi.scan(source, scanMode);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setScanResults(results);
        setScanState('completed');
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setScanState('error');
      console.error('Scan failed:', error);
    }
  };

  const resetScan = () => {
    setScanState('idle');
    setProgress(0);
    setScanResults(null);
    setRepoUrl('');
    setSelectedFiles([]);
  };

  if (scanState === 'completed' && scanResults) {
    return (
      <div className="p-6 space-y-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Scan Complete</h1>
            <p className="text-muted-foreground mt-1">
              Security analysis finished successfully
            </p>
          </div>
          <Button variant="outline" onClick={resetScan}>
            New Scan
          </Button>
        </div>

        {/* Results Summary */}
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-success" />
              Scan Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{scanResults.summary.totals.files}</div>
                <div className="text-sm text-muted-foreground">Files Scanned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{scanResults.summary.totals.findings}</div>
                <div className="text-sm text-muted-foreground">Secrets Found</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold",
                  scanResults.summary.riskScore >= 70 ? "text-critical" :
                  scanResults.summary.riskScore >= 40 ? "text-warning" : "text-success"
                )}>
                  {scanResults.summary.riskScore}
                </div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
              </div>
              <div className="text-center">
                <Badge className={cn(
                  scanResults.summary.totals.critical > 0 ? "status-critical" :
                  scanResults.summary.totals.high > 0 ? "status-warning" : 
                  "status-success"
                )}>
                  {scanResults.summary.totals.critical > 0 ? 'Critical' :
                   scanResults.summary.totals.high > 0 ? 'High Risk' : 'Clean'}
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => navigate('/scans')} className="flex-1">
                View Detailed Results
              </Button>
              <Button variant="outline" onClick={() => navigate('/redact')}>
                Auto-Redact Secrets
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Findings Preview */}
        {scanResults.findings.slice(0, 3).map((finding) => (
          <Card key={finding.id} className="border-l-4 border-l-warning">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {finding.secretType}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      finding.severity === 'critical' ? "text-critical border-critical/50" :
                      finding.severity === 'high' ? "text-warning border-warning/50" :
                      "text-muted-foreground"
                    )}>
                      {finding.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="font-mono text-sm text-muted-foreground mb-1">
                    {finding.filePath}:{finding.lineStart}
                  </div>
                  <div className="bg-muted/50 p-2 rounded font-mono text-sm">
                    {finding.snippetBefore}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Security Scanner</h1>
        <p className="text-muted-foreground mt-1">
          Detect and analyze secrets in your code repositories
        </p>
      </div>

      {scanState === 'scanning' ? (
        /* Scanning Progress */
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Scanning in Progress
            </CardTitle>
            <CardDescription>
              Analyzing your code for potential security vulnerabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />
            
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Scanning files...</span>
                <span className="text-muted-foreground">
                  {progress > 20 ? '✓' : '⏳'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Running pattern detection...</span>
                <span className="text-muted-foreground">
                  {progress > 50 ? '✓' : progress > 20 ? '⏳' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span>AI analysis...</span>
                <span className="text-muted-foreground">
                  {progress > 80 ? '✓' : progress > 50 ? '⏳' : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Generating report...</span>
                <span className="text-muted-foreground">
                  {progress > 95 ? '✓' : progress > 80 ? '⏳' : ''}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Scan Configuration */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Scan Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Mode</CardTitle>
              <CardDescription>
                Choose how thoroughly you want to scan for secrets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={scanMode} onValueChange={(value) => setScanMode(value as ScanMode)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Label className="flex flex-col space-y-3 cursor-pointer p-4 border rounded-lg hover:bg-ghost/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regex" />
                      <span className="font-medium">Regex Only</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Fast pattern-based detection. Good for known secret formats.
                    </p>
                  </Label>

                  <Label className="flex flex-col space-y-3 cursor-pointer p-4 border rounded-lg hover:bg-ghost/50 transition-colors border-primary bg-primary/5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hybrid" />
                      <span className="font-medium">Hybrid (Recommended)</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Combines regex patterns with AI analysis for best accuracy.
                    </p>
                  </Label>

                  <Label className="flex flex-col space-y-3 cursor-pointer p-4 border rounded-lg hover:bg-ghost/50 transition-colors">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ai" />
                      <span className="font-medium">AI Analysis</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Deep contextual analysis. Slower but catches edge cases.
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Source Selection */}
          <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="files">Upload Files</TabsTrigger>
              <TabsTrigger value="repository">Repository URL</TabsTrigger>
            </TabsList>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Files or Folders
                  </CardTitle>
                  <CardDescription>
                    Drag and drop your code files or select them manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dropzone onDrop={handleFileDrop} accept=".js,.ts,.py,.go,.java,.php,.rb,.cs,.cpp,.c,.h,.json,.xml,.env" />
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedFiles.slice(0, 6).map((file, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                        {selectedFiles.length > 6 && (
                          <div className="text-sm text-muted-foreground p-2">
                            +{selectedFiles.length - 6} more files...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="repository">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    Repository URL
                  </CardTitle>
                  <CardDescription>
                    Scan a remote Git repository (GitHub, GitLab, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium">Demo Mode</div>
                        <div className="text-muted-foreground mt-1">
                          Repository scanning is simulated for demonstration. 
                          No actual repositories will be accessed.
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleScan}
              disabled={!repoUrl && selectedFiles.length === 0}
              className="px-8"
            >
              <Scan className="mr-2 h-5 w-5" />
              Start Security Scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};