/**
 * Main JS for Hanoi Map MST Application
 */

let hanoiMap = null;
let selectedLocations = [];
let locationMarkers = {};
let currentResult = null;
let mstEdges = [];
// Simplified - no selection needed

// Initialize the application - NON-BLOCKING
document.addEventListener('DOMContentLoaded', function() {
    if (typeof updateLoadingProgress === 'function') {
        updateLoadingProgress('Main.js - DOM Content Loaded');
    }
    console.log('DOM Content Loaded - starting initialization');
    
    // Initialize immediately without delay
    try {
        setupEventListeners();
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Event Listeners Setup Complete');
        }
        console.log('Event listeners setup complete');
        
        // Initialize map in next tick to prevent blocking
        setTimeout(function() {
            initializeMapSafely();
        }, 50);
        
    } catch (error) {
        console.error('Critical initialization error:', error);
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Critical Initialization Error', false);
        }
    }
});

// Safe map initialization that won't block loading
function initializeMapSafely() {
    if (typeof updateLoadingProgress === 'function') {
        updateLoadingProgress('Starting Map Initialization');
    }
    
    try {
        initializeMap();
        loadLocationData();
    } catch (error) {
        console.error('Map initialization error:', error);
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Map Initialization Failed', false);
        }
        // Show error but don't block the app
        showAlert('Lỗi khởi tạo bản đồ - vui lòng thử lại', 'warning');
    }
}

/**
 * Initialize the Leaflet map
 */
function initializeMap() {
    try {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded yet');
            if (typeof updateLoadingProgress === 'function') {
                updateLoadingProgress('Leaflet Not Loaded - Retrying', false);
            }
            // Retry after a short delay
            setTimeout(initializeMapSafely, 500);
            return;
        } else {
            if (typeof updateLoadingProgress === 'function') {
                updateLoadingProgress('Leaflet Library Loaded');
            }
        }
        
        // Check if map container exists
        const mapContainer = document.getElementById('hanoi-map');
        if (!mapContainer) {
            console.error('Map container not found');
            if (typeof updateLoadingProgress === 'function') {
                updateLoadingProgress('Map Container Not Found', false);
            }
            return;
        } else {
            if (typeof updateLoadingProgress === 'function') {
                updateLoadingProgress('Map Container Found');
            }
        }
        
        // Prevent multiple initialization
        if (hanoiMap) {
            console.log('Map already initialized');
            return;
        }
        
        console.log('Creating Leaflet map...');
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Creating Leaflet Map Instance');
        }
        
        // Center on Hanoi
        hanoiMap = L.map('hanoi-map').setView([21.0285, 105.8542], 12);
        
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Adding Map Tiles');
        }
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(hanoiMap);
        
        // Add custom style for dark theme
        hanoiMap.getContainer().style.filter = 'brightness(0.9) hue-rotate(200deg)';
        
        // Remove double-click handler for adding points
        
        console.log('Map initialized successfully');
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Map Initialized Successfully');
        }
    } catch (error) {
        console.error('Error initializing map:', error);
        // Don't show alert immediately, might be loading issue
        setTimeout(() => {
            if (!hanoiMap) {
                showAlert('Lỗi khởi tạo bản đồ - vui lòng tải lại trang', 'warning');
            }
        }, 2000);
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Calculate MST button
    document.getElementById('calculate-mst')?.addEventListener('click', calculateMST);
    
    // Reset button
    document.getElementById('resetBtn')?.addEventListener('click', resetApplication);
    
    // Animation controls
    document.getElementById('play-pause')?.addEventListener('click', toggleAnimation);
    document.getElementById('step-forward')?.addEventListener('click', stepForward);
    document.getElementById('step-backward')?.addEventListener('click', stepBackward);
    
    // Speed control buttons
    document.getElementById('speed-slow')?.addEventListener('click', function() {
        if (window.animationController) {
            animationController.setSpeed(3000);
            showAlert('Đã chọn tốc độ chậm', 'info');
        }
    });
    
    document.getElementById('speed-fast')?.addEventListener('click', function() {
        if (window.animationController) {
            animationController.setSpeed(1000);
            showAlert('Đã chọn tốc độ nhanh', 'info');
        }
    });
}

/**
 * Load restaurant location data from API
 */
