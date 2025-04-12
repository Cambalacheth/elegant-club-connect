
import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  ConnectionLineType,
  MarkerType
} from '@xyflow/react';
import { Domain } from '@/hooks/useDomains';
import '@xyflow/react/dist/style.css';

interface DomainGraphProps {
  domains: Domain[];
  currentLanguage: string;
  onNodeClick: (domainId: string) => void;
}

const getNodeColor = (status: string) => {
  switch (status) {
    case 'available':
      return '#4ade80'; // Green
    case 'reserved':
      return '#fbbf24'; // Amber
    case 'used':
      return '#60a5fa'; // Blue
    default:
      return '#d1d5db'; // Gray
  }
};

const getNodeSize = (name: string, path: string, description: string, status: string) => {
  const contentLength = (name.length + path.length + (description?.length || 0));
  // Base size on content length, with min/max size bounds
  // Make used domains slightly larger
  const baseSize = Math.min(Math.max(contentLength / 4, 100), 250);
  return status === 'used' ? baseSize * 1.2 : baseSize;
};

const DomainGraph: React.FC<DomainGraphProps> = ({ domains, currentLanguage, onNodeClick }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize nodes and edges based on domains
  useEffect(() => {
    if (!domains.length) return;

    // Create nodes from domains
    const domainNodes: Node[] = domains.map((domain, index) => {
      const nodeSize = getNodeSize(domain.name, domain.path, domain.description, domain.status);
      return {
        id: domain.id,
        data: { 
          label: domain.name,
          description: domain.description,
          path: domain.path,
          status: domain.status
        },
        position: {
          // Position nodes in a circular pattern
          x: 400 + 350 * Math.cos(2 * Math.PI * index / domains.length),
          y: 400 + 350 * Math.sin(2 * Math.PI * index / domains.length),
        },
        style: {
          background: getNodeColor(domain.status),
          width: nodeSize,
          height: nodeSize,
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          border: domain.status === 'used' ? '4px solid white' : '2px solid white',
          fontSize: Math.min(14 + domain.name.length / 10, 22),
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: domain.status === 'used' 
            ? '0 8px 16px -2px rgb(0 0 0 / 0.2), 0 4px 8px -2px rgb(0 0 0 / 0.2)'
            : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        }
      };
    });

    // Add a central "Terreta Hub" node
    const centralNode: Node = {
      id: 'terreta-hub',
      data: { 
        label: 'Terreta Hub',
        description: currentLanguage === 'en' ? 'Central Hub' : 'Núcleo Central',
        path: '/',
        status: 'hub'
      },
      position: { x: 400, y: 400 },
      style: {
        background: '#8b5cf6', // Purple for central node
        width: 150,
        height: 150,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ffffff',
        border: '3px solid white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      }
    };

    // Create edges connecting each domain to the central hub
    const domainEdges: Edge[] = domains.map((domain) => ({
      id: `e-terreta-${domain.id}`,
      source: 'terreta-hub',
      target: domain.id,
      type: 'straight',
      animated: domain.status === 'used',
      style: { 
        stroke: getNodeColor(domain.status), 
        strokeWidth: domain.status === 'used' ? 3 : 2 
      },
      markerEnd: {
        type: MarkerType.Arrow,
        color: getNodeColor(domain.status),
      },
    }));

    // Add some connections between related domains to create a more complex graph
    const relatedEdges: Edge[] = [];
    domains.forEach((domainA, indexA) => {
      domains.forEach((domainB, indexB) => {
        // Create connections between used domains
        if (indexA < indexB && domainA.status === 'used' && domainB.status === 'used') {
          relatedEdges.push({
            id: `e-${domainA.id}-${domainB.id}`,
            source: domainA.id,
            target: domainB.id,
            type: 'straight',
            animated: true,
            style: { stroke: '#60a5fa', strokeWidth: 2, opacity: 0.8 },
          });
        } 
        // Create some other random connections
        else if (indexA < indexB && 
            (domainA.name.charAt(0) === domainB.name.charAt(0) || 
             domainA.status === domainB.status) &&
            Math.random() > 0.7) {
          relatedEdges.push({
            id: `e-${domainA.id}-${domainB.id}`,
            source: domainA.id,
            target: domainB.id,
            type: 'straight',
            style: { stroke: '#94a3b8', strokeWidth: 1, opacity: 0.6 },
          });
        }
      });
    });

    setNodes([centralNode, ...domainNodes]);
    setEdges([...domainEdges, ...relatedEdges]);
  }, [domains, currentLanguage, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    onNodeClick(node.id);
  };

  return (
    <div style={{ width: '100%', height: '700px' }} className="rounded-xl border shadow-sm overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
        connectionLineType={ConnectionLineType.Straight}
        className="bg-background"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            return node.style?.background as string || '#d1d5db';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-background rounded-md"
        />
        <Background color="#aaaaaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default DomainGraph;
