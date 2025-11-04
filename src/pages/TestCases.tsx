import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PriorityToggle, TestCaseStatusToggle } from "@/components/StatusToggle";
import { FeatureMapMindMap } from "@/components/FeatureMapMindMap";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  TestTube2,
  Workflow,
  Shield,
  Network,
  List
} from "lucide-react";

// Mock test cases data - 13 test cases for comprehensive visualization
const testCases = [
  {
    id: "TC-001",
    title: "Verify heart rate measurement accuracy",
    requirement: "Device shall measure heart rate with ±2 BPM accuracy",
    steps: [
      "Connect device to patient simulator",
      "Set simulator to 60 BPM",
      "Record device measurement for 30 seconds",
      "Verify measurement is within 58-62 BPM range"
    ],
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-002", 
    title: "Test alarm functionality for critical values",
    requirement: "System shall trigger alarm for HR > 120 BPM within 5 seconds",
    steps: [
      "Set patient simulator to 125 BPM",
      "Start device monitoring",
      "Measure time to alarm activation",
      "Verify alarm triggers within 5 seconds"
    ],
    complianceTags: ["IEC 60601"],
    priority: "Critical",
    status: "Active"
  },
  {
    id: "TC-003",
    title: "Validate data storage integrity",
    requirement: "Device shall store 24 hours of continuous data without loss",
    steps: [
      "Start continuous monitoring session",
      "Monitor for 24 hours",
      "Verify all data points are stored",
      "Check for data corruption or gaps"
    ],
    complianceTags: ["FDA 21 CFR"],
    priority: "Medium",
    status: "Review"
  },
  {
    id: "TC-004",
    title: "Test user authentication security",
    requirement: "System shall require secure user authentication",
    steps: [
      "Attempt login with invalid credentials",
      "Verify access is denied",
      "Test password complexity requirements",
      "Validate session timeout functionality"
    ],
    complianceTags: ["HIPAA"],
    priority: "High", 
    status: "Active"
  },
  {
    id: "TC-005",
    title: "Verify blood pressure measurement range",
    requirement: "Device shall measure BP from 40-280 mmHg",
    steps: [
      "Connect to BP simulator",
      "Test minimum range (40 mmHg)",
      "Test maximum range (280 mmHg)",
      "Verify accuracy at extremes"
    ],
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-006",
    title: "Test battery life under continuous use",
    requirement: "Battery shall last minimum 8 hours continuous use",
    steps: [
      "Fully charge device battery",
      "Start continuous monitoring",
      "Record battery drain rate",
      "Verify 8+ hour operation"
    ],
    complianceTags: ["IEC 60601"],
    priority: "Medium",
    status: "Active"
  },
  {
    id: "TC-007",
    title: "Validate wireless data transmission",
    requirement: "Data shall transmit wirelessly with <1% packet loss",
    steps: [
      "Configure wireless connection",
      "Transmit test data packets",
      "Monitor transmission quality",
      "Verify packet loss <1%"
    ],
    complianceTags: ["FDA 21 CFR"],
    priority: "High",
    status: "Review"
  },
  {
    id: "TC-008",
    title: "Test emergency stop functionality",
    requirement: "Device shall stop immediately when emergency button pressed",
    steps: [
      "Start normal operation",
      "Press emergency stop",
      "Measure response time",
      "Verify immediate cessation"
    ],
    complianceTags: ["IEC 60601"],
    priority: "Critical",
    status: "Active"
  },
  {
    id: "TC-009",
    title: "Verify temperature sensor accuracy",
    requirement: "Temperature sensor accurate to ±0.2°C",
    steps: [
      "Calibrate reference thermometer",
      "Measure known temperature",
      "Compare device reading",
      "Verify within tolerance"
    ],
    complianceTags: ["ISO 13485"],
    priority: "High",
    status: "Active"
  },
  {
    id: "TC-010",
    title: "Test device sterilization compatibility",
    requirement: "Device shall withstand autoclave sterilization cycles",
    steps: [
      "Prepare device for sterilization",
      "Run standard autoclave cycle",
      "Inspect for damage",
      "Verify functionality post-sterilization"
    ],
    complianceTags: ["ISO 13485"],
    priority: "Medium",
    status: "Completed"
  },
  {
    id: "TC-011",
    title: "Validate error logging system",
    requirement: "All errors shall be logged with timestamp",
    steps: [
      "Trigger various error conditions",
      "Check error log entries",
      "Verify timestamp accuracy",
      "Confirm log integrity"
    ],
    complianceTags: ["FDA 21 CFR"],
    priority: "Medium",
    status: "Active"
  },
  {
    id: "TC-012",
    title: "Test display screen visibility",
    requirement: "Display readable in ambient light 0-100k lux",
    steps: [
      "Set up controlled lighting",
      "Test at minimum brightness",
      "Test at maximum brightness",
      "Verify readability across range"
    ],
    complianceTags: ["IEC 60601"],
    priority: "Medium",
    status: "Review"
  },
  {
    id: "TC-013",
    title: "Verify software version tracking",
    requirement: "Software version shall be displayed and traceable",
    steps: [
      "Access device settings",
      "Locate version information",
      "Verify version matches documentation",
      "Test version update process"
    ],
    complianceTags: ["FDA 21 CFR"],
    priority: "Low",
    status: "Active"
  }
];