async function loadLocationData() {
    if (typeof updateLoadingProgress === 'function') {
        updateLoadingProgress('Loading Location Data from API');
    }
    
    try {
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('API Response Received');
        }
        
        const data = await response.json();
        
        if (data.restaurants) {
            displayRestaurantMarkers(data.restaurants);
            // Enable the calculate button
            updateCalculateButton();
            console.log('Location data loaded successfully');
            if (typeof updateLoadingProgress === 'function') {
                updateLoadingProgress('Restaurant Markers Added');
            }
        } else {
            throw new Error('No restaurant data received');
        }
    } catch (error) {
        console.error('Error loading location data:', error);
        if (typeof updateLoadingProgress === 'function') {
            updateLoadingProgress('Failed to Load Location Data', false);
        }
        showAlert('Lỗi khi tải dữ liệu địa điểm', 'danger');
    }
}

/**
 * Display restaurant markers on map
 */
function displayRestaurantMarkers(restaurants) {
    try {
        if (!hanoiMap) {
            throw new Error('Map not initialized');
        }
        
        Object.keys(restaurants).forEach(id => {
            const restaurant = restaurants[id];
            
            // Validate coordinates
            if (!restaurant.lat || !restaurant.lng) {
                console.warn(`Invalid coordinates for restaurant ${id}`);
                return;
            }
            
            // Create custom icon based on type
            const icon = L.divIcon({
                className: `custom-marker ${restaurant.type}`,
                html: `<div class="marker-content">
                        <i class="fas ${restaurant.type === 'main' ? 'fa-star' : 'fa-store'}"></i>
                        <span class="marker-label">${id}</span>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });
            
            // Create draggable marker (no selection needed)
            const marker = L.marker([restaurant.lat, restaurant.lng], { 
                icon: icon,
                draggable: true // Enable dragging
            })
                .bindPopup(`
                    <div class="popup-content">
                        <h6>${restaurant.name}</h6>
                        <p class="mb-1">${restaurant.location}</p>
                        <small class="text-muted">${restaurant.description}</small>
                    </div>
                `);
            
            // Add drag handler to update coordinates
            marker.on('dragend', (e) => updatePointPosition(id, e.target.getLatLng()));
            
            // Add to map and store reference
            marker.addTo(hanoiMap);
            locationMarkers[id] = marker;
        });
        
        console.log(`Added ${Object.keys(locationMarkers).length} markers to map`);
    } catch (error) {
        console.error('Error displaying restaurant markers:', error);
        showAlert('Lỗi hiển thị markers trên bản đồ', 'danger');
    }
}

// Unused selection functions removed
function toggleLocationSelection(locationId, restaurant) {
    const index = selectedLocations.indexOf(locationId);
    
    if (index === -1) {
        // Add location
        selectedLocations.push(locationId);
        locationMarkers[locationId].getElement().classList.add('selected');
    } else {
        // Remove location
        selectedLocations.splice(index, 1);
        locationMarkers[locationId].getElement().classList.remove('selected');
    }
    
    updateSelectedLocationsDisplay();
    updateCalculateButton();
    
    if (selectedLocations.length >= 2) {
        updateLocationSelection();
    }
}

/**
 * Update selected locations display
 */
function updateSelectedLocationsDisplay() {
    const container = document.getElementById('selected-locations');
    const countSpan = document.getElementById('selected-count');
    
    countSpan.textContent = selectedLocations.length;
    
    if (selectedLocations.length === 0) {
        container.innerHTML = '<span class=\"text-muted\">Chưa chọn địa điểm nào</span>';
    } else {
        container.innerHTML = selectedLocations.map(id => `
            <span class=\"badge bg-primary fs-6\">
                ${id} 
                <button type=\"button\" class=\"btn-close btn-close-white ms-1\" 
                        onclick=\"removeLocation('${id}')\" aria-label=\"Close\"></button>
            </span>
        `).join('');
    }
}

/**
 * Remove location from selection
 */
function removeLocation(locationId) {
    const index = selectedLocations.indexOf(locationId);
    if (index > -1) {
        selectedLocations.splice(index, 1);
        locationMarkers[locationId].getElement().classList.remove('selected');
        updateSelectedLocationsDisplay();
        updateCalculateButton();
        
        if (selectedLocations.length >= 2) {
            updateLocationSelection();
        } else {
            clearDistanceInfo();
        }
    }
}

/**
 * Update calculate button state
 */
function updateCalculateButton() {
    const button = document.getElementById('calculate-mst');
    // Always enable the button since we use all points automatically
    
    button.disabled = false;
    
    button.innerHTML = '<i class=\"fas fa-calculator me-1\"></i>Tính MST cho tất cả điểm';
}

/**
 * Update location selection on backend
 */
async function updateLocationSelection() {
    try {
        const response = await fetch('/api/locations/select', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                locations: selectedLocations
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayDistanceInfo(data.costs);
        } else {
            console.error('Error updating locations:', data.error);
        }
    } catch (error) {
        console.error('Error updating location selection:', error);
    }
}

/**
 * Display distance information
 */
function displayDistanceInfo(costs) {
    const container = document.getElementById('distances-info');
    
    if (Object.keys(costs).length === 0) {
        container.innerHTML = '<p class=\"text-muted mb-0\">Chọn ít nhất 2 địa điểm để xem khoảng cách</p>';
        return;
    }
    
    let html = '<div class=\"small\">';
    Object.entries(costs).forEach(([edge, distance]) => {
        html += `<div class=\"d-flex justify-content-between mb-1\">
                    <span>${edge}:</span>
                    <span class=\"fw-bold text-primary\">${distance} km</span>
                 </div>`;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

/**
 * Clear distance information
 */
function clearDistanceInfo() {
    const container = document.getElementById('distances-info');
    container.innerHTML = '<p class=\"text-muted mb-0\">Chọn ít nhất 2 địa điểm để xem khoảng cách</p>';
}

/**
 * Calculate MST for selected locations
 */
async function calculateMST() {
    // Auto use all points - no selection needed
    
    const algorithm = document.querySelector('input[name=\"algorithm\"]:checked').value;
    
    try {
        const response = await fetch('/api/solve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                algorithm: algorithm,
                start_vertex: 'A'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentResult = data.result;
            displayMSTResult(data.result, algorithm);
            showAnimationControls();
            drawMSTOnMap(data.result.edges);
            
            // Initialize animation controller
            if (window.animationController) {
                animationController.setResult(data.result);
            }
        } else {
            showAlert(data.error || 'Lỗi khi tính toán MST', 'danger');
        }
    } catch (error) {
        console.error('Error calculating MST:', error);
        showAlert('Lỗi khi tính toán MST', 'danger');
    }
}

/**
 * Display MST result
 */
function displayMSTResult(result, algorithm) {
    const container = document.getElementById('mst-result');
    const panel = document.getElementById('results-panel');
    
    let html = `
        <div class=\"alert alert-success mb-3\">
            <h6 class=\"mb-2\">
                <i class=\"fas fa-trophy me-2\"></i>
                Thuật toán: ${algorithm.toUpperCase()}
            </h6>
            <div class=\"row\">
                <div class=\"col-6\">
                    <strong>Tổng chi phí:</strong>
                </div>
                <div class=\"col-6 text-end\">
                    <span class=\"badge bg-success fs-6\">${result.total_cost.toFixed(2)} km</span>
                </div>
            </div>
        </div>
        
        <div class=\"mb-3\">
            <h6>Các cạnh trong MST:</h6>
            <div class=\"list-group list-group-flush\">
    `;
    
    result.edges.forEach(edge => {
        html += `
            <div class=\"list-group-item d-flex justify-content-between align-items-center p-2\">
                <span>${edge.u} ↔ ${edge.v}</span>
                <span class=\"badge bg-primary\">${edge.weight} km</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div class=\"text-center\">
            <small class=\"text-muted\">${result.steps.length} bước thực hiện</small>
        </div>
    `;
    
    container.innerHTML = html;
    panel.style.display = 'block';
}

/**
 * Draw MST edges on map
 */
function drawMSTOnMap(edges) {
    // Clear existing MST edges
    clearMSTEdges();
    
    edges.forEach(edge => {
        const fromMarker = locationMarkers[edge.u];
        const toMarker = locationMarkers[edge.v];
        
        if (fromMarker && toMarker) {
            const line = L.polyline([
                fromMarker.getLatLng(),
                toMarker.getLatLng()
            ], {
                color: '#28a745',
                weight: 4,
                opacity: 0.8,
                className: 'mst-edge'
            }).addTo(hanoiMap);
            
            // Add label with distance
            const midpoint = L.latLngBounds([fromMarker.getLatLng(), toMarker.getLatLng()]).getCenter();
            const label = L.marker(midpoint, {
                icon: L.divIcon({
                    className: 'edge-label',
                    html: `<span class=\"badge bg-success\">${edge.weight} km</span>`,
                    iconSize: [60, 20],
                    iconAnchor: [30, 10]
                })
            }).addTo(hanoiMap);
            
            mstEdges.push(line, label);
        }
    });
}

