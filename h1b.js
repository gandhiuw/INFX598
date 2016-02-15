 var groups;
 var stateGroup;
 var employerGroup; 
 
 var margin = {top: 20, right: 20, bottom: 30, left: 50};
    var w = 960 - margin.left - margin.right;
    var h = 500 - margin.top - margin.bottom;

 var dataset=d3.csv("2010.csv",function(dataset){
	dataset.forEach(function(d) {
        d.employername = d.lca_case_employer_name;
        d.employerstate = d.lca_case_employer_state;
        d.salary = +d.lca_case_wage_rate_from;
     });
	//stateGroup = _.groupBy(dataset, "employerstate");
	function average (arr){
	return _.reduce(arr, function(memo, num)
	{
		return memo + num;
	}, 0) / arr.length;
	}
	
	stateGroup = _.chain(dataset)
		.groupBy("employerstate")
		.map(function(value, key){

			return {
				State: key,
				Salary: average(_.pluck(value, "salary")),
				Count: value.length
			}
		}) 
		.value();

 	console.log(stateGroup);

 	employerGroup = _.chain(dataset)
		.groupBy("employername")
		.map(function(value, key){
			
			return {
				Employer: key,
				Salary: average(_.pluck(value, "salary")),
				Count: value.length
			}
		}) 
		.value();

 	console.log(stateGroup);
	});


 
 //var employerGroup=


 function updateGroupingCriteria(criteria){
	groups= _.groupBy(dataset,$("#selectedGroup").val());
     var groupArray=[];
     var objectKeys=Object.keys(groups);
     for(i=0;i<objectKeys.length;i++)
         {
             groupArray.push({'employername':objectKeys[i],'count':groups[objectKeys[i]].length});
         }
	updateGraph(groupArray);
}

function updateGraph(groupArray){

	var barHeight=25;
	var barSpacing=5;


	var groupKeyValuePairs=_.pairs(groups);
    var maxVisaCount=d3.max(groupArray,function(d,i){return d.count});
    var xScale = d3.scale.linear()
                .domain([0,maxVisaCount])
                .range([0, w]);
	var svg=d3.select("svg");
	svg.selectAll("rect")
		.data(groupArray)
		.enter()
		.append("rect")
		.attr("x", function(d,i){return 0;})
		.attr("y", function(d,i){return (i*barHeight)+barSpacing;})
		.attr("width", function(d,i){ return xScale(d.count);})
		.attr("height",barHeight)
}
