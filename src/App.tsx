import { useCallback, useEffect, useState } from "react";
import type { OnConnect } from "reactflow";
import {
  Background,
  Controls,
  OnInit,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState
} from "reactflow";

import "reactflow/dist/style.css";
import "./App.css";

const flowKey = 'text-message-flow';

import { edgeTypes, initialEdges } from "./edges";
import { initialNodes, nodeTypes } from "./nodes";

let id = 0;
const getId = () => `node_${id++}`;

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [lastNode, setLastNode] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [error, setError] = useState("");
  const [nodeClick, setNodeClick] = useState("");
  const onConnect: OnConnect = useCallback((connection) => setEdges((edges) => addEdge(connection, edges)),[setEdges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = (reactFlowInstance as any).toObject();
      if(flow.edges.length < flow.nodes.length - 1) {
        setError("Please connect all nodes");
        return;
      } else if(flow.nodes.length === 0) {
        setError("Insert atleast One Node");
      } else {
        setError("");
      }
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) as string);
      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        const viewport = (reactFlowInstance as any).setViewport({ x, y, zoom });
      } 
    };

    restoreFlow();
  }, [setNodes, reactFlowInstance]);

  const onDragOn = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    event.dataTransfer.setData("text/plain", type);
  }

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('text/plain');

      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      let position = { x: 0, y: 0 };
      if (reactFlowInstance) {
        // Adjust the screen coordinates by the zoom leve
        const reactFlowBound = event.currentTarget.getBoundingClientRect();
        const adjustedX = (event.clientX - reactFlowBound.left);
        const adjustedY = (event.clientY - reactFlowBound.top);
      
        // Convert the adjusted screen coordinates to flow position
        position = (reactFlowInstance as any).project({
          x: adjustedX,
          y: adjustedY,
        });
      }

      // New Node
      console.log(type);
      const newNode = {
        id: getId(),
        type: type,
        position,
        data: { message: "" }
      };
    
      setLastNode(newNode.id);
      setNodes((nds) => nds.concat(newNode));

  }, [reactFlowInstance]);

  const onNodeClick = (event: React.MouseEvent, node: any) => {
    setNodeClick(node.type);
    setLastNode(node.id);
  }

  return (
    <>      
      <div className="navbar">
        {error ? <h3>{error}</h3> : <div></div>}
        <div>
          <button onClick={onSave}>Save Changes</button>
          <button onClick={onRestore}>Restore Changes</button>
        </div>
      </div> 
      <div className="container-flex">
        <div className="container">
          <ReactFlow
              nodes={nodes}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              edges={edges}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              fitView
              onInit={setReactFlowInstance as OnInit<any, any>}
              onDragOver={(e) => onDragOn(e)}
              onDrop={(e) => {onDrop(e)}}
              onNodeClick={(event, node) => onNodeClick(event,node)}
            >
              <Background />
              <Controls />
          </ReactFlow>
        </div>
        <div className="control-window">
          <h3>Drag and Drop</h3>
          {nodeClick==="text-message" ? (
              <>
                <TextUpdater nodeId={lastNode} nodes={nodes} setNodes={setNodes} setNodeClick={setNodeClick} />
                <button onClick={() => setNodeClick("")}>Back</button>
              </>
            ) : (
              <div 
                className="node-css" 
                draggable
                onDragStart={(e) => onDragStart(e, "text-message")}
                hidden={nodeClick !== ""}
              >
                Text Message
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}

const TextUpdater = ({ nodeId, nodes, setNodes, setNodeClick }: { nodeId: string, nodes: any, setNodes: any, setNodeClick: any }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const node = nodes.find((node: any) => node.id === nodeId);
    if (node) {
      setInputValue(node.data.message);
    }
  }, [nodeId, nodes]);

  const handleClick = () => {
    const updatedUsers = nodes.map((node: any) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, message: inputValue } };
      }
      return node;
    });
    setNodes(updatedUsers);
    setNodeClick("");
  };

  return (
    <div className="text-message-menu">
      <h1>Text Message</h1>
      <input
        type="text"
        placeholder="Enter your message here"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleClick}>Add</button>
    </div>
  );
};
