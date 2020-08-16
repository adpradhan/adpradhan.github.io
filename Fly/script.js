onload = function () {
    // create a network
    var curr_data;
    var num_cities;
    var container = document.getElementById('mynetwork');
    var container2 = document.getElementById('mynetwork2');
    var genNew = document.getElementById('generate-graph');
    var solve = document.getElementById('solve');
    var temptext = document.getElementById('temptext');
    var temptext2 = document.getElementById('temptext2');
    var source = document.getElementById('source');
    var destination = document.getElementById('destination');
    // initialise graph options
    var options = {
        edges: {
            labelHighlightBold: false,
            font: {
                color: 'white',
                size: 20,
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
                code: '\uf015',
                size: 40,
                color: '#991133',
            }
        }
    };
    // initialize your network!
    var network = new vis.Network(container);
    network.setOptions(options);
    var network2 = new vis.Network(container2);
    network2.setOptions(options);

    function createData(){
        num_cities = Math.floor(Math.random() * 14) + 7;
        cities = ['Delhi', 'Mumbai', 'Vadodra', 'Goa', 'Kanpur', 'Jammu', 'Hyderabad', 'Bangalore', 'Gangtok', 'Meghalaya', 'Kolkata', 'Ahmedabad', 'Chennai', 'Surat', 'Pune', 'Jaipur', 'Nagpur', 'Indore', 'Bhopal', 'Patna', 'Agra'];
        let nodes = [];
        for(let i=1;i<=num_cities;i++){
            nodes.push({id:i, label: cities[i-1]})
        }
        nodes = new vis.DataSet(nodes);

        let edges = [];
        for(let i=2;i<=num_cities;i++){
            let neigh = i - Math.floor(Math.random()*Math.min(i-1,3)+1);
            edges.push({type: 0, from: i, to: neigh, color: 'orange',label: String(Math.floor(Math.random()*70)+31)});
        }

        src = 1;
        dst = num_cities;

        for(let i=1;i<=10;){
            let n1 = Math.floor(Math.random()*num_cities)+1;
            let n2 = Math.floor(Math.random()*num_cities)+1;
            if(n1!=n2){
                if(n1<n2){
                    let tmp = n1;
                    n1 = n2;
                    n2 = tmp;
                }
                let works = 0;
                for(let j=0;j<edges.length;j++){
                    if(edges[j]['from']===n1 && edges[j]['to']===n2) {
                        if(edges[j]['type']===0)
                            works = 1;
                        else
                            works = 2;
                    }
                }

                if(works <= 1) {
                    if (works === 0 && i < num_cities / 4) {
                        edges.push({
                            type: 0,
                            from: n1,
                            to: n2,
                            color: 'orange',
                            label: String(Math.floor(Math.random() * 70) + 31)
                        });
                    } else {
                        edges.push({
                            type: 1,
                            from: n1,
                            to: n2,
                            color: 'green',
                            label: String(Math.floor(Math.random() * 30) + 20)
                        });
                    }
                    i++;
                }
            }
        }

        let data = {
            nodes: nodes,
            edges: edges
        };
        curr_data = data;
    }

    genNew.onclick = function () {
        location.reload();
    };

    solve.onclick = function () {
        temptext.style.display  = "none";
        temptext2.style.display  = "none";
        container2.style.display = "inline";
        src_name = String(source.value);
        dest_name = String(destination.value);

        var flag = 0;

        for(let i = 0; i < num_cities; i++)
        {
            if(src_name == cities[i])
            {    src = i+1;
                flag += 1;}
            if(dest_name == cities[i])
            {    dst = i+1;
                flag += 1;}
        }

        if(flag != 2)
        {
            alert("Please enter correct city details!");
            location.reload();
        }

        network2.setData(solveData(num_cities));
    };

    function dijkstra(graph, num_cities, src) {
        let vis = Array(num_cities).fill(0);
        let dist = [];
        for(let i=1;i<=num_cities;i++)
            dist.push([10000,-1]);
        dist[src][0] = 0;

        // for(let i=0;i<num_cities-1;i++){
        //     let mn = -1;
        //     for(let j=0;j<num_cities;j++){
        //         if(vis[j]===0){
        //             if(mn===-1 || dist[j][0]<dist[mn][0])
        //                 mn = j;
        //         }
        //     }

        //     vis[mn] = 1;
        //     for(let j in graph[mn]){
        //         let edge = graph[mn][j];
        //         if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
        //             dist[edge[0]][0] = dist[mn][0]+edge[1];
        //             dist[edge[0]][1] = mn;
        //         }
        //     }
        // }

        var st = new SortedSet();
        st.push([0, src]);

        while(st.length > 0)
        {
            let top = st.shift();
            let mn = top[1];

            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    if(dist[edge[0]][0] != 10000)
                        st.delete([dist[edge[0]][0], edge[0]]);
                    
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;

                    st.push([dist[edge[0]][0], edge[0]]);
                }
            }
        }

        return dist;
    }

    function solveData(num_cities) {
        let data = curr_data;
        let graph = [];
        for(let i=1;i<=num_cities;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            if(edge['type']===1)
                continue;
            graph[edge['to']-1].push([edge['from']-1,parseInt(edge['label'])]);
            graph[edge['from']-1].push([edge['to']-1,parseInt(edge['label'])]);
        }

        let dist1 = dijkstra(graph,num_cities,src-1);
        let dist2 = dijkstra(graph,num_cities,dst-1);

        let mn_dist = dist1[dst-1][0];

        let plane = 0;
        let p1=-1, p2=-1;
        for(let pos in data['edges']){
            let edge = data['edges'][pos];
            if(edge['type']===1){
                let to = edge['to']-1;
                let from = edge['from']-1;
                let wght = parseInt(edge['label']);
                if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
                    plane = wght;
                    p1 = to;
                    p2 = from;
                    mn_dist = dist1[to][0]+wght+dist2[from][0];
                }
                if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
                    plane = wght;
                    p2 = to;
                    p1 = from;
                    mn_dist = dist2[to][0]+wght+dist1[from][0];
                }
            }
        }

        new_edges = [];
        if(plane!==0){
            new_edges.push({arrows: { to: { enabled: true}}, from: p1+1, to: p2+1, color: 'green',label: String(plane)});
            new_edges.concat(pushEdges(dist1, p1, false));
            new_edges.concat(pushEdges(dist2, p2, true));
        } else{
            new_edges.concat(pushEdges(dist1, dst-1, false));
        }
        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    function pushEdges(dist, curr, reverse) {
        tmp_edges = [];
        while(dist[curr][0]!=0){
            let fm = dist[curr][1];
            if(reverse)
                new_edges.push({arrows: { to: { enabled: true}},from: curr+1, to: fm+1, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            else
                new_edges.push({arrows: { to: { enabled: true}},from: fm+1, to: curr+1, color: 'orange', label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return tmp_edges;
    }

    createData();
    network.setData(curr_data);
    //temptext2.innerText = 'Find least time path from '+cities[src-1]+' to '+cities[dst-1];
    temptext.style.display = "inline";
    temptext2.style.display = "inline";
    container2.style.display = "none";
    //genNew.click();
};