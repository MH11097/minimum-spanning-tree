class GraphRenderer {
    constructor(containerId, width = 600, height = 400) {
        this.containerId = containerId;
        this.width = width;
        this.height = height;
        this.svg = null;
        this.nodes = [];
        this.links = [];
        this.simulation = null;
    }
    
    init() {
        const container = d3.select(`#${this.containerId}`);
        container.selectAll('*').remove();
        
        this.svg = container
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${this.width} ${this.height}`)
            .style('background-color', '#f8f9fa');
        
        this.svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 4)
            .attr('markerHeight', 4)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#999');
    }
    
    render(data, highlightedEdges = [], rejectedEdges = []) {
        if (!data || !data.restaurants || !data.costs) return;
        
        this.prepareData(data);
        this.renderGraph(highlightedEdges, rejectedEdges);
    }
    
    prepareData(data) {
        this.nodes = Object.keys(data.restaurants).map(id => ({
            id: id,
            name: data.restaurants[id].name,
            type: data.restaurants[id].type,
            x: this.getNodePosition(id).x,
            y: this.getNodePosition(id).y,
            fx: this.getNodePosition(id).x,
            fy: this.getNodePosition(id).y
        }));
        
        this.links = [];
        Object.entries(data.costs).forEach(([key, weight]) => {
            const [source, target] = key.includes('(') ? 
                key.slice(1, -1).split(', ').map(s => s.trim().replace(/'/g, '')) :
                key.split('-').map(s => s.trim());
            
            this.links.push({
                source: source,
                target: target,
                weight: weight,
                id: `${source}-${target}`
            });
        });
    }
    
    getNodePosition(nodeId) {
        const positions = {
            'A': { x: this.width / 2, y: this.height / 2 - 80 },
            'B': { x: this.width / 2 + 120, y: this.height / 2 - 40 },
            'C': { x: this.width / 2 - 120, y: this.height / 2 - 40 },
            'D': { x: this.width / 2 + 80, y: this.height / 2 + 60 },
            'E': { x: this.width / 2 - 80, y: this.height / 2 + 60 },
            'F': { x: this.width / 2, y: this.height / 2 + 100 }
        };
        
        return positions[nodeId] || { x: this.width / 2, y: this.height / 2 };
    }
    
    renderGraph(highlightedEdges = [], rejectedEdges = []) {
        if (!this.svg) this.init();
        
        this.svg.selectAll('.link').remove();
        this.svg.selectAll('.node').remove();
        this.svg.selectAll('.label').remove();
        
        const linkGroup = this.svg.append('g').attr('class', 'links');
        const nodeGroup = this.svg.append('g').attr('class', 'nodes');
        const labelGroup = this.svg.append('g').attr('class', 'labels');
        
        const links = linkGroup.selectAll('.link')
            .data(this.links)
            .enter()
            .append('g')
            .attr('class', 'link');
        
        links.append('line')
            .attr('x1', d => this.getNodeById(d.source).x)
            .attr('y1', d => this.getNodeById(d.source).y)
            .attr('x2', d => this.getNodeById(d.target).x)
            .attr('y2', d => this.getNodeById(d.target).y)
            .attr('stroke', d => this.getLinkColor(d, highlightedEdges, rejectedEdges))
            .attr('stroke-width', d => this.getLinkWidth(d, highlightedEdges, rejectedEdges))
            .attr('stroke-dasharray', d => rejectedEdges.some(e => 
                (e.u === d.source && e.v === d.target) || (e.u === d.target && e.v === d.source)
            ) ? '5,5' : '0');
        
        links.append('text')
            .attr('x', d => (this.getNodeById(d.source).x + this.getNodeById(d.target).x) / 2)
            .attr('y', d => (this.getNodeById(d.source).y + this.getNodeById(d.target).y) / 2)
            .attr('text-anchor', 'middle')
            .attr('dy', '-5')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#333')
            .attr('stroke', 'white')
            .attr('stroke-width', '3')
            .attr('paint-order', 'stroke')
            .text(d => d.weight);
        
        const nodes = nodeGroup.selectAll('.node')
            .data(this.nodes)
            .enter()
            .append('circle')
            .attr('class', 'node')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 25)
            .attr('fill', d => d.type === 'main' ? '#dc3545' : '#0d6efd')
            .attr('stroke', '#fff')
            .attr('stroke-width', 3);
        
        const labels = labelGroup.selectAll('.label')
            .data(this.nodes)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(d => d.id);
        
        const nodeLabels = labelGroup.selectAll('.node-name')
            .data(this.nodes)
            .enter()
            .append('text')
            .attr('class', 'node-name')
            .attr('x', d => d.x)
            .attr('y', d => d.y + 45)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#666')
            .text(d => d.name);
        
        nodes.append('title')
            .text(d => `${d.id}: ${d.name}`);
    }
    
    getNodeById(id) {
        return this.nodes.find(node => node.id === id);
    }
    
    getLinkColor(link, highlighted, rejected) {
        if (rejected.some(e => 
            (e.u === link.source && e.v === link.target) || 
            (e.u === link.target && e.v === link.source)
        )) {
            return '#dc3545';
        }
        
        if (highlighted.some(e => 
            (e.u === link.source && e.v === link.target) || 
            (e.u === link.target && e.v === link.source)
        )) {
            return '#28a745';
        }
        
        return '#6c757d';
    }
    
    getLinkWidth(link, highlighted, rejected) {
        if (rejected.some(e => 
            (e.u === link.source && e.v === link.target) || 
            (e.u === link.target && e.v === link.source)
        )) {
            return 3;
        }
        
        if (highlighted.some(e => 
            (e.u === link.source && e.v === link.target) || 
            (e.u === link.target && e.v === link.source)
        )) {
            return 4;
        }
        
        return 2;
    }
}

let graphRenderer = null;
let algorithmRenderer = null;
let mstRenderer = null;

function renderGraph(data) {
    if (!graphRenderer) {
        const container = document.getElementById('graph-visualization');
        const rect = container.getBoundingClientRect();
        graphRenderer = new GraphRenderer('graph-visualization', rect.width, rect.height);
    }
    
    graphRenderer.render(data);
}

function renderAlgorithmVisualization(step = null) {
    if (!algorithmRenderer) {
        const container = document.getElementById('algorithm-visualization');
        const rect = container.getBoundingClientRect();
        algorithmRenderer = new GraphRenderer('algorithm-visualization', rect.width, rect.height);
    }
    
    if (!currentData) return;
    
    let highlightedEdges = [];
    let rejectedEdges = [];
    
    if (step && step.edge) {
        if (step.accepted) {
            highlightedEdges = [step.edge];
        } else {
            rejectedEdges = [step.edge];
        }
    } else if (currentResult && currentResult.edges) {
        highlightedEdges = currentResult.edges;
    }
    
    algorithmRenderer.render(currentData, highlightedEdges, rejectedEdges);
}

function renderMSTResult() {
    if (!mstRenderer) {
        const container = document.getElementById('mst-result');
        const rect = container.getBoundingClientRect();
        mstRenderer = new GraphRenderer('mst-result', rect.width, rect.height);
    }
    
    if (!currentData || !currentResult) return;
    
    mstRenderer.render(currentData, currentResult.edges, []);
}