import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scan, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  FileText,
  ArrowRight,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskScoreMeter } from '@/components/shared/RiskScoreMeter';
import { SecretBadge } from '@/components/shared/SecretBadge';
import { mockApi } from '@/lib/mockApi';
import { ScanSummary, Finding } from '@/types';
import { cn } from '@/lib/utils';

export const Dashboard = () => {
  const [recentScans, setRecentScans] = useState<ScanSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const scans = await mockApi.getScanHistory();
        setRecentScans(scans.slice(0, 3));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const latestScan = recentScans[0];
  const totalFindings = recentScans.reduce((sum, scan) => sum + scan.totals.findings, 0);
  const avgRiskScore = recentScans.length > 0 
    ? recentScans.reduce((sum, scan) => sum + scan.riskScore, 0) / recentScans.length 
    : 0;

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Keep your code ghost-clean with automated secret detection
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/scan">
              <Scan className="mr-2 h-4 w-4" />
              Quick Scan
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Risk Score */}
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Risk</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RiskScoreMeter 
              score={latestScan?.riskScore || 0} 
              size="sm" 
              showLabel={false}
            />
          </CardContent>
        </Card>

        {/* Total Scans */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentScans.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        {/* Secrets Found */}
        <Card className="bg-gradient-to-br from-warning/5 to-warning/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Secrets Detected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFindings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all scans
            </p>
          </CardContent>
        </Card>

        {/* Protected Status */}
        <Card className="bg-gradient-to-br from-success/5 to-success/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
              <Shield className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-medium text-success">Active</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems monitored
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>Latest security assessments</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/scans">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <Scan className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">No scans yet</h3>
                <p className="text-muted-foreground mt-2">
                  Keep your code ghost-clean. Start a Quick Scan.
                </p>
                <Button className="mt-4" asChild>
                  <Link to="/scan">Start First Scan</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div 
                    key={scan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-ghost/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {scan.mode.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">
                          {scan.sourceName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{scan.totals.files} files</span>
                        <span>{scan.totals.findings} findings</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(scan.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
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
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={cn(
                        "text-lg font-bold",
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common security tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link to="/scan">
                <Scan className="mr-2 h-4 w-4" />
                Run New Scan
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/rules">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Manage Rules
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/activity">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Activity
              </Link>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/redact">
                <Shield className="mr-2 h-4 w-4" />
                Auto Redact
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};