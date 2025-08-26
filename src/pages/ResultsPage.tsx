import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  EyeOff,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SecretBadge } from '@/components/shared/SecretBadge';
import { mockApi } from '@/lib/mockApi';
import { Finding, ScanSummary, Severity } from '@/types';
import { cn } from '@/lib/utils';

export const ResultsPage = () => {
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [showSecrets, setShowSecrets] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const scanHistory = await mockApi.getScanHistory();
        setScans(scanHistory);
        
        // Generate mock findings for the latest scan
        if (scanHistory.length > 0) {
          const { findings: mockFindings } = await mockApi.scan({}, 'hybrid');
          setFindings(mockFindings);
        }
      } catch (error) {
        console.error('Failed to load scan results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredFindings = findings.filter(finding => {
    const matchesSearch = searchQuery === '' || 
      finding.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
      finding.secretType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || finding.severity === severityFilter;

    return matchesSearch && matchesSeverity && !finding.isIgnored;
  });

  const maskSecret = (text: string) => {
    if (showSecrets) return text;
    
    // Mask everything after the first few characters
    if (text.length <= 6) return '••••••';
    return text.slice(0, 4) + '••••••••' + text.slice(-2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">Loading scan results...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Scan Results</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage detected security vulnerabilities
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="findings" className="w-full">
        <TabsList>
          <TabsTrigger value="findings">Security Findings ({filteredFindings.length})</TabsTrigger>
          <TabsTrigger value="history">Scan History ({scans.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="findings" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search files, secret types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as Severity | 'all')}>
                  <SelectTrigger className="w-48">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center gap-2"
                >
                  {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showSecrets ? 'Hide' : 'Show'} Secrets
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Findings List */}
          {filteredFindings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-success mb-4" />
                <h3 className="text-lg font-medium mb-2">No Secrets Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || severityFilter !== 'all' 
                    ? 'No findings match your current filters' 
                    : 'Your code is clean! No security vulnerabilities detected.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFindings.map((finding) => (
                <Card key={finding.id} className={cn(
                  "border-l-4 transition-all duration-200 hover:shadow-md",
                  finding.severity === 'critical' ? "border-l-critical" :
                  finding.severity === 'high' ? "border-l-warning" :
                  finding.severity === 'medium' ? "border-l-warning" :
                  "border-l-muted"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <SecretBadge 
                            secretType={finding.secretType} 
                            severity={finding.severity}
                            confidence={finding.confidence}
                            size="sm"
                          />
                          
                          <Badge variant="outline" className="text-xs">
                            Line {finding.lineStart}
                          </Badge>
                          
                          <Badge variant="outline" className="text-xs">
                            {Math.round(finding.confidence * 100)}% confident
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-3 w-3" />
                          <code>{finding.filePath}</code>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Ignore
                        </Button>
                        <Button variant="outline" size="sm">
                          Create Rule
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Code Preview */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Detected Secret:</div>
                      <div className="bg-critical-light p-3 rounded-md border border-critical/20">
                        <code className="text-sm font-mono">
                          {maskSecret(finding.snippetBefore)}
                        </code>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Suggested Fix:</div>
                      <div className="bg-success-light p-3 rounded-md border border-success/20">
                        <code className="text-sm font-mono text-success">
                          {finding.snippetAfter}
                        </code>
                      </div>
                    </div>

                    {/* AI Reasoning */}
                    {finding.reasoning && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm font-medium mb-1">AI Analysis:</div>
                        <p className="text-sm text-muted-foreground">
                          {finding.reasoning}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {scans.map((scan) => (
            <Card key={scan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {scan.mode.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{scan.sourceName}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(scan.startedAt).toLocaleDateString()}
                      </span>
                      <span>{scan.totals.files} files scanned</span>
                      <span>{scan.totals.findings} findings</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {scan.totals.critical > 0 && (
                        <Badge className="status-critical text-xs">
                          {scan.totals.critical} Critical
                        </Badge>
                      )}
                      {scan.totals.high > 0 && (
                        <Badge variant="outline" className="text-xs text-warning border-warning/50">
                          {scan.totals.high} High
                        </Badge>
                      )}
                      {scan.totals.medium > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {scan.totals.medium} Medium
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      "text-2xl font-bold",
                      scan.riskScore >= 70 ? "text-critical" :
                      scan.riskScore >= 40 ? "text-warning" : "text-success"
                    )}>
                      {scan.riskScore}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Risk Score
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};