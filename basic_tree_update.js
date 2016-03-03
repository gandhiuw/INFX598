/**
 * Created by aditya on 2/25/16.
 */

var margin = {top: 20, right: 120, bottom: 20, left: 120};
var width = 960 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;

var nodeRadius=20;



var globalRoot={};
var globalNodeArray=[];

//Remaining Nodes section
var remainingNodesSpacing=60
var remainingNodesYPosition=350;

var i = 0;
var treeData = [
                    {
                        "name": "BC",
                        "parent": "null",
                        "frequency":32,
                        "children": [
                            {
                                "name": "B",
                                "parent": "Top Level",
                                "frequency":18
                            },
                            {
                                "name": "C",
                                "parent": "Top Level",
                                "frequency":14
                            }
                        ]
                    }
                ];
//We use the tree layout
var tree = d3.layout.cluster()
            .size([height, width]);


//The next block of code declares the function that will be used to draw the links between the nodes.

//d3.svg.diagonal(): Constructs a new diagonal generator with the default accessor functions
//The diagonal function to help draw a path between two points such that the line exhibits some nice flowing curves
var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });
//The projection converts a point (such as that returned by the source and target accessors) of the form {x, y} to a two-element array of numbers.
//The projection is invoked in a similar manner as other value functions in D3.
//The function is passed two arguments, the current source or target point (derived from the current data, d) and the current index (i).

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
//update(root);//This calls the function update and uses the data root to create our tree.

huffman("Minize")
function huffman(string)
{
    var charArray=computeCharacterFrequency(string);
    initialDisplay(charArray);
    //Now let's start building the tree
    var newNode=setupTree(charArray[0].name,charArray[0].frequency,charArray[1].name,charArray[1].frequency);
    update(globalRoot);
    charArray.splice(0, 2);
    charArray.push(newNode);
    sortRemainingNodesAndReDisplay(charArray);

    newNode=addNewRootNode(charArray[0].name,charArray[0].frequency,globalRoot);//addNewRootNode(name,frequency,oldRoot);
    update(globalRoot);
    charArray.splice(0, 1);
    charArray.push(newNode);
    sortRemainingNodesAndReDisplay(charArray);

}




function update(source) {
// Compute the new tree layout.
    //This uses our previously declared tree function to work its d3.js magic on our data (root) and
    //to determine the node details and from the node details we can determine the link details.
    var nodes = tree.nodes(source).reverse();
    //This produces which is a set of nodes, each of which has a set of characteristics.
    // Those characteristics are; - .
    // children: an array of any children
    // depth: depth (described in a few paragraphs time).
    // id: unique number identifier for each node.
    // name: name we have assigned from our data.
    // parent: The name of the parent of the node.
    // x,y: Which are the x and y positions on the screen of the node.

    var links = tree.links(nodes);
    //console.log(links)
    //From this node data a set of links joining the nodes is created.
    // //Each link consists of a source and target.These are nodes



    // We then determine the horizontal spacing of the nodes.
    nodes.forEach(function (d) {d.y = d.depth * 90;});
    //This uses the depth of the node (as determined for each node in the nodes
    //to calculate the position on the y axis of the screen.
    //The depth refers to the position in the tree relative to the root node on the left.
    //These are integers. 1 to indicate they are direct children of the root, 2 indicates that they are
    //grandchildren


    // Using the tree layout,we previously generated an array of node objects
    //We now use these node objects as data to generate circles that represent the nodes

    var node = svg.selectAll("g.node")
        .data(nodes, function (d) {return d.id || (d.id = ++i);});


    // use the selection above to add the tree.
    var nodeUpdate=node.attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";});
    var nodeEnter = node.enter().append("g")
                        .attr("class", "node")
                        .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";});
    node.exit().remove();
    //appends the circle that comprises the node (using nodeEnter).
    nodeEnter.append("circle")
                .attr("r", nodeRadius)
                .style("fill", "#fff");

    //we add in the text for each node…
    //piece of code that allows the text to be placed on the left side of the node if it has
    // children or on the right if it has has no children

    //The text-anchor attribute is used to align (start-, middle- or end-alignment)
    //a string of text relative to a given point.
    nodeUpdate.attr("y", function(d) {return d.children || d.children ? -18 : 18; })
              .attr("dy", ".35em");

    nodeEnter.append("text")
        .attr("y", function(d) {return d.children || d.children ? -18 : 18; })
        //x and y are absolute coordinates and dx and dy are relative coordinates (relative to the specified x and y).
        .attr("dy", ".35em")// "em" units are relative to the font size
        // The anchor position of the text element is controlled using the x and y attributes;
        // additionally, the text can be offset from the anchor using dx and dy attributes.
        .attr("text-anchor", "middle")
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
    //Therefore only those links with unique target id’s in the data need to have links produced.


    //Our final block of JavaScript adds in our link as a diagonal path
    // Enter the links.
    link//.transition()
        .attr("d", diagonal);
    link.enter()
        //.transition()
        .insert("path", "g")
        .attr("class", "link")
        .attr("d", diagonal);
    link.exit().remove();
}
function updateTree() {
    var updatedTree=addNewRootNode("A",22,treeData[0])
    console.log(updatedTree);
    update(updatedTree);

}

