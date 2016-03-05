/**
 * Created by aditya on 2/25/16.
 */





var margin = {top: 40, right: 120, bottom: 20, left: 120};
var width = 1200 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;

var nodeRadius=20;



var globalRoot={};
var treeMaster={}
var charArray=[];
var charArrayInitialLength=-1;

var auxTreeCount=0;
var mainTreeWidth=400;
var auxTreeWidth=200;


//Tree Layout functions
var tree = d3.layout.cluster()
            .size([height, width]);
var auxTree = d3.layout.cluster()
            .size([height/2, width]);
var masterTreeLayout={mainTree:tree,auxTree:auxTree}

var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.x, d.y]; });




//This method will return an array of objects where each will contain the charcter and it's associated frequency
//in the sentence passed as an argument
//computeCharacterFrequency("Hello");
function computeCharacterFrequency(subjectString)
    {
        //subjectString=subjectString.toUpperCase()
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
            charCountArray.push({"name":characters[i],"frequency":charCount[characters[i]],"tree":"none","unused":true,"aux":false,"main":false})
        }
        charCountArray=_.sortBy(charCountArray,function(d){return d.frequency});
        return charCountArray
    }







//huffmanInitialize("WASHINGTON")
function huffmanInitialize(string)
    {
        reset();
        d3.select("body").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)


        charArray=computeCharacterFrequency($(".subjectString").val());
        charArrayInitialLength=charArray.length;
        initialDisplay(charArray);

    }

function reset()
    {
        charArray=[];
        auxTreeCount=0;
        d3.selectAll("svg").remove();

    }


var iterationCall=0;
function huffmanNext()
    {
        if(charArray.length==charArrayInitialLength)
            {

                //Now let's start building the tree
                if(iterationCall==0)
                    {
                        highlightNodes(charArray[0],charArray[1]);
                        iterationCall=iterationCall+1;
                    }
                else if(iterationCall==1)
                    {
                        newNode=createNewMainTree(charArray[0],charArray[1])
                        regularVisualizationUpdate("mainTree");
                        iterationCall=iterationCall+1;
                    }
                else if(iterationCall==2)
                    {
                        updateRemainingNodesArrayAndRedisplay(charArray,newNode)
                        iterationCall=0
                    }
            }
        else if(charArray.length>0)
            {
                if(iterationCall==0)
                    {
                        huffmanIterate(iterationCall);
                        iterationCall=iterationCall+1;
                    }
                else if(iterationCall==1)
                    {
                        regularVisualizationUpdate(huffmanIterate(iterationCall))
                        iterationCall=iterationCall+1;
                    }
                else if(iterationCall==2)
                    {
                        huffmanIterate(iterationCall);
                        iterationCall=0;
                    }

            }
        else if(charArray.length==0)
            {
            //Display codes
            }
    }


function huffmanIterate(iterationCall)
{
    var element1=charArray[0];
    var element2=charArray[1];
    if(iterationCall==0)
    {
        highlightNodes(element1,element2);
    }
    else if(iterationCall==1)
    {
        if(charArray.length>0)
        {
            //unused-unused
            if(element1.unused && element2.unused)
            {
                var newNode= createNewAuxiliaryTree(element1,element2);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
            //unused-main
            else if((element1.unused && element2.main))
            {
                var newNode=addNewRootNode(element1,"mainTree");
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return "mainTree";
            }
            else if((element1.main && element2.unused))
            {
                var newNode=addNewRootNode(element2,"mainTree");
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return "mainTree";
            }
            //unused-aux
            else if((element1.unused && element2.aux))
            {
                var newNode= addNewRootNode(element1,element2["tree"]);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
            else if((element1.aux && element2.unused))
            {
                var newNode= addNewRootNode(element2,element1["tree"]);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
            //aux-main
            else if((element1.aux && element2.main))
            {

                var newNode=treeFuse("mainTree",element1["tree"]);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
            else if((element1.main && element2.aux))
            {
                var newNode=treeFuse("mainTree",element2["tree"]);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
            //aux-aux
            else if((element1.aux && element2.aux))
            {
                var newNode=treeFuse(element1["tree"],element2["tree"]);
                updateRemainingNodesArrayAndRedisplay(charArray,newNode);
                return newNode["tree"];
            }
        }
    }
    else if(iterationCall==2)
        {
            sortRemainingNodesAndReDisplay();
        }

}

function updateRemainingNodesArrayAndRedisplay(charArray,newNode)
    {
        charArray.splice(0, 2);
        if(charArray.length>0) {charArray.push(newNode);}
        redisplay();

    }

