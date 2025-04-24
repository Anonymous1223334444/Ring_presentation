document.addEventListener('DOMContentLoaded', function() {
    // Vérifier que D3.js est correctement chargé
    if (typeof d3 === 'undefined') {
        console.error("D3.js n'est pas chargé. Les graphiques ne seront pas affichés.");
        return;
    }

    // Attendre un peu plus longtemps pour s'assurer que impress.js est initialisé
    setTimeout(function() {
        try {
            initCharts();
        } catch (error) {
            console.error("Erreur lors de l'initialisation des graphiques:", error);
        }
    }, 1500);
    
    // Suivre les changements de diapositive pour réinitialiser les graphiques si nécessaire
    document.addEventListener('impress:stepenter', function(event) {
        const currentSlide = event.target;
        
        // Vérifier si la diapositive courante contient des graphiques et les réinitialiser
        if (currentSlide.querySelectorAll('.chart-container').length > 0) {
            try {
                initCharts();
            } catch (error) {
                console.error("Erreur lors de la réinitialisation des graphiques:", error);
            }
        }
    });
    
    // Initialiser tous les graphiques en fonction de leurs identifiants de conteneur
    function initCharts() {
        // Graphique des résultats
        if (document.getElementById('results-chart')) {
            try {
                createResultsBarChart();
            } catch (error) {
                console.error("Erreur lors de la création du graphique des résultats:", error);
            }
        }
        
        // Graphique de flux d'évaluation
        if (document.getElementById('evaluation-flow-chart')) {
            try {
                createEvaluationFlowChart();
            } catch (error) {
                console.error("Erreur lors de la création du graphique de flux d'évaluation:", error);
            }
        }
        
        // Graphique radar des métriques
        if (document.getElementById('metrics-radar-chart')) {
            try {
                createMetricsRadarChart();
            } catch (error) {
                console.error("Erreur lors de la création du graphique radar des métriques:", error);
            }
        }
        
        // Diagramme de flux du pipeline
        if (document.getElementById('pipeline-flowchart')) {
            try {
                createPipelineFlowchart();
            } catch (error) {
                console.error("Erreur lors de la création du diagramme de flux du pipeline:", error);
            }
        }
        
        // Graphique de gain
        if (document.getElementById('gain-chart')) {
            try {
                createGainChart();
            } catch (error) {
                console.error("Erreur lors de la création du graphique de gain:", error);
            }
        }
    }
    
    // Graphique à barres des résultats - montre les performances comparatives
    function createResultsBarChart() {
        const container = document.getElementById('results-chart');
        if (!container) return;
        
        // Effacer le graphique précédent s'il y en a un
        container.innerHTML = '';
        
        // Dimensions du graphique
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 20, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Données pour le graphique
        const data = [
            { category: "Texte", value: 0.702, color: "#10b981" },
            { category: "Tableaux", value: 0.456, color: "#ef4444" },
            { category: "Graphiques", value: 0.540, color: "#f59e0b" }
        ];
        
        // Créer SVG
        const svg = d3.select("#results-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // Créer un groupe pour le contenu du graphique
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // Échelle X
        const x = d3.scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerWidth])
            .padding(0.4);
        
        // Échelle Y
        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        // Ajouter l'axe X
        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "14px");
        
        // Ajouter l'axe Y
        g.append("g")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d3.format(".1f")))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "14px");
        
        // Ajouter des lignes de grille
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-innerWidth)
                .tickFormat(""))
            .selectAll("line")
            .attr("stroke", "rgba(255, 255, 255, 0.1)");
        
        // Créer des barres - animées
        const bars = g.selectAll(".bar")
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
            .attr("ry", 5);
            
        bars.transition()
            .duration(1000)
            .delay((d, i) => i * 200)
            .attr("y", d => y(d.value))
            .attr("height", d => innerHeight - y(d.value));
        
        // Ajouter des valeurs au-dessus des barres
        const valueTexts = g.selectAll(".value")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "value")
            .attr("x", d => x(d.category) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .text(d => (d.value * 100).toFixed(1) + "%");
            
        valueTexts.transition()
            .duration(1000)
            .delay((d, i) => 200 + i * 200)
            .style("opacity", 1);
        
        // Ajouter un titre
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#ddd")
            .style("font-size", "18px")
            .text("Performance par type de structure");
    }

    // Graphique de flux d'évaluation - diagramme de flux simplifié
    function createEvaluationFlowChart() {
        const container = document.getElementById('evaluation-flow-chart');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Structure de données pour le diagramme de flux
        const nodes = [
            { id: "question", label: "Question", x: 100, y: 40, class: "question" },
            { id: "retriever", label: "Recherche", x: 100, y: 100, class: "process" },
            { id: "documents", label: "Documents", x: 100, y: 160, class: "data" },
            { id: "generation", label: "Génération", x: 100, y: 220, class: "process" },
            { id: "answer", label: "Réponse", x: 100, y: 280, class: "result" }
        ];
        
        const links = [
            { source: "question", target: "retriever" },
            { source: "retriever", target: "documents" },
            { source: "documents", target: "generation" },
            { source: "generation", target: "answer" }
        ];
        
        // Créer SVG
        const svg = d3.select("#evaluation-flow-chart")
            .append("svg")
            .attr("width", container.clientWidth)
            .attr("height", container.clientHeight);
        
        // Définir les couleurs des nœuds
        const nodeColors = {
            question: "#f97316",
            process: "#8b5cf6",
            data: "#10b981",
            result: "#3b82f6"
        };
        
        // Dessiner les liens
        links.forEach((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            
            if (!sourceNode || !targetNode) return;
            
            const lineElement = svg.append("line")
                .attr("x1", sourceNode.x)
                .attr("y1", sourceNode.y)
                .attr("x2", sourceNode.x)
                .attr("y2", sourceNode.y)
                .attr("stroke", "#64748b")
                .attr("stroke-width", 2);
            
            setTimeout(() => {
                lineElement.transition()
                    .duration(500)
                    .attr("x2", targetNode.x)
                    .attr("y2", targetNode.y);
            }, index * 200);
        });
        
        // Dessiner les nœuds
        nodes.forEach((node, index) => {
            setTimeout(() => {
                // Créer un groupe pour le nœud courant
                const nodeGroup = svg.append("g")
                    .attr("transform", `translate(${node.x}, ${node.y})`)
                    .attr("opacity", 0);
                
                // Ajouter un cercle
                nodeGroup.append("circle")
                    .attr("r", 0)
                    .attr("fill", nodeColors[node.class]);
                
                // Ajouter du texte
                nodeGroup.append("text")
                    .attr("x", 30)
                    .attr("y", 5)
                    .attr("fill", "#ddd")
                    .style("font-size", "16px")
                    .text(node.label);
                
                // Animer l'apparition
                nodeGroup.transition()
                    .duration(300)
                    .attr("opacity", 1);
                
                nodeGroup.select("circle")
                    .transition()
                    .duration(500)
                    .attr("r", 20);
            }, 1000 + index * 150);
        });
    }
    
    // Graphique radar des métriques
    function createMetricsRadarChart() {
        const container = document.getElementById('metrics-radar-chart');
        if (!container) return;
        
        container.innerHTML = '';
        
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        
        // Données simplifiées pour meilleure lisibilité
        const metrics = ["BLEU", "ROUGE", "Relevance"];
        const textValues = [0.473, 0.752, 0.830];
        const tableValues = [0.433, 0.574, 0.750];
        const graphValues = [0.403, 0.585, 0.774];
        
        // Configuration SVG
        const svg = d3.select("#metrics-radar-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        const g = svg.append("g")
            .attr("transform", `translate(${width/2}, ${height/2})`);
        
        // Échelles
        const radialScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, Math.min(width, height)/2 - margin.top]);
        
        const angleScale = d3.scalePoint()
            .domain(metrics)
            .range([0, 2 * Math.PI])
            .padding(0.5);
        
        // Dessiner les lignes d'axe
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
            
            // Ajouter une étiquette de métrique
            g.append("text")
                .attr("x", lineX * 1.1)
                .attr("y", lineY * 1.1)
                .attr("text-anchor", "middle")
                .attr("fill", "#ddd")
                .style("font-size", "16px")
                .text(metric);
        });
        
        // Dessiner des cercles pour l'échelle
        [0.25, 0.5, 0.75, 1].forEach(value => {
            g.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", radialScale(value))
                .attr("fill", "none")
                .attr("stroke", "rgba(255, 255, 255, 0.1)")
                .attr("stroke-width", 1);
            
            // Ajouter une étiquette pour l'échelle
            g.append("text")
                .attr("x", 5)
                .attr("y", -radialScale(value))
                .attr("text-anchor", "middle")
                .attr("fill", "#ddd")
                .style("font-size", "12px")
                .text(value.toString());
        });
        
        // Fonction pour dessiner le polygone
        function drawPolygon(values, color, delay) {
            const points = values.map((value, i) => {
                const angle = angleScale(metrics[i]);
                return [
                    radialScale(value) * Math.sin(angle),
                    -radialScale(value) * Math.cos(angle)
                ];
            });
            
            // Conserver une référence au groupe D3
            const currentG = g;
            
            // Dessiner des points à chaque point de données
            points.forEach((point, i) => {
                setTimeout(() => {
                    // Utiliser la référence conservée
                    currentG.append("circle")
                        .attr("cx", point[0])
                        .attr("cy", point[1])
                        .attr("r", 6)
                        .attr("fill", color)
                        .attr("opacity", 0)
                        .transition()
                        .duration(300)
                        .attr("opacity", 0.8);
                }, delay + i * 200);
            });
            
            // Créer le chemin du polygone avec animation
            const lineFunction = d3.line();
            
            const path = currentG.append("path")
                .attr("d", lineFunction(points))
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 3)
                .attr("opacity", 0);
                
            setTimeout(() => {
                path.transition()
                    .duration(500)
                    .attr("opacity", 0.6);
            }, delay + 800);
            
            // Ajouter un remplissage avec animation
            const polygon = currentG.append("polygon")
                .attr("points", points.map(p => p.join(",")).join(" "))
                .attr("fill", color)
                .attr("opacity", 0);
                
            setTimeout(() => {
                polygon.transition()
                    .duration(500)
                    .attr("opacity", 0.2);
            }, delay + 1000);
        }
        
        // Dessiner avec des délais pour l'animation
        drawPolygon(textValues, "#10b981", 500);
        drawPolygon(tableValues, "#ef4444", 1500);
        drawPolygon(graphValues, "#f59e0b", 2500);
        
        // Ajouter une légende
        const legend = svg.append("g")
            .attr("transform", `translate(${width - 120}, 30)`);
        
        const legendItems = [
            { label: "Texte", color: "#10b981" },
            { label: "Tableaux", color: "#ef4444" },
            { label: "Graphiques", color: "#f59e0b" }
        ];
        
        legendItems.forEach((item, i) => {
            const legendGroup = legend.append("g")
                .attr("transform", `translate(0, ${i * 25})`)
                .attr("opacity", 0);
                
            legendGroup.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", item.color);
                
            legendGroup.append("text")
                .attr("x", 25)
                .attr("y", 12)
                .attr("fill", "#ddd")
                .style("font-size", "14px")
                .text(item.label);
                
            setTimeout(() => {
                legendGroup.transition()
                    .duration(300)
                    .attr("opacity", 1);
            }, 3500 + i * 200);
        });
    }
    
    // Diagramme de flux du pipeline
    function createPipelineFlowchart() {
        const container = document.getElementById('pipeline-flowchart');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Créer SVG
        const svg = d3.select("#pipeline-flowchart")
            .append("svg")
            .attr("width", container.clientWidth)
            .attr("height", container.clientHeight);
        
        // Définir les nœuds (simplifié pour lisibilité)
        const nodes = [
            { id: "input", label: "Documents", x: 150, y: 30, class: "document" },
            { id: "extraction", label: "Extraction", x: 150, y: 80, class: "process" },
            { id: "text", label: "Texte", x: 70, y: 130, class: "text" },
            { id: "tables", label: "Tableaux", x: 150, y: 130, class: "table" },
            { id: "images", label: "Images", x: 230, y: 130, class: "image" },
            { id: "embedding", label: "Embeddings", x: 150, y: 180, class: "process" },
            { id: "database", label: "Base vectorielle", x: 150, y: 230, class: "database" },
            { id: "rag", label: "Système RAG", x: 150, y: 280, class: "process" }
        ];
        
        // Définir les liens entre les nœuds
        const links = [
            { source: "input", target: "extraction" },
            { source: "extraction", target: "text" },
            { source: "extraction", target: "tables" },
            { source: "extraction", target: "images" },
            { source: "text", target: "embedding" },
            { source: "tables", target: "embedding" },
            { source: "images", target: "embedding" },
            { source: "embedding", target: "database" },
            { source: "database", target: "rag" }
        ];
        
        // Couleurs des nœuds
        const nodeColors = {
            document: "#f97316",
            process: "#0ea5e9",
            text: "#0ea5e9",
            table: "#10b981",
            image: "#8b5cf6",
            database: "#3b82f6"
        };
        
        // Dessiner les liens
        links.forEach((link, index) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            
            if (!sourceNode || !targetNode) return;
            
            const lineElement = svg.append("line")
                .attr("x1", sourceNode.x)
                .attr("y1", sourceNode.y)
                .attr("x2", sourceNode.x)
                .attr("y2", sourceNode.y)
                .attr("stroke", "#64748b")
                .attr("stroke-width", 2);
            
            setTimeout(() => {
                lineElement.transition()
                    .duration(300)
                    .attr("x2", targetNode.x)
                    .attr("y2", targetNode.y);
            }, index * 100);
        });
        
        // Dessiner les nœuds
        nodes.forEach((node, index) => {
            setTimeout(() => {
                // Créer un groupe pour le nœud courant
                const nodeGroup = svg.append("g")
                    .attr("transform", `translate(${node.x}, ${node.y})`)
                    .attr("opacity", 0);
                
                // Ajouter un rectangle
                nodeGroup.append("rect")
                    .attr("x", -50)
                    .attr("y", -15)
                    .attr("width", 100)
                    .attr("height", 30)
                    .attr("rx", 5)
                    .attr("ry", 5)
                    .attr("fill", nodeColors[node.class]);
                
                // Ajouter du texte
                nodeGroup.append("text")
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .style("font-size", "14px")
                    .text(node.label);
                
                // Animer l'apparition
                nodeGroup.transition()
                    .duration(300)
                    .attr("opacity", 1);
            }, 1000 + index * 100);
        });
    }
    
    // Graphique de gain (améliorations)
    function createGainChart() {
        const container = document.getElementById('gain-chart');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Dimensions du graphique
        const width = container.clientWidth;
        const height = container.clientHeight;
        const margin = { top: 40, right: 20, bottom: 50, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Données pour le graphique (simplifié)
        const data = [
            { metric: "Pertinence", standard: 0.65, multimodal: 0.83, gain: 28 },
            { metric: "Précision", standard: 0.23, multimodal: 0.61, gain: 165 },
            { metric: "Global", standard: 0.47, multimodal: 0.73, gain: 55 }
        ];
        
        // Créer SVG
        const svg = d3.select("#gain-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // Créer un groupe pour le contenu du graphique
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        // Échelle X
        const x = d3.scaleBand()
            .domain(data.map(d => d.metric))
            .range([0, innerWidth])
            .padding(0.3);
        
        // Échelle Y
        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        // Ajouter l'axe X
        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "14px");
        
        // Ajouter l'axe Y
        g.append("g")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickFormat(d3.format(".1f")))
            .selectAll("text")
            .attr("fill", "#ddd")
            .style("font-size", "14px");
        
        // Ajouter des lignes de grille
        g.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-innerWidth)
                .tickFormat(""))
            .selectAll("line")
            .attr("stroke", "rgba(255, 255, 255, 0.1)");
        
        // Dessiner les barres standard
        const standardBars = g.selectAll(".standard-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "standard-bar")
            .attr("x", d => x(d.metric))
            .attr("y", innerHeight)
            .attr("width", x.bandwidth() / 2)
            .attr("height", 0)
            .attr("fill", "#64748b");
            
        standardBars.transition()
            .duration(800)
            .attr("y", d => y(d.standard))
            .attr("height", d => innerHeight - y(d.standard));
        
        // Dessiner les barres multimodales
        const multimodalBars = g.selectAll(".multimodal-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "multimodal-bar")
            .attr("x", d => x(d.metric) + x.bandwidth() / 2)
            .attr("y", innerHeight)
            .attr("width", x.bandwidth() / 2)
            .attr("height", 0)
            .attr("fill", "#10b981");
            
        multimodalBars.transition()
            .duration(800)
            .delay(400)
            .attr("y", d => y(d.multimodal))
            .attr("height", d => innerHeight - y(d.multimodal));
        
        // Ajouter des étiquettes de pourcentage de gain
        const gainLabels = g.selectAll(".gain-label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "gain-label")
            .attr("x", d => x(d.metric) + x.bandwidth() / 2)
            .attr("y", d => y(d.multimodal) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "#10b981")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("opacity", 0)
            .text(d => `+${d.gain}%`);
            
        setTimeout(() => {
            gainLabels.transition()
                .duration(500)
                .style("opacity", 1);
        }, 1200);
        
        // Ajouter une légende
        const legend = svg.append("g")
            .attr("transform", `translate(${width/2 - 120}, ${height - margin.bottom + 30})`);
        
        const legendItems = [
            { label: "Standard", color: "#64748b" },
            { label: "Multimodal", color: "#10b981" }
        ];
        
        legendItems.forEach((item, i) => {
            const legendGroup = legend.append("g")
                .attr("transform", `translate(${i * 140}, 0)`)
                .attr("opacity", 0);
                
            legendGroup.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", item.color);
                
            legendGroup.append("text")
                .attr("x", 25)
                .attr("y", 12)
                .attr("fill", "#ddd")
                .style("font-size", "14px")
                .text(item.label);
                
            setTimeout(() => {
                legendGroup.transition()
                    .duration(300)
                    .attr("opacity", 1);
            }, 1500);
        });
        
        // Ajouter un titre
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .attr("fill", "#ddd")
            .style("font-size", "18px")
            .text("Amélioration avec l'approche multimodale");
    }
});