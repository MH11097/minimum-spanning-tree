from flask import Flask, render_template, jsonify, request
import os
from algorithms.mst import MST_Solver, Graph
from data.restaurants import RESTAURANTS, DEFAULT_COSTS, get_cost_matrix, create_graph_from_costs

app = Flask(__name__)
app.secret_key = 'mst_demo_secret_key'

current_costs = DEFAULT_COSTS.copy()
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
        
        return jsonify({
            'success': True,
            'message': 'Costs updated successfully',
            'costs': dict(current_costs)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/reset')
def reset_data():
    global current_costs, current_result
    
    current_costs = DEFAULT_COSTS.copy()
    current_result = None
    
    return jsonify({
        'success': True,
        'message': 'Data reset to defaults',
        'costs': dict(current_costs)
    })

@app.route('/api/data')
def get_data():
    return jsonify({
        'restaurants': RESTAURANTS,
        'costs': dict(current_costs),
        'cost_matrix': get_cost_matrix()
    })

@app.route('/api/compare')
def compare_algorithms():
    try:
        graph = create_graph_from_costs(current_costs)
        
        kruskal_result = mst_solver.kruskal(graph)
        prim_result = mst_solver.prim(graph, 'A')
        
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
            'same_result': abs(kruskal_result.total_cost - prim_result.total_cost) < 0.001
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)