const TestCases = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testCasesList, setTestCasesList] = useState(testCases);
  const [viewMode, setViewMode] = useState<"list" | "mindmap">("list");

  const filteredTestCases = testCasesList.filter(testCase => {
    const matchesSearch = testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testCase.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "all" || testCase.priority === priorityFilter;
    const matchesStatus = statusFilter === "all" || testCase.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

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

  const handlePriorityChange = (testCaseId: string, newPriority: string) => {
    setTestCasesList(prev => prev.map(tc => 
      tc.id === testCaseId ? { ...tc, priority: newPriority } : tc
    ));
    toast({
      title: "Priority Updated",
      description: `Test case priority changed to ${newPriority}`,
    });
  };

  const handleStatusChange = (testCaseId: string, newStatus: string) => {
    setTestCasesList(prev => prev.map(tc => 
      tc.id === testCaseId ? { ...tc, status: newStatus } : tc
    ));
    toast({
      title: "Status Updated",
      description: `Test case status changed to ${newStatus}`,
    });
  };

  // Transform test cases into features for mind map
  const features = useMemo(() => {
    return [{
      id: "feature-1",
      name: "Medical Device Validation",
      description: "Core validation features",
      testCases: filteredTestCases.map(tc => {
        // Map priority to mind map format
        let priority: "high" | "medium" | "low" = "medium";
        if (tc.priority === "Critical" || tc.priority === "High") {
          priority = "high";
        } else if (tc.priority === "Low") {
          priority = "low";
        }
        
        return {
          id: tc.id,
          title: tc.title,
          priority,
          preconditions: [],
          steps: tc.steps,
          expectedResult: tc.requirement,
          compliance: tc.complianceTags
        };
      }),
      compliance: ["FDA 21 CFR Part 820", "ISO 13485"],
      status: "in-progress" as const
    }];
  }, [filteredTestCases]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/projects/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project Details
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Test Cases</h1>
              <p className="text-muted-foreground mt-2">
                Generated test cases for Medical Device Validation project
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <div className="flex items-center border border-border rounded-lg">
                <Button 
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button 
                  variant={viewMode === "mindmap" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("mindmap")}
                  className="rounded-l-none"
                >
                  <Network className="w-4 h-4 mr-2" />
                  Mind Map
                </Button>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search test cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="all">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mind Map View */}
        {viewMode === "mindmap" && (
          <div className="mb-6">
            <FeatureMapMindMap features={features} />
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <>
            {/* Sync Options */}
            <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Workflow className="w-5 h-5 text-accent" />
              <span>ALM Platform Sync</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => navigate(`/projects/${id}/sync?platform=Jira`)}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Jira</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => navigate(`/projects/${id}/sync?platform=Polarion`)}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Polarion</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center space-x-2"
                onClick={() => navigate(`/projects/${id}/sync?platform=Azure DevOps`)}
              >
                <ExternalLink className="w-4 h-4" />
                <span>Sync to Azure DevOps</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Synchronize test cases directly to your Application Lifecycle Management platforms.
            </p>
          </CardContent>
        </Card>

        {/* Test Cases List */}
        <div className="space-y-4">
          {filteredTestCases.map((testCase) => (
            <Card key={testCase.id} className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-mono text-sm text-muted-foreground">{testCase.id}</span>
                      <PriorityToggle
                        currentPriority={testCase.priority}
                        onPriorityChange={(newPriority) => handlePriorityChange(testCase.id, newPriority)}
                        size="sm"
                      />
                      <TestCaseStatusToggle
                        currentStatus={testCase.status}
                        onStatusChange={(newStatus) => handleStatusChange(testCase.id, newStatus)}
                        size="sm"
                      />
                    </div>
                    <CardTitle className="text-lg mb-2">{testCase.title}</CardTitle>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-1">Requirement:</p>
                      <p className="text-sm text-muted-foreground">{testCase.requirement}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Test Steps */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Test Steps:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      {testCase.steps.map((step, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Compliance Tags */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-accent" />
                      <span>Compliance Standards:</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {testCase.complianceTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Last updated: 2 hours ago
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <TestTube2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Link to={`/projects/${id}/test-cases/${testCase.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

            {filteredTestCases.length === 0 && (
              <Card className="mt-8">
                <CardContent className="text-center py-12">
                  <TestTube2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground">No test cases found</p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestCases;