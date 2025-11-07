import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  TestTube2,
  Shield,
  AlertTriangle,
  FileText,
  Clock,
  User,
  Settings,
  Link as LinkIcon
} from "lucide-react";
import { PriorityToggle, TestCaseStatusToggle } from "@/components/StatusToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Extended mock test case data with all required fields
const testCaseData = {
  id: "TC-001",
  featureModule: "User Authentication System",
  title: "Verify heart rate measurement accuracy",
  type: "Positive",
  priority: "High",
  status: "Active",
  preconditions: [
    "Device must be calibrated and functioning properly",
    "Patient simulator must be connected and operational",
    "Test environment temperature between 20-25°C",
    "Device battery level above 50%"
  ],
  testData: [
    { field: "Simulator Heart Rate", value: "60 BPM" },
    { field: "Test Duration", value: "30 seconds" },
    { field: "Acceptable Range", value: "±2 BPM" },
    { field: "Sample Rate", value: "1 Hz" }
  ],
  stepsToExecute: [
    "Connect device to patient simulator using standard cable",
    "Set simulator to generate 60 BPM heart rate signal",
    "Start device monitoring and begin recording measurements",
    "Record device measurement readings for 30 seconds continuously",
    "Calculate average measurement and verify within 58-62 BPM range",
    "Document any deviations or anomalies observed"
  ],
  expectedResults: [
    "Device displays heart rate readings within ±2 BPM of simulator setting",
    "All measurements fall within 58-62 BPM range",
    "No error messages or warnings displayed during test",
    "Measurement stability maintained throughout 30-second period",
    "Device responds within 5 seconds of signal detection"
  ],
  postconditions: [
    "Device returns to standby mode",
    "Test data is automatically saved to device memory",
    "Simulator connection can be safely disconnected",
    "Device remains in operational state for next test"
  ],
  complianceStandard: "FDA 21 CFR Part 820",
  complianceClause: "820.30(g)",
  complianceRequirementText: "Design controls shall include procedures for ensuring that the design requirements relating to a device are appropriate and address the intended use of the device, including the performance and safety requirements.",
  linkedRequirements: [
    {
      id: "REQ-001",
      description: "The system shall measure heart rate with an accuracy of ±2 BPM when tested against a calibrated patient simulator."
    },
    {
      id: "REQ-002",
      description: "The device shall respond to heart rate signal detection within 5 seconds and maintain stable readings throughout the monitoring period."
    }
  ]
};

const TestCaseDetail = () => {
  const { id, testCaseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testCase, setTestCase] = useState(testCaseData);

  const handlePriorityChange = (newPriority: string) => {
    setTestCase(prev => ({ ...prev, priority: newPriority }));
    toast({
      title: "Priority Updated",
      description: `Test case priority changed to ${newPriority}`,
    });
  };

  const handleStatusChange = (newStatus: string) => {
    setTestCase(prev => ({ ...prev, status: newStatus }));
    toast({
      title: "Status Updated", 
      description: `Test case status changed to ${newStatus}`,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Test Case Deleted",
      description: "The test case has been successfully deleted.",
    });
    navigate(`/projects/${id}/test-cases`);
  };

  const handleEdit = () => {
    toast({
      title: "Edit Mode",
      description: "Editing functionality would open here.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/projects/${id}/test-cases`} 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Test Cases
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="font-mono text-sm text-muted-foreground">{testCase.id}</span>
                <PriorityToggle
                  currentPriority={testCase.priority}
                  onPriorityChange={handlePriorityChange}
                  size="sm"
                />
                <TestCaseStatusToggle
                  currentStatus={testCase.status}
                  onStatusChange={handleStatusChange}
                  size="sm"
                />
              </div>
              <h1 className="text-3xl font-bold text-foreground">{testCase.title}</h1>
              <p className="text-muted-foreground mt-2">
                Detailed test case specifications and execution guidelines
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Test Case</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this test case? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <span>Test Case Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Test Case ID</label>
                    <p className="text-sm text-muted-foreground font-mono">{testCase.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Feature / Module</label>
                    <p className="text-sm text-muted-foreground">{testCase.featureModule}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <Badge variant="outline" className="mt-1">{testCase.type}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Title</label>
                    <p className="text-sm text-muted-foreground">{testCase.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-accent" />
                  <span>Test Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testCase.testData.map((data, index) => (
                    <div key={index} className="bg-secondary/50 p-3 rounded-lg">
                      <label className="text-sm font-medium text-foreground">{data.field}</label>
                      <p className="text-sm text-muted-foreground font-mono">{data.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preconditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span>Preconditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testCase.preconditions.map((condition, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-muted-foreground">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Steps to Execute */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube2 className="w-5 h-5 text-primary" />
                  <span>Steps to Execute</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {testCase.stepsToExecute.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Expected Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube2 className="w-5 h-5 text-success" />
                  <span>Expected Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testCase.expectedResults.map((result, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-muted-foreground">{result}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Postconditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>Postconditions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {testCase.postconditions.map((condition, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-sm text-muted-foreground">{condition}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compliance Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <span>Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Compliance Standard</label>
                  <Badge variant="outline" className="mt-1 w-full justify-start">
                    {testCase.complianceStandard}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-foreground">Compliance Clause</label>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{testCase.complianceClause}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-foreground">Compliance Requirement Text</label>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {testCase.complianceRequirementText}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requirement Traceability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LinkIcon className="w-5 h-5 text-accent" />
                  <span>Requirement Traceability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {testCase.linkedRequirements.map((req, index) => (
                  <div key={req.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div>
                      <label className="text-sm font-medium text-foreground">Requirement ID</label>
                      <Badge variant="outline" className="mt-1 w-full justify-start font-mono">
                        {req.id}
                      </Badge>
                    </div>
                    
                    <div className="mt-3">
                      <label className="text-sm font-medium text-foreground">Requirement Description</label>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {req.description}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <Button variant="outline" size="sm" className="w-full">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Link Requirement
                </Button>
              </CardContent>
            </Card>

            {/* Test Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-accent" />
                  <span>Test Metadata</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created:</span>
                  <span className="text-sm text-foreground">Jan 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated:</span>
                  <span className="text-sm text-foreground">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created By:</span>
                  <span className="text-sm text-foreground">John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reviewed By:</span>
                  <span className="text-sm text-foreground">Jane Smith</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseDetail;