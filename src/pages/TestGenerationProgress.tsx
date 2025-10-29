import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

const loadingMessages = [
  "Analyzing PRD document structure...",
  "Extracting requirements and specifications...",
  "Identifying test scenarios...",
  "Generating test cases...",
  "Building structured scenarios...",
  "Mapping compliance standards...",
  "Finalizing test case details..."
];

interface HITLQuestion {
  id: string;
  question: string;
  placeholder: string;
}

const hitlQuestions: HITLQuestion[] = [
  {
    id: "apis",
    question: "What are the key APIs or external integrations in this project?",
    placeholder: "e.g., Payment gateway, Authentication service, Data analytics API..."
  },
  {
    id: "modules",
    question: "What are the main modules or components of the system?",
    placeholder: "e.g., User management, Reporting dashboard, Data processing..."
  },
  {
    id: "dependencies",
    question: "Are there any critical dependencies or third-party libraries?",
    placeholder: "e.g., React, PostgreSQL, AWS S3, Stripe..."
  },
  {
    id: "dataflow",
    question: "How does data flow through your system?",
    placeholder: "e.g., User input → Validation → Database → Response..."
  },
  {
    id: "edge_cases",
    question: "What edge cases or error scenarios should we prioritize?",
    placeholder: "e.g., Network failures, Invalid inputs, Concurrent users..."
  },
  {
    id: "compliance",
    question: "Are there specific compliance requirements or standards to follow?",
    placeholder: "e.g., HIPAA, GDPR, FDA 21 CFR Part 11, ISO 13485..."
  }
];

const TestGenerationProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showHITL, setShowHITL] = useState(false);
  const [hitlAnswers, setHitlAnswers] = useState<Record<string, string>>({});
  const [isProcessingAnswers, setIsProcessingAnswers] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 45) {
          clearInterval(progressInterval);
          setShowHITL(true);
          return 45;
        }
        return prev + 5;
      });
    }, 800);

    // Rotate loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  const handleAnswerChange = (questionId: string, value: string) => {
    setHitlAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitAnswers = async () => {
    setIsProcessingAnswers(true);
    setShowHITL(false);

    // Simulate processing with answers
    const continueProgress = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(continueProgress);
          setIsComplete(true);
          return 100;
        }
        return prev + 8;
      });
    }, 600);

    // Continue rotating messages
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2500);

    setTimeout(() => {
      clearInterval(messageInterval);
    }, 5000);
  };

  const handleComplete = () => {
    toast({
      title: "Test Cases Generated Successfully",
      description: "Your test cases have been enhanced with contextual insights.",
    });
    navigate(`/projects/${id}/feature-map`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Generating Test Cases
          </h1>
          <p className="text-muted-foreground">
            Please wait while we analyze your requirements and generate comprehensive test cases
          </p>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {isComplete ? "Complete" : `Progress: ${progress}%`}
                </span>
                {isComplete && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
              </div>
              <Progress value={progress} className="h-3" />
              
              {!isComplete && (
                <div className="flex items-center justify-center space-x-3 py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground animate-fade-in">
                    {loadingMessages[currentMessageIndex]}
                  </p>
                </div>
              )}
              
              {isComplete && (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold text-success mb-4">
                    Test cases generated successfully!
                  </p>
                  <Button onClick={handleComplete} size="lg">
                    View Feature Map
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Human-in-the-Loop Questions */}
        {showHITL && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Help Us Enhance Your Test Cases</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Answer these questions to help us generate more accurate and comprehensive test cases tailored to your project.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {hitlQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label htmlFor={q.id} className="text-sm font-medium">
                    {q.question}
                  </Label>
                  <Input
                    id={q.id}
                    placeholder={q.placeholder}
                    value={hitlAnswers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
              
              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={handleSubmitAnswers}
                  disabled={isProcessingAnswers}
                  size="lg"
                  className="w-full"
                >
                  {isProcessingAnswers ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Your Inputs...
                    </>
                  ) : (
                    <>
                      Submit & Continue Generation
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You can skip this step, but providing context will improve test case quality
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestGenerationProgress;
