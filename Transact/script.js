
onload = function () {
    // create a network
    let curr_data;
    const container = document.getElementById('mynetwork');
    const container2 = document.getElementById('mynetwork2');
    const genNew = document.getElementById('generate-graph');
    const solve = document.getElementById('solve');
    const temptext = document.getElementById('temptext');
    // initialise graph options
    const options = {
        edges: {
            arrows: {
                to: true
            },
            labelHighlightBold: false,
            font: {
                color: 'white',
                size: 16,
            }
        },
        nodes: {
            font: '12px arial yellow',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf183',
                size: 50,
                color: '#991133',
            }
        }
    };
    // initialize network!
    let network = new vis.Network(container);
    network.setOptions(options);
    let network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        const num_per = Math.floor(Math.random() * 8) + 4;

        // Adding people to nodes array
        let nodes = [];
        for(let i=1;i<=num_per;i++){ 
            nodes.push({id:i, label:"Person "+i})
        }
        nodes = new vis.DataSet(nodes);

        // Dynamically creating edges with random amount to be paid from one to another friend
        const edges = [];
        for(let i=1;i<=num_per;i++){
            for(let j=i+1;j<=num_per;j++){
                // Modifies the amount of edges added in the graph
                if(Math.random() > 0.5){
                    // Controls the direction of cash flow on edge
                    if(Math.random() > 0.5)
                        edges.push({from: i, to: j, label: String(Math.floor(Math.random()*100)+1)});
                    else
                        edges.push({from: j, to: i, label: String(Math.floor(Math.random()*100)+1)});
                }
            }
        }
        const data = {
            nodes: nodes,
            edges: edges
        };
        return data;
    }

    genNew.onclick = function () {
        const data = createData();
        curr_data = data;
        network.setData(data);
        temptext.style.display = "inline";
        container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext.style.display  = "none";
        container2.style.display = "inline";
        const solvedData = solveData();
        network2.setData(solvedData);
    };

    function solveData() {
        let data = curr_data;
        const num_per = data['nodes'].length;
        const vals = Array(num_per).fill(0);
        // Calculating net balance of each person
        for(let i=0;i<data['edges'].length;i++) {
            const edge = data['edges'][i];
            vals[edge['to'] - 1] += parseInt(edge['label']);
            vals[edge['from'] - 1] -= parseInt(edge['label']);
        }

        const pos_heap = new SortedSet();
        const neg_heap = new SortedSet();

        for(let i=0;i<num_per;i++){
            if(vals[i]>0){
                pos_heap.push([vals[i],i]);
            } else{
                neg_heap.push(([-vals[i],i]));
                vals[i] *= -1;
            }
        }

        const new_edges = [];
        while(pos_heap.length>0 && neg_heap.length>0){
            const mx = pos_heap.pop();
            const mn = neg_heap.pop();

            const amt = Math.min(mx[0],mn[0]);
            const to = mx[1];
            const from = mn[1];

            new_edges.push({from: from+1, to: to+1, label: String(Math.abs(amt))});
            vals[to] -= amt;
            vals[from] -= amt;

            if(mx[0] > mn[0]){
                pos_heap.push([vals[to],to]);
            } else if(mx[0] < mn[0]){
                neg_heap.push([vals[from],from]);
            }
        }

        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    genNew.click();

};