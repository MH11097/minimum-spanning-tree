/**
 * Modern MST Algorithm Lab - Main Application
 */

let hanoiMap = null;
let locationMarkers = {};
let currentResult = null;
let mstEdges = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔬 MST Algorithm Lab - Initializing...');
    
    try {
        setupEventListeners();
        console.log('✅ Event listeners setup complete');
        
        // Initialize map
        setTimeout(() => {
            initializeMap();
            loadLocationData();
        }, 100);
        
    } catch (error) {
        console.error('❌ Critical initialization error:', error);
        showModernNotification('Initialization failed - please refresh', 'error');
    }
});

/**
 * Initialize the Leaflet map with modern styling
 */
function initializeMap() {
    try {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded yet');
            setTimeout(initializeMap, 500);
            return;
        }
        
        // Check if map container exists
        const mapContainer = document.getElementById('hanoi-map');
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }
        
        // Prevent multiple initialization
        if (hanoiMap) {
            console.log('Map already initialized');
            return;
        }
        
        console.log('🗺️ Creating Leaflet map...');
        
        // Center on Hanoi with modern view
        hanoiMap = L.map('hanoi-map', {
            zoomControl: false,
            attributionControl: false
        }).setView([21.0285, 105.8542], 12);
        
        // Add custom zoom control
        L.control.zoom({
            position: 'topright'
        }).addTo(hanoiMap);
        
        // Add dark-themed tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(hanoiMap);
        
        // Apply modern styling
        setTimeout(() => {
            updateMapStyling();
        }, 500);
        
        console.log('✅ Map initialized successfully');
        
    } catch (error) {
        console.error('❌ Error initializing map:', error);
        showModernNotification('Map initialization failed', 'error');
    }
}

/**
 * Setup event listeners with modern interactions
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
    document.getElementById('speed-slow')?.addEventListener('click', () => setAnimationSpeed('slow', 3000));
    document.getElementById('speed-normal')?.addEventListener('click', () => setAnimationSpeed('normal', 2000));
    document.getElementById('speed-fast')?.addEventListener('click', () => setAnimationSpeed('fast', 1000));
}

/**
 * Set animation speed and update UI
 */
function setAnimationSpeed(speedName, speed) {
    if (window.animationController) {
        animationController.setSpeed(speed);
    }
    
    // Update speed button states
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`speed-${speedName}`)?.classList.add('active');
    
    showModernNotification(`Animation speed: ${speedName}`, 'info');
}

/**
 * Load restaurant location data from API
 */
async function loadLocationData() {
    try {
        showProgress('Loading location data...');
        
        const response = await fetch('/api/data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.restaurants) {
            displayRestaurantMarkers(data.restaurants);
            updateCalculateButton();
            
            // Update header stats
            if (typeof updateHeaderStats === 'function') {
                const nodeCount = Object.keys(data.restaurants).length;
                const edgeCount = nodeCount * (nodeCount - 1) / 2;
                updateHeaderStats(nodeCount, edgeCount, 0);
            }
            
            console.log('✅ Location data loaded successfully');
            showModernNotification('Graph loaded successfully', 'success');
        } else {
            throw new Error('No restaurant data received');
        }
    } catch (error) {
        console.error('❌ Error loading location data:', error);
        showModernNotification('Failed to load graph data', 'error');
    } finally {
        hideProgress();
    }
}

/**
 * Display restaurant markers with modern styling
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
            
            // Create modern marker icon
            const icon = L.divIcon({
                className: `custom-marker ${restaurant.type}`,
                html: `<div class=\"marker-content\">${id}</div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40]
            });
            
            // Create draggable marker
            const marker = L.marker([restaurant.lat, restaurant.lng], { 
                icon: icon,
                draggable: true
            }).bindPopup(`
                <div class=\"popup-content\">
                    <h6>${restaurant.name}</h6>
                    <p>${restaurant.location}</p>
                    <small>${restaurant.description}</small>
                </div>
            `);
            
            // Add drag handler
            marker.on('dragend', (e) => updatePointPosition(id, e.target.getLatLng()));
            
            // Add to map and store reference
            marker.addTo(hanoiMap);
            locationMarkers[id] = marker;
        });
        
        console.log(`✅ Added ${Object.keys(locationMarkers).length} markers to map`);
    } catch (error) {
        console.error('❌ Error displaying markers:', error);
        showModernNotification('Failed to display markers', 'error');
    }
}

/**
 * Update calculate button state
 */
