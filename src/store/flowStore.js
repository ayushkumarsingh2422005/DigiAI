import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';

const useFlowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (nodeType, position) => {
    const newNode = {
      id: uuidv4(),
      type: nodeType,
      position,
      data: { label: nodeType },
    };
    set({ nodes: [...get().nodes, newNode] });
    return newNode;
  },
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));

export default useFlowStore;