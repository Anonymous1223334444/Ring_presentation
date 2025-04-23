document.addEventListener('DOMContentLoaded', function() {
    // Wait for impress.js to initialize
    setTimeout(function() {
        initCharts();
    }, 1000);
    
    // Track slide changes to reinitialize charts when needed
    document.addEventListener('impress:stepenter', function(event) {
        const currentSlide = event.target;
        
        // Check if current slide contains charts and reinitialize them
        if (currentSlide.querySelectorAll('.chart-container').length > 0) {
            initCharts();
        }
    });
    
    // Initialize all charts based on their container IDs
    function initCharts() {
        // Results chart
        if (document.getElementById('results-chart')) {
            createResultsBarChart();
        }
        
        // Evaluation flow chart
        if (document.getElementById('evaluation-flow-chart')) {
            createEvaluationFlowChart();
        }
        
        // Metrics radar chart
        if (document.getElementById('metrics-radar-chart')) {
            createMetricsRadarChart();
        }
        
        // Pipeline flowchart
        if (document.getElementById('pipeline-flowchart')) {
            createPipelineFlowchart();
        }
        
        // Gain chart
        if (document.getElementById('gain-chart')) {
            createGainChart();
        }
    }
    
    // Results bar chart - shows comparative performance
    function createResultsBarChart() {
        const container = document.getElementById('results-chart');
        
        // Clear previous chart if any
        container.innerHTML = '';
        
        // Chart dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 20, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Data for the chart
        const data = [
            { category: "Texte", value: 0.702, color: "#10b981" },
            { category: "Tableaux", value: 0.456, color: "#ef4444" },
            { category: "Graphiques", value: 0.540, color: "#f59e0b" }
        ];
        
        // Create SVG
        const svg = d3.select("#results-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // Create a group for the chart content
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // X scale
        const x = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerWidth])
            .padding(0.4);
        
        // Y scale
        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        // Add X axis
        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "12px");
        
        // Add Y axis
        g.append("g")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d3.format(".1f")))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "12px");
        
        // Add grid lines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-innerWidth)
                .tickFormat(""))
            .selectAll("line")
            .attr("stroke", "rgba(255, 255, 255, 0.1)");
        
        // Create bars - animated
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.category))
            .attr("y", innerHeight)
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .attr("fill", d => d.color)
            .attr("rx", 5)
            .attr("ry", 5)
            .transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .attr("y", d => y(d.value))
            .attr("height", d => innerHeight - y(d.value));
        
        // Add values above bars
        g.selectAll(".value")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "value")
            .attr("x", d => x(d.category) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .text(d => (d.value * 100).toFixed(1) + "%")
            .transition()
            .duration(1000)
            .delay((d, i) => 200 + i * 200)
            .style("opacity", 1);
        
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#ddd")
            .style("font-size", "14px")
            .text("Performance globale par type de structure");
    }

    // Evaluation flow chart - simplified flowchart
    function createEvaluationFlowChart() {
        const container = document.getElementById('evaluation-flow-chart');
        container.innerHTML = '';
        
        // Data structure for the flow chart
        const nodes = [
            { id: "question", label: "Question", x: 100, y: 30, class: "question" },
            { id: "retriever", label: "Recherche contextuelle", x: 100, y: 80, class: "process" },
            { id: "documents", label: "Documents pertinents", x: 100, y: 130, class: "data" },
            { id: "generation", label: "Génération de réponse", x: 100, y: 180, class: "process" },
            { id: "answer", label: "Réponse générée", x: 100, y: 230, class: "result" },
            { id: "reference", label: "Référence", x: 220, y: 130, class: "data" },
            { id: "evaluation", label: "Évaluation", x: 160, y: 280, class: "process" },
            { id: "metrics", label: "Métriques calculées", x: 160, y: 330, class: "result" }
        ];
        
        const links = [
            { source: "question", target: "retriever" },
            { source: "retriever", target: "documents" },
            { source: "documents", target: "generation" },
            { source: "generation", target: "answer" },
            { source: "answer", target: "evaluation" },
            { source: "question", target: "reference", curved: true },
            { source: "reference", target: "evaluation", curved: true },
            { source: "evaluation", target: "metrics" }
        ];
        
        // Create SVG
        const svg = d3.select("#evaluation-flow-chart")
            .append("svg")
            .attr("width", container.clientWidth)
            .attr("height", container.clientHeight);
        
        // Define node colors
        const nodeColors = {
            question: "#f97316",
            process: "#8b5cf6",
            data: "#10b981",
            result: "#3b82f6"
        };
        
        // Draw links
        links.forEach((link, index) => {
            setTimeout(() => {
                if (link.curved) {
                    // Create curved path
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    
                    // Control point for the curve
                    const cpX = (sourceNode.x + targetNode.x) / 2 + 50;
                    const cpY = (sourceNode.y + targetNode.y) / 2;
                    
                    const path = `M${sourceNode.x},${sourceNode.y} Q${cpX},${cpY} ${targetNode.x},${targetNode.y}`;
                    
                    svg.append("path")
                        .attr("d", path)
                        .attr("fill", "none")
                        .attr("stroke", "#64748b")
                        .attr("stroke-width", 1.5)
                        .attr("opacity", 0)
                        .transition()
                        .duration(500)
                        .attr("opacity", 1);
                } else {
                    // Create straight path
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    
                    svg.append("line")
                        .attr("x1", sourceNode.x)
                        .attr("y1", sourceNode.y)
                        .attr("x2", sourceNode.x)
                        .attr("y2", sourceNode.y)
                        .attr("stroke", "#64748b")
                        .attr("stroke-width", 1.5)
                        .transition()
                        .duration(500)
                        .attr("x2", targetNode.x)
                        .attr("y2", targetNode.y);
                }
            }, index * 200);
        });
        
        // Draw nodes
        nodes.forEach((node, index) => {
            setTimeout(() => {
                const g = svg.append("g")
                    .attr("transform", `translate(${node.x}, ${node.y})`)
                    .attr("opacity", 0)
                    .transition()
                    .duration(500)
                    .attr("opacity", 1);
                
                g.append("circle")
                    .attr("r", 0)
                    .attr("fill", nodeColors[node.class])
                    .transition()
                    .duration(300)
                    .attr("r", 20);
                
                g.append("text")
                    .attr("x", 30)
                    .attr("y", 5)
                    .attr("fill", "#ddd")
                    .style("font-size", "10px")
                    .text(node.label);
            }, 1000 + index * 150);
        });
    }
    
    // Metrics radar chart
    function createMetricsRadarChart() {
        const container = document.getElementById('metrics-radar-chart');
        container.innerHTML = '';
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        
        // Data
        const metrics = ["BLEU", "ROUGE", "Exact Match", "Relevance"];
        const textValues = [0.473, 0.752, 0.703, 0.830];
        const tableValues = [0.433, 0.574, 0.233, 0.750];
        const graphValues = [0.403, 0.585, 0.420, 0.774];
        
        // SVG setup
        const svg = d3.select("#metrics-radar-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        const g = svg.append("g")
            .attr("transform", `translate(${width/2}, ${height/2})`);
        
        // Scales
        const radialScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, Math.min(width, height)/2 - margin.top]);
        
        const angleScale = d3.scalePoint()
            .domain(metrics)
            .range([0, 2 * Math.PI])
            .padding(0.5);
        
        // Draw axis lines
        metrics.forEach(metric => {
            const angle = angleScale(metric);
            const lineX = radialScale(1) * Math.sin(angle);
            const lineY = -radialScale(1) * Math.cos(angle);
            
            g.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", lineX)
                .attr("y2", lineY)
                .attr("stroke", "rgba(255, 255, 255, 0.2)")
                .attr("stroke-width", 1);
            
            // Add metric label
            g.append("text")
                .attr("x", lineX * 1.1)
                .attr("y", lineY * 1.1)
                .attr("text-anchor", "middle")
                .attr("fill", "#ddd")
                .style("font-size", "10px")
                .text(metric);
        });
        
        // Draw circles for the scale
        [0.25, 0.5, 0.75, 1].forEach(value => {
            g.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radialScale(value))
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0.1)")
                .attr("stroke-width", 1);
            
            // Add label for scale
            g.append("text")
                .attr("x", 5)
                .attr("y", -radialScale(value))
                .attr("text-anchor", "middle")
                .attr("fill", "#ddd")
                .style("font-size", "8px")
                .text(value.toString());
        });
        
        // Helper function to generate polygon points
        function generatePolygonPoints(values) {
            return values.map((value, i) => {
                const angle = angleScale(metrics[i]);
                const x = radialScale(value) * Math.sin(angle);
                const y = -radialScale(value) * Math.cos(angle);
                return [x, y];
            }).join(" ");
        }
        
        // Draw the polygons for each data series
        function drawPolygon(values, color, delay) {
            const points = values.map((value, i) => {
                const angle = angleScale(metrics[i]);
                return [
                    radialScale(value) * Math.sin(angle),
                    -radialScale(value) * Math.cos(angle)
                ];
            });
            
            // Draw dots at each data point
            points.forEach((point, i) => {
                setTimeout(() => {
                    g.append("circle")
                        .attr("cx", point[0])
                        .attr("cy", point[1])
                        .attr("r", 4)
                        .attr("fill", color)
                        .attr("opacity", 0)
                        .transition()
                        .duration(300)
                        .attr("opacity", 0.8);
                }, delay + i * 200);
            });
            
            // Create the polygon path with animation
            const lineFunction = d3.line();
            
            const path = g.append("path")
                .attr("d", lineFunction(points))
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 2)
                .attr("opacity", 0);
                
            path.transition()
                .delay(delay + 800)
                .duration(500)
                .attr("opacity", 0.6);
                
            // Add fill with animation
            g.append("polygon")
                .attr("points", points.map(p => p.join(",")).join(" "))
                .attr("fill", color)
                .attr("opacity", 0)
                .transition()
                .delay(delay + 1000)
                .duration(500)
                .attr("opacity", 0.2);
        }
        
        // Draw with delays for animation
        drawPolygon(textValues, "#10b981", 500);
        drawPolygon(tableValues, "#ef4444", 1500);
        drawPolygon(graphValues, "#f59e0b", 2500);
        
        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 100}, 20)`);
        
        const legendItems = [
            { label: "Texte", color: "#10b981" },
            { label: "Tableaux", color: "#ef4444" },
            { label: "Graphiques", color: "#f59e0b" }
        ];
        
        legendItems.forEach((item, i) => {
            const g = legend.append("g")
                .attr("transform", `translate(0, ${i * 20})`)
                .attr("opacity", 0)
                .transition()
                .delay(3500 + i * 200)
                .duration(300)
                .attr("opacity", 1);
            
            g.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", item.color);
            
            g.append("text")
                .attr("x", 15)
                .attr("y", 9)
                .attr("fill", "#ddd")
                .style("font-size", "10px")
                .text(item.label);
        });
        
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#ddd")
            .style("font-size", "14px")
            .text("Comparaison des métriques par type de structure");
    }
    
    // Pipeline flowchart
    function createPipelineFlowchart() {
        const container = document.getElementById('pipeline-flowchart');
        container.innerHTML = '';
        
        // Create SVG
        const svg = d3.select("#pipeline-flowchart")
            .append("svg")
            .attr("width", container.clientWidth)
            .attr("height", container.clientHeight);
        
        // Define the nodes
        const nodes = [
            { id: "input", label: "Documents multimodaux", x: 150, y: 30, class: "document" },
            { id: "extraction", label: "Extraction par type", x: 150, y: 70, class: "process" },
            { id: "text", label: "Texte", x: 80, y: 110, class: "text" },
            { id: "tables", label: "Tableaux", x: 150, y: 110, class: "table" },
            { id: "images", label: "Images", x: 220, y: 110, class: "image" },
            { id: "chunking", label: "Chunking sémantique", x: 80, y: 150, class: "text" },
            { id: "structure", label: "Préservation structure", x: 150, y: 150, class: "table" },
            { id: "captions", label: "Analyse légendes", x: 220, y: 150, class: "image" },
            { id: "textEmbed", label: "Embeddings texte", x: 80, y: 190, class: "text" },
            { id: "tableEmbed", label: "Embeddings tableaux", x: 150, y: 190, class: "table" },
            { id: "imageEmbed", label: "Embeddings images", x: 220, y: 190, class: "image" },
            { id: "vector", label: "Vectorisation adaptative", x: 150, y: 230, class: "process" },
            { id: "database", label: "Base vectorielle", x: 150, y: 270, class: "database" },
            { id: "rag", label: "Système RAG", x: 150, y: 310, class: "process" }
        ];
        
        // Define the links between nodes
        const links = [
            { source: "input", target: "extraction" },
            { source: "extraction", target: "text" },
            { source: "extraction", target: "tables" },
            { source: "extraction", target: "images" },
            { source: "text", target: "chunking" },
            { source: "tables", target: "structure" },
            { source: "images", target: "captions" },
            { source: "chunking", target: "textEmbed" },
            { source: "structure", target: "tableEmbed" },
            { source: "captions", target: "imageEmbed" },
            { source: "textEmbed", target: "vector" },
            { source: "tableEmbed", target: "vector" },
            { source: "imageEmbed", target: "vector" },
            { source: "vector", target: "database" },
            { source: "database", target: "rag" }
        ];
        
        // Node colors
        const nodeColors = {
            document: "#f97316",
            process: "#0ea5e9",
            text: "#0ea5e9",
            table: "#10b981",
            image: "#8b5cf6",
            database: "#3b82f6"
        };
        
        // Draw the links
        links.forEach((link, index) => {
            setTimeout(() => {
                const sourceNode = nodes.find(n => n.id === link.source);
                const targetNode = nodes.find(n => n.id === link.target);
                
                svg.append("line")
                    .attr("x1", sourceNode.x)
                    .attr("y1", sourceNode.y)
                    .attr("x2", sourceNode.x)
                    .attr("y2", sourceNode.y)
                    .attr("stroke", "#64748b")
                    .attr("stroke-width", 1.5)
                    .transition()
                    .duration(300)
                    .attr("x2", targetNode.x)
                    .attr("y2", targetNode.y);
            }, index * 100);
        });
        
        // Draw the nodes
        nodes.forEach((node, index) => {
            setTimeout(() => {
                const g = svg.append("g")
                    .attr("transform", `translate(${node.x}, ${node.y})`)
                    .attr("opacity", 0)
                    .transition()
                    .duration(300)
                    .attr("opacity", 1);
                
                g.append("rect")
                    .attr("x", -40)
                    .attr("y", -10)
                    .attr("width", 80)
                    .attr("height", 20)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("fill", nodeColors[node.class]);
                
                g.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .style("font-size", "8px")
                    .text(node.label);
            }, 1500 + index * 100);
        });
    }
    
    // Gain chart
    function createGainChart() {
        const container = document.getElementById('gain-chart');
        container.innerHTML = '';
        
        // Chart dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 20, bottom: 50, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Data for the chart
        const data = [
            { metric: "Pertinence", standard: 0.65, multimodal: 0.83, gain: 28 },
            { metric: "Précision tableau", standard: 0.23, multimodal: 0.61, gain: 165 },
            { metric: "Compréhension graph.", standard: 0.54, multimodal: 0.75, gain: 39 },
            { metric: "Performance glob.", standard: 0.47, multimodal: 0.73, gain: 55 }
        ];
        
        // Create SVG
        const svg = d3.select("#gain-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // Create a group for the chart content
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // X scale
        const x = d3.scaleBand()
            .domain(data.map(d => d.metric))
            .range([0, innerWidth])
            .padding(0.3);
        
        // Y scale
        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        // Add X axis
        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "10px")
            .attr("transform", "rotate(-15)")
            .attr("text-anchor", "end");
        
        // Add Y axis
        g.append("g")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d3.format(".1f")))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "10px");
        
        // Add grid lines
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-innerWidth)
                .tickFormat(""))
            .selectAll("line")
            .attr("stroke", "rgba(255, 255, 255, 0.1)");
        
        // Draw standard bars
        g.selectAll(".standard-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "standard-bar")
            .attr("x", d => x(d.metric))
            .attr("y", innerHeight)
            .attr("width", x.bandwidth() / 2)
            .attr("height", 0)
            .attr("fill", "#64748b")
            .transition()
            .duration(800)
            .attr("y", d => y(d.standard))
            .attr("height", d => innerHeight - y(d.standard));
        
        // Draw multimodal bars
        g.selectAll(".multimodal-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "multimodal-bar")
            .attr("x", d => x(d.metric) + x.bandwidth() / 2)
            .attr("y", innerHeight)
            .attr("width", x.bandwidth() / 2)
            .attr("height", 0)
            .attr("fill", "#10b981")
            .transition()
            .duration(800)
            .delay(400)
            .attr("y", d => y(d.multimodal))
            .attr("height", d => innerHeight - y(d.multimodal));
        
        // Add gain percentage labels
        g.selectAll(".gain-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "gain-label")
            .attr("x", d => x(d.metric) + x.bandwidth() / 2)
            .attr("y", d => y(d.multimodal) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "#10b981")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .text(d => `+${d.gain}%`)
            .transition()
            .duration(500)
            .delay(1200)
            .style("opacity", 1);
        
        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width/2 - 100}, ${height - margin.bottom + 30})`);
        
        const legendItems = [
            { label: "Standard", color: "#64748b" },
            { label: "Multimodal", color: "#10b981" }
        ];
        
        legendItems.forEach((item, i) => {
            const g = legend.append("g")
                .attr("transform", `translate(${i * 120}, 0)`)
                .attr("opacity", 0)
                .transition()
                .delay(1500)
                .duration(300)
                .attr("opacity", 1);
            
            g.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", item.color);
            
            g.append("text")
                .attr("x", 20)
                .attr("y", 10)
                .attr("fill", "#ddd")
                .style("font-size", "12px")
                .text(item.label);
        });
        
        // Add title
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#ddd")
            .style("font-size", "14px")
            .text("Amélioration des performances avec l'approche multimodale");
    }
});