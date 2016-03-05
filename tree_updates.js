/**
 * Created by aditya on 3/4/16.
 */
///Test functions
//var node1={"name": "A","frequency":25}
//var node2={"name": "B", "frequency": 11}
//var newRootNode=createNewMainTree(node1,node2);
//regularVisualizationUpdate("mainTree");



function createNewMainTree(node1,node2)
{
    var newRootName=node1["name"]+node2["name"];

    node1["parent"]=newRootName;
    node2["parent"]=newRootName;
    node1["code"]=0;
    node2["code"]=1;

    var newRoot={};
    newRoot["name"]=newRootName;
    newRoot["frequency"]=node1["frequency"]+node2["frequency"];
    newRoot["children"]=[]
    newRoot["children"].push(node1)
    newRoot["children"].push(node2)

    treeMaster["mainTree"]={name:"mainTree",root:newRoot,aux:false,auxCount:0}

    var mainG=d3.select("body")
        .select("svg")
        .append("g")
        .attr("class","mainTree")
        .attr("transform", "translate(" +margin.left+ "," + margin.top + ")")

    mainG.append("g").attr("class","linkContainer");
    mainG.append("g").attr("class","nodeContainer");

    return {name:newRoot["name"],frequency:newRoot["frequency"],tree:"mainTree","unused":false,"aux":false,"main":true};
}


////Test functions
//var node1={"name": "C","frequency":25}
//var node2={"name": "D", "frequency": 11}
//createNewAuxiliaryTree(node1,node2);
//regularVisualizationUpdate("AuxTree1");
//
//var node3={"name": "E","frequency":55}
//var node4={"name": "F", "frequency": 31}
//createNewAuxiliaryTree(node3,node4);
//regularVisualizationUpdate("AuxTree2");



function createNewAuxiliaryTree(node1,node2)
{
    auxTreeCount=auxTreeCount+1;
    var newAuxTreeName="AuxTree"+auxTreeCount;
    var newAuxRootName=node1["name"]+node2["name"];


    node1["parent"]=newAuxRootName;
    node2["parent"]=newAuxRootName;
    node1["code"]=0;
    node2["code"]=1;


    var newRoot={};
    newRoot["name"]=newAuxRootName;
    newRoot["frequency"]=node1["frequency"]+node2["frequency"];
    newRoot["children"]=[]
    newRoot["children"].push(node1)
    newRoot["children"].push(node2)

    treeMaster[newAuxTreeName]={name:newAuxTreeName,root:newRoot,aux:true,auxCount:auxTreeCount}

    var mainG=d3.select("body")
        .select("svg")
        .append("g")
        .attr("class",newAuxTreeName)
        .attr("transform", "translate(" +(mainTreeWidth+(auxTreeWidth*(auxTreeCount-1))+margin.left) + "," + margin.top + ")");

    mainG.append("g").attr("class","linkContainer");
    mainG.append("g").attr("class","nodeContainer");
    return {"name":newRoot["name"],"frequency":newRoot["frequency"],"tree":newAuxTreeName,"unused":false,"aux":true,"main":false};
}


//Test Methods

//Merge two auxiliary trees
//treeFuse("AuxTree1","AuxTree2");
//regularVisualizationUpdate("AuxTree1")
//
////Merge an auxiliary and main tree
//treeFuse("mainTree","AuxTree1");
//regularVisualizationUpdate("mainTree")

//noAppendUpdate("AuxTree1");
function treeFuse(auxTreeName1, auxTreeName2)
{
    var masterTree={};
    var mergeTree={};

    if(treeMaster[auxTreeName1]["auxCount"]<treeMaster[auxTreeName2]["auxCount"]) {
        masterTree=treeMaster[auxTreeName1];
        mergeTree=treeMaster[auxTreeName2];
    }
    else {
        masterTree=treeMaster[auxTreeName2];
        mergeTree=treeMaster[auxTreeName1];
    }



    var masterRoot=masterTree["root"];
    var mergeRoot=mergeTree["root"];

    var newMergedTreeRootName=masterRoot["name"]+mergeRoot["name"];
    masterRoot["parent"]=newMergedTreeRootName;
    mergeRoot["parent"]=newMergedTreeRootName;
    masterRoot["code"]=0;
    mergeRoot["code"]=1;

    var newMergedTreeRoot={};
    newMergedTreeRoot["name"]=newMergedTreeRootName
    newMergedTreeRoot["frequency"]=masterRoot["frequency"]+mergeRoot["frequency"];
    newMergedTreeRoot["children"]=[]
    newMergedTreeRoot["children"].push(masterRoot);
    newMergedTreeRoot["children"].push(mergeRoot);

    //Replace the root of the master tree with this new node
    treeMaster[masterTree["name"]]["root"]=newMergedTreeRoot;

    elementTransfer(masterTree["name"],mergeTree["name"]);
    //Update visualization
    if(masterTree["name"]=="mainTree")
        {
            return {"name":newMergedTreeRoot["name"],"frequency":newMergedTreeRoot["frequency"],"tree":masterTree["name"],"unused":false,"aux":false,"main":true};
        }
    else
        {
            return {"name":newMergedTreeRoot["name"],"frequency":newMergedTreeRoot["frequency"],"tree":masterTree["name"],"unused":false,"aux":true,"main":false};
        }

    //Remove merged Tree
}




//var node5={"name": "Z", "frequency": 67}
//addNewRootNode(node5,"AuxTree2");
//regularVisualizationUpdate("AuxTree2");
//
//var node6={"name": "Y", "frequency": 15}
//addNewRootNode(node6,"mainTree");
//regularVisualizationUpdate("mainTree");


//This method will accept values of a new node to be inserted in tree
//A new root based on the values of the existing root node and this new node will be computed
function addNewRootNode(newNode,treeName)
{
    var currentTreeDetailObject=treeMaster[treeName];
    var currentTreeRoot=currentTreeDetailObject["root"];


    var newRootName=currentTreeRoot["name"]+newNode["name"];

    currentTreeRoot["parent"]=newRootName;
    newNode["parent"]=newRootName;
    newNode["code"]=0;
    currentTreeRoot["code"]=1;

    var newRoot={};
    newRoot["name"]=newRootName;
    newRoot["frequency"]=currentTreeRoot["frequency"]+newNode["frequency"];
    newRoot["children"]=[]
    newRoot["children"].push(newNode)
    newRoot["children"].push(currentTreeRoot)

    treeMaster[treeName]["root"]=newRoot;
    if(treeName=="mainTree")
        {
            return {"name":newRoot["name"],"frequency":newRoot["frequency"],"tree":treeName,"unused":false,"aux":false,"main":true};
        }
    else
        {
            return {"name":newRoot["name"],"frequency":newRoot["frequency"],"tree":treeName,"unused":false,"aux":true,"main":false};
        }

}
