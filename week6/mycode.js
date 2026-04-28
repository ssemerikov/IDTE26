let activeNodes = {};

AFRAME.registerComponent('marker-node', {
    init: function () {
        this.el.addEventListener('markerFound', () => { 
            activeNodes[this.el.id] = this.el; 
        });
        this.el.addEventListener('markerLost', () => { 
            delete activeNodes[this.el.id]; 
        });
    }
});

AFRAME.registerComponent('polygon-solver', {
    init: function() {
        // Select or create 2D stats panel
        this.statsPanel = document.querySelector('#stats');
        if (!this.statsPanel) {
            this.statsPanel = document.createElement('div');
            this.statsPanel.id = 'stats';
            this.statsPanel.style.position = 'absolute';
            this.statsPanel.style.top = '10px';
            this.statsPanel.style.left = '10px';
            this.statsPanel.style.color = 'white';
            this.statsPanel.style.backgroundColor = 'rgba(0,0,0,0.6)';
            this.statsPanel.style.padding = '10px';
            this.statsPanel.style.fontFamily = 'sans-serif';
            this.statsPanel.style.zIndex = '1000';
            this.statsPanel.style.pointerEvents = 'none';
            document.body.appendChild(this.statsPanel);
        }

        this.linePool = [];
        this.textPool = [];
        
        // Reusable vectors for performance
        this.p1 = new THREE.Vector3();
        this.p2 = new THREE.Vector3();
        this.p3 = new THREE.Vector3();
        this.p4 = new THREE.Vector3();
        this.v1 = new THREE.Vector3();
        this.v2 = new THREE.Vector3();
        this.cross = new THREE.Vector3();
        this.centroid = new THREE.Vector3();
        
        // Initialize pool of 15 lines and 10 texts
        for (let i = 0; i < 15; i++) {
            let line = document.createElement('a-entity');
            let cyl = document.createElement('a-cylinder');
            cyl.setAttribute('radius', '0.015');
            cyl.setAttribute('color', 'red');
            cyl.setAttribute('material', 'shader: flat');
            
            // Offset and rotate so it spans from 0 to 1 along Z axis
            cyl.object3D.position.set(0, 0, 0.5);
            cyl.object3D.rotation.x = Math.PI / 2;
            
            line.appendChild(cyl);
            line.setAttribute('visible', 'false');
            this.el.sceneEl.appendChild(line);
            this.linePool.push({wrapper: line, mesh: cyl});
        }

        for (let i = 0; i < 10; i++) {
            let txt = document.createElement('a-text');
            txt.setAttribute('align', 'center');
            txt.setAttribute('color', 'yellow');
            txt.setAttribute('scale', '0.5 0.5 0.5');
            // Support for Ukrainian characters using project assets
            txt.setAttribute('font', '../assets/times-msdf.json');
            txt.setAttribute('negate', 'false');
            txt.setAttribute('visible', 'false');
            this.el.sceneEl.appendChild(txt);
            this.textPool.push(txt);
        }
    },
    
    tick: function() {
        let ids = Object.keys(activeNodes).sort();
        let nodes = ids.map(id => activeNodes[id]);
        
        // Reset pool visibility
        this.linePool.forEach(l => l.wrapper.setAttribute('visible', 'false'));
        this.textPool.forEach(t => t.setAttribute('visible', 'false'));
        
        if (ids.length < 2) {
            if (this.statsPanel) this.statsPanel.innerHTML = "Потрібно принаймні 2 маркери";
            return;
        }

        let lineIdx = 0;
        let statsText = "<b>Активні маркери:</b> " + ids.join(', ') + "<br>";

        // 1. Draw all connecting lines (Full mesh)
        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                if (lineIdx >= this.linePool.length) break;
                this.drawConnector(nodes[i], nodes[j], this.linePool[lineIdx]);
                lineIdx++;
            }
        }

        // 2. Perimeter (specifically for A, B, C, D)
        if (ids.length === 4 && ids.includes('A') && ids.includes('B') && ids.includes('C') && ids.includes('D')) {
            activeNodes['A'].object3D.getWorldPosition(this.p1);
            activeNodes['B'].object3D.getWorldPosition(this.p2);
            activeNodes['C'].object3D.getWorldPosition(this.p3);
            activeNodes['D'].object3D.getWorldPosition(this.p4);
            let peri = this.p1.distanceTo(this.p2) + this.p2.distanceTo(this.p3) + 
                       this.p3.distanceTo(this.p4) + this.p4.distanceTo(this.p1);
            statsText += "<b>Периметр ABCD:</b> " + peri.toFixed(2) + " м<br>";
        }

        // 3. Triangle Areas
        if (ids.length >= 3) {
            let textIdx = 0;
            statsText += "<br><b>Площі трикутників:</b><br>";
            for (let i = 0; i < ids.length; i++) {
                for (let j = i + 1; j < ids.length; j++) {
                    for (let k = j + 1; k < ids.length; k++) {
                        if (textIdx >= this.textPool.length) break;
                        let area = this.calculateArea(nodes[i], nodes[j], nodes[k], this.textPool[textIdx]);
                        statsText += "- " + ids[i] + ids[j] + ids[k] + ": " + area.toFixed(4) + " м²<br>";
                        textIdx++;
                    }
                }
            }
        }

        if (this.statsPanel) this.statsPanel.innerHTML = statsText;
    },

    drawConnector: function(n1, n2, poolObj) {
        n1.object3D.getWorldPosition(this.p1);
        n2.object3D.getWorldPosition(this.p2);
        
        let dist = this.p1.distanceTo(this.p2);
        poolObj.wrapper.object3D.position.copy(this.p1);
        poolObj.wrapper.object3D.lookAt(this.p2);
        poolObj.mesh.object3D.scale.set(1, 1, dist);
        poolObj.wrapper.setAttribute('visible', 'true');
    },

    calculateArea: function(n1, n2, n3, textEl) {
        n1.object3D.getWorldPosition(this.p1);
        n2.object3D.getWorldPosition(this.p2);
        n3.object3D.getWorldPosition(this.p3);

        this.v1.subVectors(this.p2, this.p1);
        this.v2.subVectors(this.p3, this.p1);
        this.cross.crossVectors(this.v1, this.v2);
        let area = this.cross.length() * 0.5;

        // Position text at centroid
        this.centroid.copy(this.p1).add(this.p2).add(this.p3).divideScalar(3);
        textEl.object3D.position.copy(this.centroid);
        textEl.setAttribute('value', area.toFixed(2));
        textEl.setAttribute('visible', 'true');
        
        return area;
    }
});
