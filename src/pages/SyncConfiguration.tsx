import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, Shield, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Mock test cases data - same as TestCases page
const testCases = [
  {
    id: "TC-001",
    title: "Verify heart rate measurement accuracy",
    requirement: "Device shall measure heart rate with ±2 BPM accuracy",
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-002", 
    title: "Test alarm functionality for critical values",
    requirement: "System shall trigger alarm for HR > 120 BPM within 5 seconds",
    complianceTags: ["IEC 60601"],
    priority: "Critical",
    status: "Active"
  },
  {
    id: "TC-003",
    title: "Validate data storage integrity",
    requirement: "Device shall store 24 hours of continuous data without loss",
    complianceTags: ["FDA 21 CFR"],
    priority: "Medium",
    status: "Review"
  },
  {
    id: "TC-004",
    title: "Test user authentication security",
    requirement: "System shall require secure user authentication",
    complianceTags: ["HIPAA"],
    priority: "High", 
    status: "Active"
  },
  {
    id: "TC-005",
    title: "Verify blood pressure measurement range",
    requirement: "Device shall measure BP from 40-280 mmHg",
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-006",
    title: "Test battery life under continuous use",
    requirement: "Battery shall last minimum 8 hours continuous use",
    complianceTags: ["IEC 60601"],
    priority: "Medium",
    status: "Active"
  },
  {
    id: "TC-007",
    title: "Validate wireless data transmission",
    requirement: "Data shall transmit wirelessly with <1% packet loss",
    complianceTags: ["FDA 21 CFR"],
    priority: "High",
    status: "Review"
  },
  {
    id: "TC-008",
    title: "Test emergency stop functionality",
    requirement: "Device shall stop immediately when emergency button pressed",
    complianceTags: ["IEC 60601"],
    priority: "Critical",
    status: "Active"
  },
  {
    id: "TC-009",
    title: "Verify temperature sensor accuracy",
    requirement: "Temperature sensor accurate to ±0.2°C",
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-010",
    title: "Test device sterilization compatibility",
    requirement: "Device shall withstand autoclave sterilization cycles",
    complianceTags: ["ISO 13485"],
    priority: "Medium",
    status: "Completed"
  },
  {
    id: "TC-011",
    title: "Validate error logging system",
    requirement: "All errors shall be logged with timestamp",
    complianceTags: ["FDA 21 CFR"],
    priority: "Medium",
    status: "Active"
  },
  {
    id: "TC-012",
    title: "Test display screen visibility",
    requirement: "Display readable in ambient light 0-100k lux",
    complianceTags: ["IEC 60601"],
    priority: "Medium",
    status: "Review"
  },
  {
    id: "TC-013",
    title: "Verify software version tracking",
    requirement: "Software version shall be displayed and traceable",
    complianceTags: ["FDA 21 CFR"],
    priority: "Low",
    status: "Active"
  }
];

const SyncConfiguration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get platform from query params or state
  const platform = new URLSearchParams(location.search).get("platform") || "Jira";
  
  const [projectName, setProjectName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedTestCases.length === testCases.length) {
      setSelectedTestCases([]);
    } else {
      setSelectedTestCases(testCases.map(tc => tc.id));
    }
  };

  const handleTestCaseToggle = (testCaseId: string) => {
    setSelectedTestCases(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  const handleSync = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a project name",
        variant: "destructive"
      });
      return;
    }
    
    if (!domainName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a domain name",
        variant: "destructive"
      });
      return;
    }
    
    if (!apiKey.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an API key",
        variant: "destructive"
      });
      return;
    }

    if (selectedTestCases.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one test case to sync",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Sync Successful",
        description: `Successfully synced ${selectedTestCases.length} test case(s) to ${platform}`,
      });
      navigate(`/projects/${id}/test-cases`);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "High":
        return "bg-warning/10 text-warning border-warning/20";
      case "Medium":
        return "bg-primary/10 text-primary border-primary/20";
      case "Low":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Review":
        return "bg-warning/10 text-warning border-warning/20";
      case "Completed":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/projects/${id}/test-cases`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Test Cases
          </Button>
          <div className="flex items-center space-x-3">
            <ExternalLink className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Sync to {platform}
              </h1>
              <p className="text-muted-foreground mt-1">
                Configure integration settings and select test cases to sync
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Integration Configuration</CardTitle>
            <CardDescription>
              Enter your {platform} credentials and project details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder={`Enter ${platform} project name`}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domainName">Domain Name</Label>
                <Input
                  id="domainName"
                  placeholder="e.g., yourcompany.atlassian.net"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is used securely to authenticate with {platform}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Cases Selection */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Select Test Cases</CardTitle>
                <CardDescription>
                  Choose which test cases to sync to {platform}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedTestCases.length === testCases.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testCases.map((testCase) => (
                <div 
                  key={testCase.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-all ${
                    selectedTestCases.includes(testCase.id) 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    id={testCase.id}
                    checked={selectedTestCases.includes(testCase.id)}
                    onCheckedChange={() => handleTestCaseToggle(testCase.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Label 
                        htmlFor={testCase.id}
                        className="font-semibold text-foreground cursor-pointer"
                      >
                        {testCase.id}: {testCase.title}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="outline" 
                          className={getPriorityColor(testCase.priority)}
                        >
                          {testCase.priority}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={getStatusColor(testCase.status)}
                        >
                          {testCase.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {testCase.requirement}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-accent" />
                      <div className="flex flex-wrap gap-1">
                        {testCase.complianceTags.map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs text-accent"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedTestCases.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-foreground">
                  {selectedTestCases.length} test case(s) selected for sync
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync Button */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(`/projects/${id}/test-cases`)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSync}
            disabled={isLoading}
            className="min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Sync to {platform}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SyncConfiguration;
