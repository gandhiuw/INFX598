/**
 * Created by aditya on 2/25/16.
 */

var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var i = 0;

var treeData = [
                    {
                        "name": "Top Level",
                        "parent": "null",
                        "children": [
                            {
                                "name": "Level 2: A",
                                "parent": "Top Level",
                                "children": [
                                    {
                                        "name": "Son of A",
                                        "parent": "Level 2: A"
                                    },
                                    {
                                        "name": "Daughter of A",
                                        "parent": "Level 2: A"
                                    }
                                ]
                            },
                            {
                                "name": "Level 2: B",
                                "parent": "Top Level"
                            }
                        ]
                    }
                ];
//We use the tree layout
var tree = d3.layout.tree()
            .size([height, width]);


//The next block of code declares the function that will be used to draw the links between the
//nodes.
var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });
//The diagonal function to help draw a path between two points such that the line exhibits some nice flowing curves



var svg = d3.select("body").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

root = treeData[0];

//Changing this to
//root = treeData[0].children[0];
//This will take the root point for our diagram as being the first child (child[0]) of the the first
//level of treeData
update(root);//This calls the function update and uses the data root to create our tree.

function update(source) {
// Compute the new tree layout.
    //This uses our previously declared tree function to work its d3.js magic on our data (root) and
    //to determine the node details and from the node details we can determine the link details.
    var nodes = tree.nodes(root)//.reverse();
    //This produces which is a set of nodes, each of which has a set of characteristics.
    // Those characteristics are; - .
    // children: an array of any children
    // depth: depth (described in a few paragraphs time).
    // id: unique number identifier for each node.
    // name: name we have assigned from our data.
    // parent: The name of the parent of the node.
    // x,y: Which are the x and y positions on the screen of the node.

    var links = tree.links(nodes);
    //From this node data a set of links joining the nodes is created.
    // //Each link consists of a source and target.These are nodes



    // We then determine the horizontal spacing of the nodes.
    nodes.forEach(function (d) {d.y = d.depth * 180;});
    //This uses the depth of the node (as determined for each node in the nodes
    //to calculate the position on the y axis of the screen.
    //The depth refers to the position in the tree relative to the root node on the left.
    //These are integers. 1 to indicate they are direct children of the root, 2 indicates that they are
    //grandchildren


    // Using the tree layout,we previously generated an array of node objects
    //We now use these node objects as data to generate circles that represent the nodes
    console.log(nodes)
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) {return d.id || (d.id = ++i);});
    // use the selection above to add the tree.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {return "translate(" + d.y + "," + d.x + ")";});
    //appends the circle that comprises the node (using nodeEnter).
    nodeEnter.append("circle")
                .attr("r", 10)
                .style("fill", "#fff");

    //we add in the text for each node…
    //piece of code that allows the text to be placed on the left side of the node if it has
    // children
    //or on the right if it has has no children
    nodeEnter.append("text")
        .attr("x", function(d) {return d.children || d._children ? -13 : 13; })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {return d.children || d.children ? "end" : "start"; })
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);


    //we declare the link variable / function and tell it to make a link based on all the links that
    //have unique target id’s.
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
    //This might not be obvious at first glance, but we only want to draw links between a node and it’s
    //parent.
    //There should be one less link than the total number of nodes since the root node (‘Top
    //Level’) has no parent.
    //herefore only those links with unique target id’s in the data need to have links produced.


    //Our final block of JavaScript adds in our link as a diagonal path
    // Enter the links.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);
}