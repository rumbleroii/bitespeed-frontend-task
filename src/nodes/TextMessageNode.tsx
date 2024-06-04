import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

export type TextMessageNodeData = {
  message?: string;
}

export function TextMessageNode({
    data,
  }: NodeProps<TextMessageNodeData>) {  
    return (
      // We add this class to use the same styles as React Flow's default nodes.
      <>
        <div className="text-message-box">
            <div>
            <h6>Send Message</h6>
            </div>
            <hr/>
            <p>{data.message}</p>
        </div>
        <Handle type="target" position={Position.Right}/>
        <Handle type="source" position={Position.Left}/>
      </>
    );
  }