/**
 * Clear MST edges from map
 */
function clearMSTEdges() {
    mstEdges.forEach(edge => {
        hanoiMap.removeLayer(edge);
    });
    mstEdges = [];
}

/**
 * Show animation controls and status sections
 */
function showAnimationControls() {
    document.getElementById('animation-panel').style.display = 'block';
    document.getElementById('current-step-display').style.display = 'block';
    document.getElementById('console-section').style.display = 'block';
}

/**
 * Toggle animation play/pause
 */
function toggleAnimation() {
    if (window.playPause) {
        playPause();
    }
}

/**
 * Animation step forward
 */
function stepForward() {
    if (window.stepForward) {
        window.stepForward();
    }
}

/**
 * Animation step backward
 */
function stepBackward() {
    if (window.stepBackward) {
        window.stepBackward();
    }
}

/**
 * Reset application to initial state
 */
async function resetApplication() {
    try {
        await fetch('/api/reset');
        
        // Clear selections
        selectedLocations = [];
        currentResult = null;
        
        // Update UI
        Object.values(locationMarkers).forEach(marker => {
            marker.getElement().classList.remove('selected');
        });
        
        updateSelectedLocationsDisplay();
        updateCalculateButton();
        clearDistanceInfo();
        clearMSTEdges();
        
        // Hide panels
        document.getElementById('animation-panel').style.display = 'none';
        document.getElementById('results-panel').style.display = 'none';
        document.getElementById('current-step-display').style.display = 'none';
        document.getElementById('console-section').style.display = 'none';
        
        // Clear console
        const consoleLog = document.getElementById('console-log');
        if (consoleLog) {
            consoleLog.innerHTML = '';
        }
        
        showAlert('Đã reset ứng dụng', 'info');
        
    } catch (error) {
        console.error('Error resetting application:', error);
        showAlert('Lỗi khi reset ứng dụng', 'danger');
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

// Add custom CSS for markers
const markerStyle = document.createElement('style');
markerStyle.textContent = `
    .custom-marker {
        background: transparent !important;
        border: none !important;
    }
    
    .marker-content {
        background: var(--neon-cyan);
        color: var(--dark-bg);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        position: relative;
    }
    
    .marker-content:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,255,255,0.4);
    }
    
    .custom-marker.selected .marker-content {
        background: var(--neon-green);
        transform: scale(1.2);
        box-shadow: 0 0 20px var(--neon-green);
    }
    
    .custom-marker.main .marker-content {
        background: var(--neon-orange);
    }
    
    .marker-label {
        font-size: 14px;
        font-weight: bold;
    }
    
    .edge-label {
        background: transparent !important;
        border: none !important;
    }
    
    .popup-content h6 {
        color: var(--neon-cyan);
        margin-bottom: 0.5rem;
    }
    
    .mst-edge {
        animation: edgePulse 2s infinite;
    }
    
    @keyframes edgePulse {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(markerStyle);

/**
 * Update point position after dragging
 */
function updatePointPosition(pointId, newLatLng) {
    // Update the restaurant data on the backend
    fetch('/api/points/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pointId: pointId,
            lat: newLatLng.lat,
            lng: newLatLng.lng
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert(`Đã cập nhật vị trí điểm ${pointId}`, 'success');
        } else {
            showAlert('Lỗi khi cập nhật vị trí', 'danger');
            // Revert position
            loadLocationData();
        }
    })
    .catch(error => {
        console.error('Error updating point position:', error);
        showAlert('Lỗi khi cập nhật vị trí', 'danger');
        loadLocationData();
    });
}

// Add/remove point functions removed - not needed for simplified version