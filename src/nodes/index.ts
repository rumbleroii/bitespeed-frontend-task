import type { Node, NodeTypes } from "reactflow";
import { TextMessageNode } from "./TextMessageNode";

export const initialNodes = [] satisfies Node[];

export const nodeTypes = {
  "text-message": TextMessageNode
} satisfies NodeTypes;
