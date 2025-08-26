from flask import Flask, render_template, jsonify, request
import os
from algorithms.mst import MST_Solver, Graph
from data.restaurants import RESTAURANTS, get_default_costs, get_cost_matrix, create_graph_from_costs, create_graph_from_selected_locations

app = Flask(__name__)
app.secret_key = 'mst_demo_secret_key'

current_costs = get_default_costs().copy()
selected_locations = []
mst_solver = MST_Solver()
current_result = None

@app.route('/')
def index():
    return render_template('index.html', restaurants=RESTAURANTS, costs=get_cost_matrix())

@app.route('/api/solve', methods=['POST'])
def solve_mst():
    global current_result
    
    try:
        data = request.get_json()
        algorithm = data.get('algorithm', 'kruskal')
        start_vertex = data.get('start_vertex', 'A')
        
        graph = create_graph_from_costs(current_costs)
        
        if algorithm == 'kruskal':
            current_result = mst_solver.kruskal(graph)
        elif algorithm == 'prim':
            current_result = mst_solver.prim(graph, start_vertex)
        else:
            return jsonify({'error': 'Invalid algorithm'}), 400
        
        return jsonify({
            'success': True,
            'algorithm': algorithm,
            'result': current_result.to_dict(),
            'total_steps': len(current_result.steps)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/step/<int:step_id>')
def get_step(step_id):
    try:
        if not current_result or step_id < 0 or step_id >= len(current_result.steps):
            return jsonify({'error': 'Invalid step ID'}), 400
        
        step = current_result.steps[step_id]
        return jsonify({
            'success': True,
            'step': step.to_dict(),
            'step_number': step_id,
            'total_steps': len(current_result.steps)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/update_costs', methods=['POST'])
def update_costs():
    global current_costs
    
    try:
        data = request.get_json()
        new_costs = data.get('costs', {})
        
        for edge_str, cost in new_costs.items():
            if '-' in edge_str:
                u, v = edge_str.split('-')
                u, v = u.strip(), v.strip()
                
                if u in RESTAURANTS and v in RESTAURANTS:
                    if (u, v) in current_costs:
                        current_costs[(u, v)] = float(cost)
                    elif (v, u) in current_costs:
                        current_costs[(v, u)] = float(cost)
                    else:
                        current_costs[(u, v)] = float(cost)
        
        # Convert tuple keys to string format for JSON serialization
        costs_for_json = {}
        for (u, v), cost in current_costs.items():
            costs_for_json[f"{u}-{v}"] = cost
        
        return jsonify({
            'success': True,
            'message': 'Costs updated successfully',
            'costs': costs_for_json
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset')
def reset_data():
    global current_costs, current_result, selected_locations
    
    current_costs = get_default_costs().copy()
    current_result = None
    selected_locations = []
    
    # Convert tuple keys to string format for JSON serialization
    costs_for_json = {}
    for (u, v), cost in current_costs.items():
        costs_for_json[f"{u}-{v}"] = cost
    
    return jsonify({
        'success': True,
        'message': 'Data reset to defaults',
        'costs': costs_for_json
    })

@app.route('/api/data')
def get_data():
    # Convert tuple keys to string format for JSON serialization
    costs_for_json = {}
    for (u, v), cost in current_costs.items():
        costs_for_json[f"{u}-{v}"] = cost
    
    return jsonify({
        'restaurants': RESTAURANTS,
        'costs': costs_for_json,
        'cost_matrix': get_cost_matrix()
    })

@app.route('/api/points/update', methods=['POST'])
def update_point_position():
    """Update position of an existing point"""
    try:
        data = request.get_json()
        point_id = data.get('pointId')
        new_lat = data.get('lat')
        new_lng = data.get('lng')
        
        if point_id not in RESTAURANTS:
            return jsonify({'success': False, 'error': f'Điểm {point_id} không tồn tại'}), 400
        
        # Update coordinates
        RESTAURANTS[point_id]['lat'] = new_lat
        RESTAURANTS[point_id]['lng'] = new_lng
        
        # Recalculate costs with new position
        global current_costs
        from data.restaurants import DEFAULT_COSTS
        # Force recalculation by clearing cached data
        import data.restaurants
        data.restaurants.DEFAULT_COSTS = None
        current_costs = get_default_costs()
        
        return jsonify({'success': True, 'message': f'Đã cập nhật vị trí điểm {point_id}'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/points/add', methods=['POST'])
def add_new_point():
    """Add a new point to the system"""
    try:
        data = request.get_json()
        point_id = data.get('pointId')
        name = data.get('name')
        lat = data.get('lat')
        lng = data.get('lng')
        location = data.get('location', 'Địa điểm mới')
        point_type = data.get('type', 'branch')
        description = data.get('description', 'Điểm được thêm bởi người dùng')
        
        if point_id in RESTAURANTS:
            return jsonify({'success': False, 'error': f'Điểm {point_id} đã tồn tại'}), 400
        
        # Add new restaurant
        RESTAURANTS[point_id] = {
            'name': name,
            'location': location,
            'type': point_type,
            'description': description,
            'lat': lat,
            'lng': lng
        }
        
        # Recalculate costs with new point
        global current_costs
        import data.restaurants
        data.restaurants.DEFAULT_COSTS = None
        current_costs = get_default_costs()
        
        return jsonify({'success': True, 'message': f'Đã thêm điểm mới: {name} ({point_id})'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/points/remove', methods=['POST'])
def remove_point():
    """Remove a point from the system"""
    try:
        data = request.get_json()
        point_id = data.get('pointId')
        
        if point_id not in RESTAURANTS:
            return jsonify({'success': False, 'error': f'Điểm {point_id} không tồn tại'}), 400
        
        # Cannot remove if it's the only main point
        if RESTAURANTS[point_id]['type'] == 'main':
            main_points = [k for k, v in RESTAURANTS.items() if v['type'] == 'main']
            if len(main_points) <= 1:
                return jsonify({'success': False, 'error': 'Không thể xóa điểm chính duy nhất'}), 400
        
        # Remove restaurant
        del RESTAURANTS[point_id]
        
        # Remove from selected locations if present
        global selected_locations
        if point_id in selected_locations:
            selected_locations.remove(point_id)
        
        # Recalculate costs without removed point
        global current_costs
        import data.restaurants
        data.restaurants.DEFAULT_COSTS = None
        current_costs = get_default_costs()
        
        return jsonify({'success': True, 'message': f'Đã xóa điểm {point_id}'})
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/locations/select', methods=['POST'])
def select_locations():
    global selected_locations, current_costs, current_result
    
    try:
        data = request.get_json()
        selected_locations = data.get('locations', [])
        
        if len(selected_locations) < 2:
            return jsonify({
                'success': True,
                'message': 'Chọn ít nhất 2 địa điểm để tính MST',
                'selected_locations': selected_locations,
                'costs': {}
            })
        
        # Calculate distances for selected locations only
        graph = create_graph_from_selected_locations(selected_locations)
        if graph is None:
            return jsonify({'error': 'Không thể tạo đồ thị từ các địa điểm đã chọn'}), 400
        
        # Update current costs with selected locations
        current_costs = {}
        for i in range(len(selected_locations)):
            for j in range(i + 1, len(selected_locations)):
                u, v = selected_locations[i], selected_locations[j]
                if u in RESTAURANTS and v in RESTAURANTS:
                    from data.restaurants import haversine_distance
                    lat1, lng1 = RESTAURANTS[u]['lat'], RESTAURANTS[u]['lng']
                    lat2, lng2 = RESTAURANTS[v]['lat'], RESTAURANTS[v]['lng']
                    distance = round(haversine_distance(lat1, lng1, lat2, lng2), 2)
                    current_costs[(u, v)] = distance
        
        current_result = None  # Reset result when locations change
        
        # Convert costs for JSON
        costs_for_json = {}
        for (u, v), cost in current_costs.items():
            costs_for_json[f"{u}-{v}"] = cost
        
        return jsonify({
            'success': True,
            'message': f'Đã chọn {len(selected_locations)} địa điểm',
            'selected_locations': selected_locations,
            'costs': costs_for_json
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/locations/selected')
def get_selected_locations():
    return jsonify({
        'success': True,
        'selected_locations': selected_locations,
        'available_locations': list(RESTAURANTS.keys())
    })

@app.route('/api/solve/selected', methods=['POST'])
def solve_selected_mst():
    global current_result
    
    try:
        if len(selected_locations) < 2:
            return jsonify({'error': 'Cần chọn ít nhất 2 địa điểm'}), 400
        
        data = request.get_json()
        algorithm = data.get('algorithm', 'kruskal')
        start_vertex = data.get('start_vertex', selected_locations[0])
        
        graph = create_graph_from_selected_locations(selected_locations)
        if graph is None:
            return jsonify({'error': 'Không thể tạo đồ thị'}), 400
        
        if algorithm == 'kruskal':
            current_result = mst_solver.kruskal(graph)
        elif algorithm == 'prim':
            current_result = mst_solver.prim(graph, start_vertex)
        else:
            return jsonify({'error': 'Thuật toán không hợp lệ'}), 400
        
        return jsonify({
            'success': True,
            'algorithm': algorithm,
            'result': current_result.to_dict(),
            'total_steps': len(current_result.steps),
            'selected_locations': selected_locations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/compare')
def compare_algorithms():
    try:
        if len(selected_locations) < 2:
            # Use all locations if none selected
            graph = create_graph_from_costs(current_costs)
        else:
            graph = create_graph_from_selected_locations(selected_locations)
            
        if graph is None:
            return jsonify({'error': 'Không thể tạo đồ thị'}), 400
        
        start_vertex = selected_locations[0] if selected_locations else 'A'
        kruskal_result = mst_solver.kruskal(graph)
        prim_result = mst_solver.prim(graph, start_vertex)
        
        return jsonify({
            'success': True,
            'kruskal': {
                'total_cost': kruskal_result.total_cost,
                'edges': [edge.to_dict() for edge in kruskal_result.edges],
                'steps_count': len(kruskal_result.steps)
            },
            'prim': {
                'total_cost': prim_result.total_cost,
                'edges': [edge.to_dict() for edge in prim_result.edges],
                'steps_count': len(prim_result.steps)
            },
            'same_result': abs(kruskal_result.total_cost - prim_result.total_cost) < 0.001,
            'selected_locations': selected_locations
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)