function updateCalculateButton() {
    const button = document.getElementById('calculate-mst');
    if (button) {
        button.disabled = false;
        
        // Ensure button has correct structure
        const icon = button.querySelector('i');
        const span = button.querySelector('span');
        if (icon && span) {
            span.textContent = 'Execute MST Analysis';
        }
    }
}

/**
 * Calculate MST for all locations with modern progress indication
 */
async function calculateMST() {
    const algorithm = document.querySelector('input[name=\"algorithm\"]:checked').value;
    
    // Show modern progress
    showProgress(`Executing ${algorithm.toUpperCase()} algorithm...`);
    
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
            
            // Update header stats
            if (typeof updateHeaderStats === 'function') {
                const nodeCount = Object.keys(locationMarkers).length;
                const edgeCount = data.result.edges.length;
                updateHeaderStats(nodeCount, edgeCount, data.result.total_cost);
            }
            
            // Initialize animation controller
            if (window.animationController) {
                animationController.setResult(data.result);
            }
            
            showModernNotification(`${algorithm.toUpperCase()} analysis completed!`, 'success');
        } else {
            showModernNotification(data.error || 'Analysis failed', 'error');
        }
    } catch (error) {
        console.error('❌ Error calculating MST:', error);
        showModernNotification('Network error - please try again', 'error');
    } finally {
        hideProgress();
    }
}

/**
 * Display MST result with modern styling
 */
function displayMSTResult(result, algorithm) {
    const container = document.getElementById('mst-result');
    const panel = document.getElementById('results-panel');
    
    if (!container || !panel) return;
    
    const html = `
        <div class=\"result-summary\">
            <div class=\"result-metric\">
                <span class=\"metric-label\">Algorithm:</span>
                <span class=\"metric-value\">${algorithm.toUpperCase()}</span>
            </div>
            <div class=\"result-metric\">
                <span class=\"metric-label\">Total Cost:</span>
                <span class=\"metric-value\">${result.total_cost.toFixed(2)} km</span>
            </div>
            <div class=\"result-metric\">
                <span class=\"metric-label\">Edges:</span>
                <span class=\"metric-value\">${result.edges.length}</span>
            </div>
            <div class=\"result-metric\">
                <span class=\"metric-label\">Steps:</span>
                <span class=\"metric-value\">${result.steps.length}</span>
            </div>
        </div>
        
        <div class=\"edge-list\">
            <h4 style=\"color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 1rem; font-weight: 600;\">
                MST EDGE CONNECTIONS
            </h4>
            ${result.edges.map(edge => `
                <div class=\"edge-item\">
                    <span class=\"edge-connection\">${edge.u} ↔ ${edge.v}</span>
                    <span class=\"edge-weight\">${edge.weight} km</span>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
    panel.style.display = 'block';
    panel.classList.add('fade-in');
}

/**
 * Draw MST edges on map with modern styling
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
                color: '#00FF94',
                weight: 3,
                opacity: 0.9,
                className: 'mst-edge'
            }).addTo(hanoiMap);
            
            // Add modern edge label
            const midpoint = L.latLngBounds([fromMarker.getLatLng(), toMarker.getLatLng()]).getCenter();
            const label = L.marker(midpoint, {
                icon: L.divIcon({
                    className: 'edge-label',
                    html: `<span class=\"edge-weight\">${edge.weight} km</span>`,
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
 * Show animation controls
 */
function showAnimationControls() {
    // Show animation section in control panel
    if (typeof showAnimationSection === 'function') {
        showAnimationSection();
    }
    
    // Show status displays
    const currentStepDisplay = document.getElementById('current-step-display');
    const consoleSection = document.getElementById('console-section');
    
    if (currentStepDisplay) currentStepDisplay.style.display = 'block';
    if (consoleSection) consoleSection.style.display = 'block';
}

/**
 * Animation control functions
 */
function toggleAnimation() {
    if (window.playPause) {
        playPause();
    }
}

