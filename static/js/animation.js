class AnimationController {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.animationSpeed = 2000; // Slower speed for demo
        this.interval = null;
        this.result = null;
    }
    
    setResult(result) {
        this.result = result;
        this.totalSteps = result ? result.steps.length : 0;
        this.currentStep = 0;
    }
    
    play() {
        if (!this.result || this.isPlaying) return;
        
        this.isPlaying = true;
        this.updatePlayButton();
        
        this.interval = setInterval(() => {
            if (this.currentStep < this.totalSteps - 1) {
                this.stepForward();
            } else {
                this.pause();
            }
        }, this.animationSpeed); // Slower for better comprehension
    }
    
    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isPlaying = false;
        this.updatePlayButton();
    }
    
    stepForward() {
        if (!this.result || this.currentStep >= this.totalSteps - 1) return;
        
        this.currentStep++;
        this.updateVisualization();
        this.updateProgress();
        this.updateStepInfo();
    }
    
    stepBackward() {
        if (!this.result || this.currentStep <= 0) return;
        
        this.currentStep--;
        this.updateVisualization();
        this.updateProgress();
        this.updateStepInfo();
    }
    
    reset() {
        this.pause();
        this.currentStep = 0;
        this.updateVisualization();
        this.updateProgress();
        this.updateStepInfo();
    }
    
    setSpeed(speed) {
        // Limit minimum speed for demo clarity
        this.animationSpeed = Math.max(speed, 1500);
        if (this.isPlaying) {
            this.pause();
            this.play();
        }
    }
    
    updateVisualization() {
        if (!this.result || this.currentStep < 0 || this.currentStep >= this.totalSteps) return;
        
        const step = this.result.steps[this.currentStep];
        this.renderStep(step);
    }
    
    renderStep(step) {
        // Update console log and components visualization
        this.updateConsoleLog(step);
        this.updateComponentsVisualization(step);
        
        // Update map visualization if available
        if (typeof drawMSTOnMap === 'function' && step.step_type === 'accept') {
            const acceptedEdges = this.getAcceptedEdgesUpToStep(this.currentStep);
            if (acceptedEdges.length > 0) {
                drawMSTOnMap(acceptedEdges);
            }
        }
    }
    
    getAcceptedEdgesUpToStep(stepIndex) {
        if (!this.result) return [];
        
        const acceptedEdges = [];
        for (let i = 0; i <= stepIndex; i++) {
            const step = this.result.steps[i];
            if (step.step_type === 'accept' && step.edge) {
                acceptedEdges.push(step.edge);
            }
        }
        return acceptedEdges;
    }
    
    updateProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar && this.totalSteps > 0) {
            const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.setAttribute('aria-valuenow', progress);
        }
    }
    
    updateStepInfo() {
        const currentStepInfo = document.getElementById('current-step-info');
        
        if (currentStepInfo) {
            if (this.totalSteps === 0) {
                currentStepInfo.innerHTML = '<span class="text-muted">Chưa có dữ liệu</span>';
            } else {
                const step = this.result.steps[this.currentStep];
                const statusBadge = step.step_type === 'accept' ? 
                    '<span class="status-badge accept">ACCEPTED</span>' : 
                    '<span class="status-badge reject">REJECTED</span>';
                
                // Add CSS for status badges
                if (!document.getElementById('status-badge-styles')) {
                    const badgeStyles = document.createElement('style');
                    badgeStyles.id = 'status-badge-styles';
                    badgeStyles.textContent = `
                        .status-badge {
                            padding: 0.25rem 0.5rem;
                            border-radius: var(--radius-sm);
                            font-size: 0.75rem;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.05em;
                        }
                        .status-badge.accept {
                            background: var(--accent-green);
                            color: var(--primary-bg);
                        }
                        .status-badge.reject {
                            background: var(--error);
                            color: var(--text-primary);
                        }
                    `;
                    document.head.appendChild(badgeStyles);
                }
                
                currentStepInfo.innerHTML = `
                    <div class="step-header">
                        <div class="step-number">
                            Step ${this.currentStep + 1}/${this.totalSteps}
                        </div>
                        <div class="step-status">
                            ${statusBadge}
                            ${this.isPlaying ? '<span class="status-playing"><i class="fas fa-play"></i> PLAYING</span>' : ''}
                        </div>
                    </div>
                    <div class="step-description">${step.explanation}</div>
                    ${step.edge ? `<div class="step-edge">Edge: ${step.edge.u}-${step.edge.v} (${step.edge.weight} km)</div>` : ''}
                    ${step.total_cost ? `<div class="step-cost">Total Cost: ${step.total_cost.toFixed(1)} km</div>` : ''}
                `;
                
                // Add CSS for modern step display
                if (!document.getElementById('step-display-styles')) {
                    const stepStyles = document.createElement('style');
                    stepStyles.id = 'step-display-styles';
                    stepStyles.textContent = `
                        .step-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 0.75rem;
                        }
                        .step-number {
                            font-family: var(--font-mono);
                            font-weight: 600;
                            color: var(--accent-blue);
                        }
                        .step-status {
                            display: flex;
                            gap: 0.5rem;
                            align-items: center;
                        }
                        .status-playing {
                            background: var(--accent-blue);
                            color: var(--primary-bg);
                            padding: 0.25rem 0.5rem;
                            border-radius: var(--radius-sm);
                            font-size: 0.75rem;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 0.25rem;
                        }
                        .step-description {
                            color: var(--text-primary);
                            margin-bottom: 0.5rem;
                            line-height: 1.5;
                        }
                        .step-edge {
                            color: var(--accent-blue);
                            font-size: 0.875rem;
                            font-family: var(--font-mono);
                            margin-bottom: 0.25rem;
                        }
                        .step-cost {
                            color: var(--accent-green);
                            font-size: 0.875rem;
                            font-weight: 600;
                            font-family: var(--font-mono);
                        }
                    `;
                    document.head.appendChild(stepStyles);
                }
            }
        }
    }
    
    updatePlayButton() {
        const playIcon = document.getElementById('play-icon');
        if (playIcon) {
            playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
    
    // Removed updateCurrentStepCard as it's now integrated into updateStepInfo
    
    updateConsoleLog(step) {
        const consoleLog = document.getElementById('console-log');
        if (!consoleLog) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = `console-entry mb-1 p-2 rounded small`;
        
        let bgClass = 'bg-light';
        let textClass = 'text-dark';
        let icon = 'fas fa-info-circle';
        
        if (step.step_type === 'accept') {
            bgClass = 'bg-success bg-opacity-10';
            textClass = 'text-success';
            icon = 'fas fa-check-circle';
        } else if (step.step_type === 'reject') {
            bgClass = 'bg-danger bg-opacity-10';
            textClass = 'text-danger';
            icon = 'fas fa-times-circle';
        }
        
        logEntry.className += ` ${bgClass} ${textClass}`;
        logEntry.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="${icon} me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <strong>[${this.currentStep + 1}]</strong> ${step.explanation}
                    ${step.edge ? `<br><small class="text-muted">Cạnh: ${step.edge.u}-${step.edge.v} (${step.edge.weight})</small>` : ''}
                    ${step.total_cost ? `<br><small class="text-muted">Tổng chi phí hiện tại: ${step.total_cost.toFixed(1)} triệu VND</small>` : ''}
                </div>
            </div>
        `;
        
        consoleLog.appendChild(logEntry);
        consoleLog.scrollTop = consoleLog.scrollHeight;
        
        if (consoleLog.children.length > 10) {
            consoleLog.removeChild(consoleLog.firstChild);
        }
    }
    
    updateComponentsVisualization(step) {
        if (!step.components || step.components.length === 0) return;
        
        const componentsDiv = this.createOrGetComponentsDiv();
        let html = '<div class="components-visualization"><h6 class="mb-2">Thành phần liên thông:</h6>';
        
        step.components.forEach((component, index) => {
            const color = this.getComponentColor(index);
            html += `
                <div class="component mb-2 p-2 rounded" style="background-color: ${color}20; border-left: 3px solid ${color};">
                    <strong>Thành phần ${index + 1}:</strong> ${component.join(', ')}
                </div>
            `;
        });
        
        html += '</div>';
        componentsDiv.innerHTML = html;
    }
    
    createOrGetComponentsDiv() {
        let div = document.getElementById('components-visualization');
        if (!div) {
            div = document.createElement('div');
            div.id = 'components-visualization';
            div.className = 'mt-3';
            
            const consoleLog = document.getElementById('console-log');
            if (consoleLog && consoleLog.parentNode) {
                consoleLog.parentNode.appendChild(div);
            }
        }
        return div;
    }
    
    getComponentColor(index) {
        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1'];
        return colors[index % colors.length];
    }
}

const animationController = new AnimationController();

function playPause() {
    if (!currentResult) {
        if (typeof showAlert === 'function') {
            showAlert('Chưa có kết quả thuật toán. Vui lòng chạy thuật toán trước!', 'warning');
        }
        return;
    }
    
    animationController.setResult(currentResult);
    
    if (animationController.isPlaying) {
        animationController.pause();
    } else {
        animationController.play();
    }
}

function stepForward() {
    if (!currentResult) return;
    
    animationController.setResult(currentResult);
    animationController.stepForward();
}

function stepBackward() {
    if (!currentResult) return;
    
    animationController.setResult(currentResult);
    animationController.stepBackward();
}

function resetAnimation() {
    animationController.reset();
}

// Speed controls are now handled in main.js with buttons

// Window resize handler for map
window.addEventListener('resize', function() {
    if (hanoiMap) {
        setTimeout(() => {
            hanoiMap.invalidateSize();
        }, 100);
    }
});