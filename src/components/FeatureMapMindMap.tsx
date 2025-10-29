import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface FeatureMapMindMapProps {
  features: Feature[];
}

const getStatusColor = (status: Feature["status"]) => {
  switch (status) {
    case "completed": return "#10b981";
    case "in-progress": return "#f59e0b";
    case "pending": return "#6b7280";
  }
};

const getPriorityColor = (priority: TestCase["priority"]) => {
  switch (priority) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#6b7280";
  }
};

export const FeatureMapMindMap = ({ features }: FeatureMapMindMapProps) => {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    
    // Root node
    nodes.push({
      id: "root",
      type: "default",
      data: { 
        label: (
          <div className="px-4 py-2">
            <div className="font-bold text-lg">Project Features</div>
            <div className="text-xs text-muted-foreground">{features.length} features</div>
          </div>
        )
      },
      position: { x: 400, y: 50 },
      style: {
        background: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        border: "2px solid hsl(var(--primary))",
        borderRadius: "8px",
        fontSize: "14px",
        width: 200,
      },
      sourcePosition: Position.Bottom,
    });

    // Feature nodes
    features.forEach((feature, featureIndex) => {
      const featureX = 150 + (featureIndex * 350);
      const featureY = 250;
      
      nodes.push({
        id: feature.id,
        type: "default",
        data: { 
          label: (
            <div className="px-3 py-2">
              <div className="font-semibold text-sm mb-1">{feature.name}</div>
              <Badge 
                style={{ 
                  backgroundColor: getStatusColor(feature.status),
                  fontSize: "10px",
                  padding: "2px 6px"
                }}
              >
                {feature.status}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                {feature.testCases.length} test cases
              </div>
            </div>
          )
        },
        position: { x: featureX, y: featureY },
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: `2px solid ${getStatusColor(feature.status)}`,
          borderRadius: "8px",
          fontSize: "12px",
          width: 220,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      // Test case nodes
      feature.testCases.forEach((testCase, testIndex) => {
        const testY = 450 + (testIndex * 120);
        
        nodes.push({
          id: testCase.id,
          type: "default",
          data: { 
            label: (
              <div className="px-3 py-2">
                <div className="text-xs font-medium mb-1">{testCase.title}</div>
                <Badge 
                  style={{ 
                    backgroundColor: getPriorityColor(testCase.priority),
                    fontSize: "9px",
                    padding: "2px 4px"
                  }}
                >
                  {testCase.priority}
                </Badge>
              </div>
            )
          },
          position: { x: featureX - 50, y: testY },
          style: {
            background: "hsl(var(--secondary))",
            color: "hsl(var(--secondary-foreground))",
            border: `1px solid ${getPriorityColor(testCase.priority)}`,
            borderRadius: "6px",
            fontSize: "11px",
            width: 200,
          },
          targetPosition: Position.Top,
        });
      });
    });

    return nodes;
  }, [features]);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    
    // Connect root to features
    features.forEach((feature) => {
      edges.push({
        id: `root-${feature.id}`,
        source: "root",
        target: feature.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--primary))",
        },
      });

      // Connect features to test cases
      feature.testCases.forEach((testCase) => {
        edges.push({
          id: `${feature.id}-${testCase.id}`,
          source: feature.id,
          target: testCase.id,
          type: "smoothstep",
          style: { 
            stroke: getStatusColor(feature.status), 
            strokeWidth: 1.5 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: getStatusColor(feature.status),
          },
        });
      });
    });

    return edges;
  }, [features]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className="w-full h-[800px] overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.id === "root") return "hsl(var(--primary))";
            return "hsl(var(--secondary))";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </Card>
  );
};
