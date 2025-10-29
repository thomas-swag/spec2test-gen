import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, List, Network, TestTube2, Shield, AlertCircle } from "lucide-react";
import { FeatureMapMindMap } from "@/components/FeatureMapMindMap";

interface Feature {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  compliance: string[];
  status: "pending" | "in-progress" | "completed";
}

interface TestCase {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  compliance: string[];
}

// Mock data
const mockFeatures: Feature[] = [
  {
    id: "f1",
    name: "User Authentication",
    description: "Secure user login and registration system",
    status: "completed",
    compliance: ["FDA 21 CFR Part 11", "ISO 27001"],
    testCases: [
      {
        id: "tc1",
        title: "Successful Login with Valid Credentials",
        priority: "high",
        preconditions: ["User account exists", "User is not logged in"],
        steps: [
          "Navigate to login page",
          "Enter valid username",
          "Enter valid password",
          "Click login button"
        ],
        expectedResult: "User is successfully authenticated and redirected to dashboard",
        compliance: ["FDA 21 CFR Part 11 (11.10)"]
      },
      {
        id: "tc2",
        title: "Failed Login with Invalid Password",
        priority: "high",
        preconditions: ["User account exists"],
        steps: [
          "Navigate to login page",
          "Enter valid username",
          "Enter invalid password",
          "Click login button"
        ],
        expectedResult: "Error message displayed, user remains on login page",
        compliance: ["FDA 21 CFR Part 11 (11.10)"]
      }
    ]
  },
  {
    id: "f2",
    name: "Patient Data Management",
    description: "CRUD operations for patient records",
    status: "in-progress",
    compliance: ["HIPAA", "FDA 21 CFR Part 820"],
    testCases: [
      {
        id: "tc3",
        title: "Create New Patient Record",
        priority: "high",
        preconditions: ["User has write permissions", "User is authenticated"],
        steps: [
          "Navigate to patient management",
          "Click 'Add New Patient'",
          "Fill in required fields",
          "Click 'Save'"
        ],
        expectedResult: "Patient record is created and appears in patient list",
        compliance: ["HIPAA Privacy Rule", "FDA 21 CFR Part 820"]
      },
      {
        id: "tc4",
        title: "Update Existing Patient Record",
        priority: "medium",
        preconditions: ["Patient record exists", "User has write permissions"],
        steps: [
          "Navigate to patient list",
          "Select patient record",
          "Click 'Edit'",
          "Update fields",
          "Click 'Save'"
        ],
        expectedResult: "Patient record is updated with audit trail",
        compliance: ["HIPAA", "FDA 21 CFR Part 11 (11.10)"]
      }
    ]
  },
  {
    id: "f3",
    name: "Medical Device Integration",
    description: "Connect and sync data from medical devices",
    status: "pending",
    compliance: ["FDA 21 CFR Part 820", "IEC 62304"],
    testCases: [
      {
        id: "tc5",
        title: "Connect to Medical Device",
        priority: "high",
        preconditions: ["Device is powered on", "Device is in range"],
        steps: [
          "Navigate to device management",
          "Click 'Add Device'",
          "Select device type",
          "Click 'Connect'"
        ],
        expectedResult: "Device is successfully connected and status is displayed",
        compliance: ["FDA 21 CFR Part 820", "IEC 62304"]
      }
    ]
  }
];

const FeatureMap = () => {
  const { id } = useParams();
  const [view, setView] = useState<"list" | "mindmap">("list");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const getStatusColor = (status: Feature["status"]) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "in-progress": return "bg-warning/10 text-warning border-warning/20";
      case "pending": return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: TestCase["priority"]) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/projects/${id}`} className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Feature Map</h1>
              <p className="text-muted-foreground mt-2">
                Visualize project features and their associated test cases
              </p>
            </div>
            
            {/* View Toggle */}
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "mindmap")} className="mt-4 md:mt-0">
              <TabsList>
                <TabsTrigger value="list" className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>List View</span>
                </TabsTrigger>
                <TabsTrigger value="mindmap" className="flex items-center space-x-2">
                  <Network className="w-4 h-4" />
                  <span>Mind Map</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Content */}
        {view === "list" ? (
          <div className="space-y-6">
            {mockFeatures.map((feature) => (
              <Card key={feature.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{feature.name}</CardTitle>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                  
                  {/* Compliance Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {feature.compliance.map((standard) => (
                      <Badge key={standard} variant="outline" className="text-xs">
                        <Shield className="w-3 h-3 mr-1" />
                        {standard}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Test Cases ({feature.testCases.length})
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
                    >
                      {selectedFeature?.id === feature.id ? "Hide Details" : "View Details"}
                    </Button>
                  </div>
                  
                  {selectedFeature?.id === feature.id && (
                    <div className="space-y-4 animate-fade-in">
                      {feature.testCases.map((testCase) => (
                        <Card key={testCase.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <TestTube2 className="w-4 h-4 text-primary" />
                                <h4 className="font-medium text-foreground">{testCase.title}</h4>
                              </div>
                              <Badge className={getPriorityColor(testCase.priority)}>
                                {testCase.priority}
                              </Badge>
                            </div>
                            
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="font-medium text-foreground mb-1">Preconditions:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                  {testCase.preconditions.map((pre, i) => (
                                    <li key={i}>{pre}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Test Steps:</p>
                                <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                                  {testCase.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Expected Result:</p>
                                <p className="text-muted-foreground">{testCase.expectedResult}</p>
                              </div>
                              
                              <div>
                                <p className="font-medium text-foreground mb-1">Compliance:</p>
                                <div className="flex flex-wrap gap-1">
                                  {testCase.compliance.map((c, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {c}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <FeatureMapMindMap features={mockFeatures} />
        )}
      </div>
    </div>
  );
};

export default FeatureMap;
