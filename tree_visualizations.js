/**
 * Created by aditya on 3/4/16.
 */


function regularVisualizationUpdate(treeName) {

    var treeDetails=treeMaster[treeName];
    var treeRoot=treeDetails["root"];
    var treeGElement=d3.select("."+treeName);

    var nodeContainer=treeGElement.select(".nodeContainer");
    var linkContainer=treeGElement.select(".linkContainer");

    var treeLayoutFunction={};
    if(treeDetails["aux"]){treeLayoutFunction=masterTreeLayout["auxTree"]} else {treeLayoutFunction=masterTreeLayout["mainTree"]}

    var nodes = treeLayoutFunction.nodes(treeRoot).reverse();
    var links = treeLayoutFunction.links(nodes);
    nodes.forEach(function (d) {d.y = d.depth * 90;});

    //****************************NODE UPDATE SECTION***************************************************

    var node = nodeContainer.selectAll("g.node")
        .data(nodes, function (d) {return d.name;});

    // use the selection above to add the tree.
    var nodeUpdate=node
        .transition()
        .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";});
    var nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")";});

    nodeEnter
        .append("circle")
        .on("mouseover", function(d,i) {
            d3.selectAll("circle."+d.name).style("fill","orange").style("opacity","0.5");
            d3.selectAll("text."+d.name).style("font-weight","bold");
            d3.selectAll("path."+d.name)
                .attr("stroke", "orange")
                .attr("stroke-width", "4px")

        })
        .on("mouseout", function(d,i) {
            d3.selectAll("circle."+d.name).style("fill","#fff").style("opacity","1.0");
            d3.selectAll("text."+d.name).style("font-weight","normal");

            d3.selectAll("path."+d.name)
                .attr("stroke", "green")
                .attr("stroke-width", "2px")
        })
        .transition()
        .attr("r", nodeRadius)
        .attr("class",function(d,i){return d.name.split("").join(" ");})

    //.style("fill", "#fff")

    //Exit
    node.exit().remove();

    //****************************NODE NAME LABEL UPDATE SECTION***************************************************

    nodeUpdate
        .attr("y", function(d) {return d.children || d.children ? -18 : 18; })
        .attr("dy", function(d) {return d.children || d.children ? "-.35em" : ".99em"; });

    nodeEnter.append("text")
        .attr("y", function(d) {return d.children || d.children ? -18 : 18; })
        .attr("dy", function(d) {return d.children || d.children ? "-.35em" : ".99em"; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .attr("class",function(d,i){return d.name})
        .style("fill-opacity", 1);

    //****************************NODE FREQUENCY LABEL UPDATE SECTION***************************************************

    nodeEnter.append("text")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.frequency; })
        .attr("class",function(d,i){return d.name})
        .style("fill-opacity", 1);


    //****************************LINK UPDATE SECTION***************************************************

    var linkGroups = linkContainer.selectAll(".link")
        .data(links,function(d) { return d.target.name; });



    var linkEnter=linkGroups
                    .enter()
                    .append("g")
                    .attr("class", "link");

    linkEnter
        .append("path")
        .attr("d", diagonal)
        .attr("class",function(d,i){return d.target.name.split("").join(" ");})

    //linkGroups
    linkGroups.selectAll("path").transition().attr("d", diagonal);
    linkGroups.exit().remove();

    //*********************************LINK LABEL********************************************************
    linkEnter.append("text")
        .transition()
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 12px Arial")
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.target.code;
        })
        .attr("class",function(d,i){return d.target.name.split("").join(" ");})

    linkGroups.selectAll("text")
        .attr("transform", function(d) {
            return "translate(" +
                ((d.source.x + d.target.x)/2) + "," +
                ((d.source.y + d.target.y)/2) + ")";
        })
        .attr("dy", "-.75em")


}

function elementTransfer(acquiringTreeName,mergeeTreeName)
    {
        //debugger;
        jQuery("."+mergeeTreeName+" .nodeContainer"+" .node").detach().appendTo("."+acquiringTreeName+" .nodeContainer");
        jQuery("."+mergeeTreeName+" .linkContainer"+" .link").detach().appendTo("."+acquiringTreeName+" .linkContainer");
    }