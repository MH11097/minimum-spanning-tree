let currentData = null;
let currentResult = null;
let isPlaying = false;
let currentStep = 0;
let animationInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
});

function setupEventListeners() {
    const algorithmSelect = document.getElementById('algorithm-select');
    if (algorithmSelect) {
        algorithmSelect.addEventListener('change', updatePseudocode);
    }
    
    updatePseudocode();
}

async function loadInitialData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        currentData = data;
        
        renderGraph(data);
        renderCostMatrix(data.cost_matrix);
        
    } catch (error) {
        console.error('Error loading initial data:', error);
        showAlert('Lỗi khi tải dữ liệu ban đầu', 'danger');
    }
}

function renderCostMatrix(costMatrix) {
    const container = document.getElementById('cost-matrix');
    if (!container) return;
    
    const vertices = Object.keys(costMatrix).sort();
    let html = '<div class="table-responsive"><table class="table table-sm table-bordered">';
    
    html += '<thead><tr><th></th>';
    vertices.forEach(v => {
        html += `<th class="text-center">${v}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    vertices.forEach(u => {
        html += `<tr><th>${u}</th>`;
        vertices.forEach(v => {
            const cost = costMatrix[u][v];
            const isEditable = cost !== 0 && cost !== Infinity;
            
            if (cost === 0) {
                html += '<td class="text-center text-muted">-</td>';
            } else if (cost === Infinity) {
                html += '<td class="text-center text-muted">∞</td>';
            } else {
                html += `<td class="text-center">
                    <input type="number" class="form-control form-control-sm text-center cost-input" 
                           value="${cost}" step="0.1" min="0" 
                           data-edge="${u}-${v}" ${isEditable ? '' : 'readonly'}>
                </td>`;
            }
        });
        html += '</tr>';
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

async function updateCosts() {
    const costInputs = document.querySelectorAll('.cost-input');
    const newCosts = {};
    
    costInputs.forEach(input => {
        const edge = input.getAttribute('data-edge');
        const value = parseFloat(input.value);
        if (!isNaN(value) && value >= 0) {
            newCosts[edge] = value;
        }
    });
    
    try {
        showLoading(true);
        const response = await fetch('/api/update_costs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ costs: newCosts })
        });
        
        const result = await response.json();
        if (result.success) {
            showAlert('Cập nhật chi phí thành công!', 'success');
            await loadInitialData();
        } else {
            showAlert('Lỗi: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error updating costs:', error);
        showAlert('Lỗi khi cập nhật chi phí', 'danger');
    } finally {
        showLoading(false);
    }
}

async function resetData() {
    try {
        showLoading(true);
        const response = await fetch('/api/reset');
        const result = await response.json();
        
        if (result.success) {
            showAlert('Đã khôi phục dữ liệu mặc định!', 'info');
            await loadInitialData();
        } else {
            showAlert('Lỗi: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error resetting data:', error);
        showAlert('Lỗi khi khôi phục dữ liệu', 'danger');
    } finally {
        showLoading(false);
    }
}

async function runAlgorithm() {
    const algorithm = document.getElementById('algorithm-select').value;
    
    try {
        showLoading(true);
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                algorithm: algorithm,
                start_vertex: 'A'
            })
        });
        
        const result = await response.json();
        if (result.success) {
            currentResult = result.result;
            currentStep = 0;
            
            showAlert(`Thuật toán ${algorithm.toUpperCase()} hoàn thành!`, 'success');
            renderAlgorithmVisualization();
            updateStepInfo();
            
            document.getElementById('results-tab').click();
            renderMSTResult();
            renderResultSummary();
            
        } else {
            showAlert('Lỗi: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error running algorithm:', error);
        showAlert('Lỗi khi chạy thuật toán', 'danger');
    } finally {
        showLoading(false);
    }
}

function playPause() {
    if (!currentResult) {
        showAlert('Chưa có kết quả thuật toán. Vui lòng chạy thuật toán trước!', 'warning');
        return;
    }
    
    if (isPlaying) {
        clearInterval(animationInterval);
        isPlaying = false;
        document.getElementById('play-icon').className = 'fas fa-play';
    } else {
        const speed = parseInt(document.getElementById('speed-select').value);
        animationInterval = setInterval(() => {
            if (currentStep < currentResult.steps.length - 1) {
                stepForward();
            } else {
                playPause();
            }
        }, speed);
        isPlaying = true;
        document.getElementById('play-icon').className = 'fas fa-pause';
    }
}

function stepForward() {
    if (!currentResult || currentStep >= currentResult.steps.length - 1) return;
    
    currentStep++;
    updateVisualizationStep();
    updateStepInfo();
}

function stepBackward() {
    if (!currentResult || currentStep <= 0) return;
    
    currentStep--;
    updateVisualizationStep();
    updateStepInfo();
}

function resetAnimation() {
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    isPlaying = false;
    currentStep = 0;
    document.getElementById('play-icon').className = 'fas fa-play';
    
    if (currentResult) {
        updateVisualizationStep();
        updateStepInfo();
    }
}

function updateVisualizationStep() {
    if (!currentResult || !currentResult.steps[currentStep]) return;
    
    const step = currentResult.steps[currentStep];
    renderAlgorithmVisualization(step);
    updateConsoleLog(step);
}

function updateStepInfo() {
    if (!currentResult) return;
    
    const progressBar = document.getElementById('progress-bar');
    const stepInfo = document.getElementById('step-info');
    
    const progress = ((currentStep + 1) / currentResult.steps.length) * 100;
    progressBar.style.width = `${progress}%`;
    stepInfo.textContent = `Bước ${currentStep + 1}/${currentResult.steps.length}`;
}

function updatePseudocode() {
    const algorithm = document.getElementById('algorithm-select')?.value || 'kruskal';
    const pseudocodeDiv = document.getElementById('pseudocode');
    if (!pseudocodeDiv) return;
    
    const pseudocodes = {
        kruskal: `
<strong>KRUSKAL(G, w)</strong>
1. A = ∅
2. for each vertex v ∈ G.V:
3.     MAKE-SET(v)
4. sort edges of G.E by weight w
5. for each edge (u, v) ∈ G.E:
6.     if FIND-SET(u) ≠ FIND-SET(v):
7.         A = A ∪ {(u, v)}
8.         UNION(u, v)
9. return A`,
        
        prim: `
<strong>PRIM(G, w, r)</strong>
1. Q = G.V
2. for each u ∈ G.V:
3.     u.key = ∞
4.     u.π = NIL
5. r.key = 0
6. while Q ≠ ∅:
7.     u = EXTRACT-MIN(Q)
8.     for each v ∈ G.Adj[u]:
9.         if v ∈ Q and w(u, v) < v.key:
10.            v.π = u
11.            v.key = w(u, v)
12. return {(v, v.π) : v ∈ G.V - {r}}`
    };
    
    pseudocodeDiv.innerHTML = pseudocodes[algorithm];
}

function updateConsoleLog(step) {
    const consoleLog = document.getElementById('console-log');
    if (!consoleLog) return;
    
    const logEntry = document.createElement('div');
    logEntry.className = `console-entry ${step.accepted ? 'text-success' : 'text-warning'}`;
    logEntry.innerHTML = `
        <small class="text-muted">[${currentStep + 1}]</small> 
        ${step.explanation}
    `;
    
    consoleLog.innerHTML = '';
    consoleLog.appendChild(logEntry);
    consoleLog.scrollTop = consoleLog.scrollHeight;
}

async function compareAlgorithms() {
    try {
        showLoading(true);
        const response = await fetch('/api/compare');
        const result = await response.json();
        
        if (result.success) {
            renderComparisonResult(result);
        } else {
            showAlert('Lỗi: ' + result.error, 'danger');
        }
    } catch (error) {
        console.error('Error comparing algorithms:', error);
        showAlert('Lỗi khi so sánh thuật toán', 'danger');
    } finally {
        showLoading(false);
    }
}

function renderComparisonResult(result) {
    const container = document.getElementById('comparison-result');
    if (!container) return;
    
    const html = `
        <div class="table-responsive">
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Thuật toán</th>
                        <th>Chi phí</th>
                        <th>Số bước</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Kruskal</strong></td>
                        <td>${result.kruskal.total_cost.toFixed(1)} triệu</td>
                        <td>${result.kruskal.steps_count}</td>
                    </tr>
                    <tr>
                        <td><strong>Prim</strong></td>
                        <td>${result.prim.total_cost.toFixed(1)} triệu</td>
                        <td>${result.prim.steps_count}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="alert alert-${result.same_result ? 'success' : 'warning'} mt-2">
            <small>
                <i class="fas fa-${result.same_result ? 'check' : 'exclamation-triangle'} me-1"></i>
                ${result.same_result ? 'Cả hai thuật toán cho kết quả giống nhau!' : 'Kết quả khác nhau - cần kiểm tra lại!'}
            </small>
        </div>
    `;
    
    container.innerHTML = html;
}

function renderResultSummary() {
    if (!currentResult) return;
    
    const container = document.getElementById('result-summary');
    if (!container) return;
    
    const edges = currentResult.edges;
    let html = '<div class="list-group list-group-flush">';
    
    edges.forEach((edge, index) => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${edge.u} - ${edge.v}</span>
                <span class="badge bg-primary rounded-pill">${edge.weight} triệu</span>
            </div>
        `;
    });
    
    html += `</div>
        <div class="mt-3 p-3 bg-light rounded">
            <div class="row text-center">
                <div class="col-6">
                    <div class="h5 text-success">${currentResult.total_cost.toFixed(1)}</div>
                    <small class="text-muted">Tổng chi phí (triệu VND)</small>
                </div>
                <div class="col-6">
                    <div class="h5 text-info">${edges.length}</div>
                    <small class="text-muted">Số cạnh trong MST</small>
                </div>
            </div>
        </div>`;
    
    container.innerHTML = html;
    
    renderBenefitAnalysis();
}