function stepForward() {
    if (window.stepForward) {
        window.stepForward();
    }
}

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
        showProgress('Resetting system...');
        
        await fetch('/api/reset');
        
        // Clear data
        currentResult = null;
        
        // Update UI
        Object.values(locationMarkers).forEach(marker => {
            marker.getElement()?.classList.remove('selected');
        });
        
        updateCalculateButton();
        clearMSTEdges();
        
        // Hide panels
        document.getElementById('animation-section')?.style.setProperty('display', 'none');
        document.getElementById('results-panel')?.style.setProperty('display', 'none');
        document.getElementById('current-step-display')?.style.setProperty('display', 'none');
        document.getElementById('console-section')?.style.setProperty('display', 'none');
        
        // Reset header stats
        if (typeof updateHeaderStats === 'function') {
            const nodeCount = Object.keys(locationMarkers).length;
            const edgeCount = nodeCount * (nodeCount - 1) / 2;
            updateHeaderStats(nodeCount, edgeCount, 0);
        }
        
        // Clear console
        const consoleLog = document.getElementById('console-log');
        if (consoleLog) {
            consoleLog.innerHTML = '';
        }
        
        showModernNotification('System reset successfully', 'success');
        
    } catch (error) {
        console.error('❌ Error resetting application:', error);
        showModernNotification('Reset failed - please refresh', 'error');
    } finally {
        hideProgress();
    }
}

/**
 * Update point position after dragging
 */
function updatePointPosition(pointId, newLatLng) {
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
            showModernNotification(`Node ${pointId} position updated`, 'success');
        } else {
            showModernNotification('Position update failed', 'error');
            loadLocationData(); // Revert
        }
    })
    .catch(error => {
        console.error('❌ Error updating point position:', error);
        showModernNotification('Network error', 'error');
        loadLocationData(); // Revert
    });
}

/**
 * Apply modern styling to map
 */
function updateMapStyling() {
    if (hanoiMap) {
        const mapContainer = hanoiMap.getContainer();
        
        // Apply dark theme filter
        mapContainer.style.filter = 'brightness(0.6) contrast(1.2) saturate(0.8) hue-rotate(200deg)';
        
        // Style controls
        const controls = mapContainer.querySelectorAll('.leaflet-control');
        controls.forEach(control => {
            control.style.background = 'rgba(26, 29, 35, 0.95)';
            control.style.backdropFilter = 'blur(20px)';
            control.style.border = '1px solid var(--border-color)';
            control.style.borderRadius = 'var(--radius-md)';
        });
    }
}

/**
 * Show modern notification
 */
function showModernNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.modern-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'modern-notification';
    
    const colors = {
        info: 'var(--accent-blue)',
        success: 'var(--accent-green)',
        error: 'var(--error)',
        warning: 'var(--warning)'
    };
    
    const icons = {
        info: 'fas fa-info-circle',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 2000;
        background: rgba(26, 29, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid ${colors[type]};
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        color: var(--text-primary);
        box-shadow: var(--shadow-lg);
        min-width: 300px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-family: var(--font-sans);
    `;
    
    notification.innerHTML = `
        <i class=\"${icons[type]}\" style=\"color: ${colors[type]}; font-size: 1.2rem;\"></i>
        <span style=\"flex: 1; font-weight: 500;\">${message}</span>
        <button onclick=\"this.parentElement.remove()\" style=\"
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.1rem;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        \" onmouseover=\"this.style.background='var(--surface-light)'\" onmouseout=\"this.style.background='none'\">
            <i class=\"fas fa-times\"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

/**
 * Progress indication functions
 */
function showProgress(text = 'Processing...') {
    const indicator = document.getElementById('progress-indicator');
    const progressText = document.getElementById('progress-text');
    if (indicator) indicator.style.display = 'block';
    if (progressText) progressText.textContent = text;
}

function hideProgress() {
    const indicator = document.getElementById('progress-indicator');
    if (indicator) indicator.style.display = 'none';
}

// Legacy compatibility
function showAlert(message, type = 'info') {
    showModernNotification(message, type);
}

// Add notification animation styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

console.log('🔬 Modern MST Algorithm Lab - Ready');