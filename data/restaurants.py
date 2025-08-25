RESTAURANTS = {
    'A': {
        'name': 'Phở Cổ (Chính)', 
        'location': 'Phố cổ Hà Nội', 
        'type': 'main',
        'description': 'Cửa hàng chính - trung tâm phân phối'
    },
    'B': {
        'name': 'Times City', 
        'location': 'Hai Bà Trưng, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong trung tâm thương mại'
    },
    'C': {
        'name': 'Lotte Center', 
        'location': 'Ba Đình, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh cao cấp trong tòa nhà văn phòng'
    },
    'D': {
        'name': 'Aeon Long Biên', 
        'location': 'Long Biên, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh ngoại thành'
    },
    'E': {
        'name': 'Royal City', 
        'location': 'Thanh Xuân, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong khu đô thị mới'
    },
    'F': {
        'name': 'BigC Thăng Long', 
        'location': 'Nam Từ Liêm, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong siêu thị'
    }
}

DEFAULT_COSTS = {
    ('A','B'): 3.2, ('A','C'): 2.8, ('A','D'): 4.5, ('A','E'): 3.6, ('A','F'): 4.1,
    ('B','C'): 2.1, ('B','D'): 1.9, ('B','E'): 1.5, ('B','F'): 3.8,
    ('C','D'): 3.4, ('C','E'): 2.6, ('C','F'): 1.8,
    ('D','E'): 2.9, ('D','F'): 2.3,
    ('E','F'): 2.7
}

def get_cost_matrix():
    vertices = sorted(RESTAURANTS.keys())
    matrix = {}
    
    for i, u in enumerate(vertices):
        matrix[u] = {}
        for j, v in enumerate(vertices):
            if i == j:
                matrix[u][v] = 0
            elif (u, v) in DEFAULT_COSTS:
                matrix[u][v] = DEFAULT_COSTS[(u, v)]
            elif (v, u) in DEFAULT_COSTS:
                matrix[u][v] = DEFAULT_COSTS[(v, u)]
            else:
                matrix[u][v] = float('inf')
    
    return matrix

def create_graph_from_costs(costs=None):
    from algorithms.mst import Graph
    
    if costs is None:
        costs = DEFAULT_COSTS
    
    graph = Graph()
    for (u, v), weight in costs.items():
        graph.add_edge(u, v, weight)
    
    return graph