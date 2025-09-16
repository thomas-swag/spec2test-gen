import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  ExternalLink, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Download
} from "lucide-react";

// Mock compliance traceability data
const complianceData = [
  {
    id: 1,
    standard: "FDA 21 CFR Part 820",
    section: "820.30",
    clause: "Design Controls",
    requirement: "Each manufacturer of any class II or class III device shall establish and maintain procedures to control the design of the device in order to ensure that specified design requirements are met.",
    linkedTestCases: [
      { id: "TC-001", title: "Verify heart rate measurement accuracy" },
      { id: "TC-005", title: "Validate design requirement traceability" }
    ],
    coverage: 85,
    status: "Compliant"
  },
  {
    id: 2,
    standard: "IEC 62304",
    section: "5.2",
    clause: "Software requirements analysis",
    requirement: "The manufacturer shall transform the software system requirements allocated to the software item into a documented set of software requirements for the software item.",
    linkedTestCases: [
      { id: "TC-002", title: "Test alarm functionality for critical values" },
      { id: "TC-006", title: "Software requirement validation" }
    ],
    coverage: 92,
    status: "Compliant"
  },
  {
    id: 3,
    standard: "ISO 13485",
    section: "7.3.3",
    clause: "Design and development outputs",
    requirement: "Design and development outputs shall be in a form suitable for verification against the design and development input requirements.",
    linkedTestCases: [
      { id: "TC-003", title: "Validate data storage integrity" }
    ],
    coverage: 67,
    status: "Partial"
  },
  {
    id: 4,
    standard: "FDA Cybersecurity",
    section: "2.0",
    clause: "Cybersecurity Risk Management",
    requirement: "Manufacturers should implement a cybersecurity risk management process that addresses the identification, assessment, and mitigation of cybersecurity risks.",
    linkedTestCases: [
      { id: "TC-004", title: "Test user authentication security" },
      { id: "TC-007", title: "Cybersecurity vulnerability assessment" }
    ],
    coverage: 78,
    status: "Needs Review"
  },
  {
    id: 5,
    standard: "IEC 60601-1-8",
    section: "6.3",
    clause: "Alarm system requirements",
    requirement: "The alarm system shall provide auditory and visual alarm signals that are clearly distinguishable from other sounds and visual indicators.",
    linkedTestCases: [
      { id: "TC-002", title: "Test alarm functionality for critical values" },
      { id: "TC-008", title: "Alarm signal differentiation test" }
    ],
    coverage: 94,
    status: "Compliant"
  }
];

const Compliance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [standardFilter, setStandardFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = complianceData.filter(item => {
    const matchesSearch = item.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.clause.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStandard = standardFilter === "all" || item.standard.includes(standardFilter);
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStandard && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-success/10 text-success border-success/20";
      case "Partial":
        return "bg-warning/10 text-warning border-warning/20";
      case "Needs Review":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "text-success";
    if (coverage >= 70) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "Needs Review":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const uniqueStandards = [...new Set(complianceData.map(item => item.standard.split(' ')[0]))];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compliance Traceability</h1>
            <p className="text-muted-foreground mt-2">
              Track compliance standards and their linked test cases across all projects.
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Compliance Dashboard
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Compliant Standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Partial Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Needs Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-foreground">83%</p>
                  <p className="text-sm text-muted-foreground">Overall Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search standards, clauses, or requirements..."
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
                    value={standardFilter}
                    onChange={(e) => setStandardFilter(e.target.value)}
                    className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                  >
                    <option value="all">All Standards</option>
                    {uniqueStandards.map(standard => (
                      <option key={standard} value={standard}>{standard}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="Compliant">Compliant</option>
                  <option value="Partial">Partial</option>
                  <option value="Needs Review">Needs Review</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-accent" />
              <span>Compliance Traceability Matrix</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {item.standard}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Section {item.section}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status}</span>
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{item.clause}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.requirement}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold ${getCoverageColor(item.coverage)}`}>
                        {item.coverage}%
                      </div>
                      <p className="text-xs text-muted-foreground">Coverage</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-medium text-foreground mb-3">Linked Test Cases:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {item.linkedTestCases.map((testCase) => (
                        <div
                          key={testCase.id}
                          className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                        >
                          <div>
                            <span className="font-mono text-xs text-muted-foreground">{testCase.id}</span>
                            <p className="text-sm font-medium text-foreground">{testCase.title}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredData.length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-foreground">No compliance data found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compliance;