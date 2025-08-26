import math

def haversine_distance(lat1, lng1, lat2, lng2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    Returns distance in kilometers
    """
    # Convert decimal degrees to radians
    lat1, lng1, lat2, lng2 = map(math.radians, [lat1, lng1, lat2, lng2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlng/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    return r * c

def calculate_real_distances():
    """
    Calculate real distances between all restaurant pairs based on coordinates
    """
    distances = {}
    restaurants_list = list(RESTAURANTS.keys())
    
    for i in range(len(restaurants_list)):
        for j in range(i + 1, len(restaurants_list)):
            u, v = restaurants_list[i], restaurants_list[j]
            
            lat1, lng1 = RESTAURANTS[u]['lat'], RESTAURANTS[u]['lng']
            lat2, lng2 = RESTAURANTS[v]['lat'], RESTAURANTS[v]['lng']
            
            distance = haversine_distance(lat1, lng1, lat2, lng2)
            distances[(u, v)] = round(distance, 2)
    
    return distances

RESTAURANTS = {
    'A': {
        'name': 'Phở Cổ (Chính)', 
        'location': 'Phố cổ Hà Nội', 
        'type': 'main',
        'description': 'Cửa hàng chính - trung tâm phân phối',
        'lat': 21.0285,
        'lng': 105.8542
    },
    'B': {
        'name': 'Times City', 
        'location': 'Hai Bà Trưng, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong trung tâm thương mại',
        'lat': 20.9967,
        'lng': 105.8683
    },
    'C': {
        'name': 'Lotte Center', 
        'location': 'Ba Đình, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh cao cấp trong tòa nhà văn phòng',
        'lat': 21.0279,
        'lng': 105.8368
    },
    'D': {
        'name': 'Aeon Long Biên', 
        'location': 'Long Biên, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh ngoại thành',
        'lat': 21.0447,
        'lng': 105.8906
    },
    'E': {
        'name': 'Royal City', 
        'location': 'Thanh Xuân, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong khu đô thị mới',
        'lat': 20.9936,
        'lng': 105.8070
    },
    'F': {
        'name': 'BigC Thăng Long', 
        'location': 'Nam Từ Liêm, Hà Nội',
        'type': 'branch',
        'description': 'Chi nhánh trong siêu thị',
        'lat': 21.0124,
        'lng': 105.7648
    }
}

# Use real calculated distances as default - will be set after RESTAURANTS is defined
DEFAULT_COSTS = None

def get_default_costs():
    global DEFAULT_COSTS
    if DEFAULT_COSTS is None:
        DEFAULT_COSTS = calculate_real_distances()
    return DEFAULT_COSTS

def get_cost_matrix():
    vertices = sorted(RESTAURANTS.keys())
    matrix = {}
    
    costs = get_default_costs()
    for i, u in enumerate(vertices):
        matrix[u] = {}
        for j, v in enumerate(vertices):
            if i == j:
                matrix[u][v] = 0
            elif (u, v) in costs:
                matrix[u][v] = costs[(u, v)]
            elif (v, u) in costs:
                matrix[u][v] = costs[(v, u)]
            else:
                matrix[u][v] = float('inf')
    
    return matrix

def create_graph_from_costs(costs=None):
    from algorithms.mst import Graph
    
    if costs is None:
        costs = get_default_costs()
    
    graph = Graph()
    for (u, v), weight in costs.items():
        graph.add_edge(u, v, weight)
    
    return graph

def create_graph_from_selected_locations(selected_locations):
    """
    Create graph from user-selected locations with real distances
    """
    from algorithms.mst import Graph
    
    if len(selected_locations) < 2:
        return None
    
    graph = Graph()
    
    for i in range(len(selected_locations)):
        for j in range(i + 1, len(selected_locations)):
            u, v = selected_locations[i], selected_locations[j]
            
            if u in RESTAURANTS and v in RESTAURANTS:
                lat1, lng1 = RESTAURANTS[u]['lat'], RESTAURANTS[u]['lng']
                lat2, lng2 = RESTAURANTS[v]['lat'], RESTAURANTS[v]['lng']
                
                distance = haversine_distance(lat1, lng1, lat2, lng2)
                graph.add_edge(u, v, round(distance, 2))
    
    return graph