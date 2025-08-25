import heapq
from typing import List, Dict, Tuple, Any
from .union_find import UnionFind

class Edge:
    def __init__(self, u: str, v: str, weight: float):
        self.u = u
        self.v = v
        self.weight = weight
    
    def __lt__(self, other):
        return self.weight < other.weight
    
    def to_dict(self):
        return {'u': self.u, 'v': self.v, 'weight': self.weight}

class MST_Step:
    def __init__(self, step_type: str, edge: Edge, accepted: bool, components=None, explanation: str = ""):
        self.step_type = step_type
        self.edge = edge
        self.accepted = accepted
        self.components = components or []
        self.explanation = explanation
        self.total_cost = 0
    
    def to_dict(self):
        return {
            'step_type': self.step_type,
            'edge': self.edge.to_dict() if self.edge else None,
            'accepted': self.accepted,
            'components': self.components,
            'explanation': self.explanation,
            'total_cost': self.total_cost
        }

class MST_Result:
    def __init__(self):
        self.edges: List[Edge] = []
        self.total_cost: float = 0
        self.steps: List[MST_Step] = []
    
    def add_edge(self, edge: Edge):
        self.edges.append(edge)
        self.total_cost += edge.weight
    
    def to_dict(self):
        return {
            'edges': [edge.to_dict() for edge in self.edges],
            'total_cost': self.total_cost,
            'steps': [step.to_dict() for step in self.steps]
        }

class Graph:
    def __init__(self):
        self.vertices: set = set()
        self.edges: List[Edge] = []
        self.adj_list: Dict[str, List[Tuple[str, float]]] = {}
    
    def add_edge(self, u: str, v: str, weight: float):
        edge = Edge(u, v, weight)
        self.edges.append(edge)
        self.vertices.add(u)
        self.vertices.add(v)
        
        if u not in self.adj_list:
            self.adj_list[u] = []
        if v not in self.adj_list:
            self.adj_list[v] = []
        
        self.adj_list[u].append((v, weight))
        self.adj_list[v].append((u, weight))
    
    def get_all_edges(self) -> List[Edge]:
        return self.edges
    
    def get_neighbors(self, vertex: str) -> List[Tuple[str, float]]:
        return self.adj_list.get(vertex, [])
    
    def get_vertex_index(self, vertex: str) -> int:
        return sorted(list(self.vertices)).index(vertex)

class MST_Solver:
    def __init__(self):
        self.current_steps: List[MST_Step] = []
    
    def kruskal(self, graph: Graph) -> MST_Result:
        result = MST_Result()
        self.current_steps = []
        
        vertices = sorted(list(graph.vertices))
        vertex_to_index = {v: i for i, v in enumerate(vertices)}
        uf = UnionFind(len(vertices))
        
        sorted_edges = sorted(graph.get_all_edges())
        
        step = MST_Step("init", None, False, uf.get_components(), 
                       f"Khởi tạo: {len(vertices)} đỉnh, {len(sorted_edges)} cạnh")
        self.current_steps.append(step)
        
        for edge in sorted_edges:
            u_idx = vertex_to_index[edge.u]
            v_idx = vertex_to_index[edge.v]
            
            if not uf.connected(u_idx, v_idx):
                uf.union(u_idx, v_idx)
                result.add_edge(edge)
                
                step = MST_Step("accept", edge, True, 
                               [[vertices[i] for i in comp] for comp in uf.get_components()],
                               f"Chấp nhận cạnh {edge.u}-{edge.v} (trọng số {edge.weight})")
                step.total_cost = result.total_cost
                self.current_steps.append(step)
                
                if len(result.edges) == len(vertices) - 1:
                    break
            else:
                step = MST_Step("reject", edge, False,
                               [[vertices[i] for i in comp] for comp in uf.get_components()],
                               f"Từ chối cạnh {edge.u}-{edge.v} (tạo chu trình)")
                step.total_cost = result.total_cost
                self.current_steps.append(step)
        
        result.steps = self.current_steps
        return result
    
    def prim(self, graph: Graph, start_vertex: str = None) -> MST_Result:
        result = MST_Result()
        self.current_steps = []
        
        vertices = list(graph.vertices)
        if not start_vertex:
            start_vertex = min(vertices)
        
        visited = {start_vertex}
        edges_pq = []
        
        for neighbor, weight in graph.get_neighbors(start_vertex):
            heapq.heappush(edges_pq, (weight, start_vertex, neighbor))
        
        step = MST_Step("init", None, False, [list(visited), [v for v in vertices if v not in visited]],
                       f"Bắt đầu từ đỉnh {start_vertex}")
        self.current_steps.append(step)
        
        while edges_pq and len(visited) < len(vertices):
            weight, u, v = heapq.heappop(edges_pq)
            
            if v in visited:
                step = MST_Step("reject", Edge(u, v, weight), False,
                               [list(visited), [vertex for vertex in vertices if vertex not in visited]],
                               f"Từ chối cạnh {u}-{v} (đỉnh {v} đã được thăm)")
                step.total_cost = result.total_cost
                self.current_steps.append(step)
                continue
            
            visited.add(v)
            edge = Edge(u, v, weight)
            result.add_edge(edge)
            
            step = MST_Step("accept", edge, True,
                           [list(visited), [vertex for vertex in vertices if vertex not in visited]],
                           f"Chấp nhận cạnh {u}-{v} (trọng số {weight})")
            step.total_cost = result.total_cost
            self.current_steps.append(step)
            
            for neighbor, neighbor_weight in graph.get_neighbors(v):
                if neighbor not in visited:
                    heapq.heappush(edges_pq, (neighbor_weight, v, neighbor))
        
        result.steps = self.current_steps
        return result
    
    def get_step_by_step(self) -> List[Dict[str, Any]]:
        return [step.to_dict() for step in self.current_steps]