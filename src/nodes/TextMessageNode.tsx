import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";

export type TextMessageNodeData = {
  message?: string;
}

export function TextMessageNode({
    data, selected
  }: NodeProps<TextMessageNodeData>) {  
    const textMessageBoxStyle = {
      "width": "100px",
      "height": "auto",
      "overflow":"auto",
      "padding": "10px",
      "font-size": "small",
      "background-color": "rgb(235, 235, 235)",
      "box-shadow": "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      "border": selected ? `0.6px solid blue` : '0px solid black',
      "border-radius": "5px",
    }
    return (
      <>
        <div style={textMessageBoxStyle}>
            <div>
            <h6 className="text-message-box-title">Send Message</h6>
            </div>
            <hr/>
            <p className="text-message-box-text">{data.message}</p>
        </div>
        <Handle type="target" position={Position.Right}/>
        <Handle type="source" position={Position.Left}/>
      </>
    );
  }
  