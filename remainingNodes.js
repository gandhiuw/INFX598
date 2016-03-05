/**
 * Created by aditya on 3/3/16.
 */

var globalNodeArray=[];

//Remaining Nodes section
var remainingNodesSpacing=60
var remainingNodesYPosition=350;



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
        .attr("stroke","black")
        .attr("id",function(d,i){return d.name});

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
function sortRemainingNodesAndReDisplay()
{
    charArray=_.sortBy(charArray,function(d){return d.frequency});
    redisplay();
}

function redisplay()
    {
        var nodeDisplayG=d3.select("#nodeDisplay")
        var gCircles=nodeDisplayG.selectAll("g.remainingNodes")
            .data(charArray,function(d,i){return d.name;})

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
            .attr("stroke","black")
            .attr("id",function(d,i){return d.name});

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

function highlightNodes(node1,node2)
    {
        var nodeDisplayG=d3.select("#nodeDisplay");
        nodeDisplayG.select("#"+node1.name).style("fill","orange");
        nodeDisplayG.select("#"+node2.name).style("fill","orange");

    }