//Test function
//initialDisplay(computeCharacterFrequency("Hello"));

//Initial display for remaining Nodes Display section
function initialDisplay(nodeArray)
{
    var svg=d3.select("svg");
    var g=svg.append("g").attr("id","nodeDisplay")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var gCircles=g.selectAll("g.remainingNodes")
        .data(nodeArray,function(d,i){return d.name;})
        .enter()
        .append("g")
        .attr("class","remainingNodes")
        .attr("transform",function(d,i){ return "translate(" +remainingNodesSpacing*i + "," + remainingNodesYPosition + ")"});

    gCircles.append("circle")
        .attr("r", nodeRadius)
        .style("fill", "#fff")
        .attr("stroke","black");

    gCircles.append("text")
        .attr("dy", "2.1em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    gCircles.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(function(d) { return d.frequency; })
        .style("fill-opacity", 1);
}



//Test function
//arr=computeCharacterFrequency("Hello")
//arr.push({"name":"Z","frequency":7});
//sortRemainingNodesAndReDisplay(arr);

//Sort and redisplay the nodes
function sortRemainingNodesAndReDisplay(nodeArray)
{
    nodeArray=_.sortBy(nodeArray,function(d){return d.frequency});
    globalNodeArray=nodeArray;
    var nodeDisplayG=d3.select("#nodeDisplay")
    var gCircles=nodeDisplayG.selectAll("g.remainingNodes")
        .data(nodeArray,function(d,i){return d.name;})

    //update
    gCircles
        .transition()
        .attr("transform",function(d,i){ return "translate(" +remainingNodesSpacing*i + "," + remainingNodesYPosition + ")"});

    //Exit
    gCircles.exit().remove();

    //Enter
    var gCirclesEnter=gCircles.enter()
        .append("g")
        .attr("class","remainingNodes")
        .attr("transform",function(d,i){ return "translate(" +remainingNodesSpacing*i + "," + remainingNodesYPosition + ")"});

    gCirclesEnter.append("circle")
        .transition()
        .attr("r", nodeRadius)
        .style("fill", "#fff")
        .attr("stroke","black");

    gCirclesEnter.append("text")
        .transition()
        .attr("dy", "2.1em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);

    gCirclesEnter.append("text")
        .transition()
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .text(function(d) { return d.frequency; })
        .style("fill-opacity", 1);
}



//This method will return an array of objects where each will contain the charcter and it's associated frequency
//in the sentence passed as an argument
//computeCharacterFrequency("Hello");
function computeCharacterFrequency(subjectString)
{

    subjectString=subjectString.toUpperCase()
    var charCount={}
    var charCountArray=[];
    var charArray=subjectString.split('')
    for(var i=0;i<charArray.length;i++)
    {
        if(charCount[charArray[i]])
        {charCount[charArray[i]]=charCount[charArray[i]]+1}
        else{charCount[charArray[i]]=1}
    }
    var characters=Object.keys(charCount)
    for(var i=0;i<characters.length;i++)
    {
        charCountArray.push({"name":characters[i],"frequency":charCount[characters[i]]})
    }
    charCountArray=_.sortBy(charCountArray,function(d){return d.frequency});
    return charCountArray
}


//Use this function to start building the Huffman Tree
function setupTree(node1Name,node1frequency1,node2Name,node2Frequency)
{
    var newRootName=node1Name+node2Name;

    var newNode1={};
    newNode1["name"]=node1Name;
    newNode1["frequency"]=node1frequency1;
    newNode1["parent"]=newRootName;

    var newNode2={};
    newNode2["name"]=node2Name;
    newNode2["frequency"]=node2Frequency;
    newNode2["parent"]=newRootName;

    var newRoot={};
    newRoot["name"]=newRootName;
    newRoot["frequency"]=newNode1["frequency"]+newNode2["frequency"];
    newRoot["children"]=[]
    newRoot["children"].push(newNode1)
    newRoot["children"].push(newNode2)
    globalRoot=newRoot;

    return {name:newRoot["name"],frequency:newRoot["frequency"]};
}


//This method will accept values of a new node to be inserted in tree
//A new root based on the values of the existing root node and this new node will be computed
function addNewRootNode(name,frequency,oldRoot)
{
    var newNode={};
    newNode["name"]=name;
    newNode["frequency"]=frequency;

    var newRoot={};
    newRoot["name"]=oldRoot["name"]+newNode["name"];
    newRoot["frequency"]=oldRoot["frequency"]+newNode["frequency"];
    newRoot["children"]=[]
    newRoot["children"].push(newNode)
    newRoot["children"].push(oldRoot)
    globalRoot=newRoot;

    return {"name":newRoot["name"],"frequency":newRoot["frequency"]};
}