function renderBenefitAnalysis() {
    const container = document.getElementById('benefit-analysis');
    if (!container || !currentResult) return;
    
    const mstCost = currentResult.total_cost;
    const allConnectedCost = calculateAllConnectedCost();
    const savings = allConnectedCost - mstCost;
    const savingsPercent = ((savings / allConnectedCost) * 100).toFixed(1);
    
    const html = `
        <div class="row text-center">
            <div class="col-12">
                <div class="bg-success text-white p-2 rounded mb-2">
                    <div class="h6 mb-1">Tiết kiệm</div>
                    <div class="h5">${savings.toFixed(1)} triệu VND</div>
                    <small>(${savingsPercent}%)</small>
                </div>
            </div>
        </div>
        <small class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            So với kết nối tất cả các cạnh (${allConnectedCost.toFixed(1)} triệu VND)
        </small>
    `;
    
    container.innerHTML = html;
}

function calculateAllConnectedCost() {
    if (!currentData || !currentData.costs) return 0;
    
    return Object.values(currentData.costs).reduce((sum, cost) => sum + cost, 0);
}

function showAlert(message, type = 'info') {
    const alertsContainer = document.getElementById('alerts-container') || createAlertsContainer();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    alertsContainer.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function createAlertsContainer() {
    const container = document.createElement('div');
    container.id = 'alerts-container';
    container.className = 'position-fixed top-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

function showLoading(show) {
    const modal = new bootstrap.Modal(document.getElementById('loadingModal'));
    if (show) {
        modal.show();
    } else {
        modal.hide();
    }
}