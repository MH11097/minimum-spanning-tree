class AnimationController {
    constructor() {
        this.isPlaying = false;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.animationSpeed = 1000;
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
        }, this.animationSpeed);
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
        this.animationSpeed = speed;
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
        if (algorithmRenderer && currentData) {
            let highlightedEdges = [];
            let rejectedEdges = [];
            
            if (step.step_type === 'accept' && step.edge) {
                highlightedEdges = this.getAcceptedEdgesUpToStep(this.currentStep);
            } else if (step.step_type === 'reject' && step.edge) {
                rejectedEdges = [step.edge];
                highlightedEdges = this.getAcceptedEdgesUpToStep(this.currentStep);
            } else {
                highlightedEdges = this.getAcceptedEdgesUpToStep(this.currentStep);
            }
            
            algorithmRenderer.render(currentData, highlightedEdges, rejectedEdges);
        }
        
        this.updateConsoleLog(step);
        this.updateComponentsVisualization(step);
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
        const stepInfo = document.getElementById('step-info');
        if (stepInfo) {
            if (this.totalSteps === 0) {
                stepInfo.textContent = 'Chưa có dữ liệu';
            } else {
                stepInfo.textContent = `Bước ${this.currentStep + 1}/${this.totalSteps}`;
                
                if (this.result && this.result.steps[this.currentStep]) {
                    const step = this.result.steps[this.currentStep];
                    stepInfo.textContent += ` - ${step.explanation}`;
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
        showAlert('Chưa có kết quả thuật toán. Vui lòng chạy thuật toán trước!', 'warning');
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

document.getElementById('speed-select')?.addEventListener('change', function() {
    const speed = parseInt(this.value);
    animationController.setSpeed(speed);
});

window.addEventListener('resize', function() {
    if (graphRenderer) {
        setTimeout(() => {
            if (currentData) renderGraph(currentData);
        }, 100);
    }
    
    if (algorithmRenderer) {
        setTimeout(() => {
            if (currentData) renderAlgorithmVisualization();
        }, 100);
    }
    
    if (mstRenderer) {
        setTimeout(() => {
            if (currentData && currentResult) renderMSTResult();
        }, 100);
    }
});