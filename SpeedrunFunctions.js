function displayGraph(){
  // based on https://d3-graph-gallery.com/graph/scatter_basic.html

  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#graph-pane")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id","graph")
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  //Read the data
  d3.json("https://www.speedrun.com/api/v1/leaderboards/smw/category/7kjrn323", function(data) {
    
    //get date bounds
    var minYear = document.getElementById("year1");
    if(minYear.value.length == 1){
      minYear.value = "200"+minYear.value;
    }else if(minYear.value.length == 2){
      minYear.value = "20"+minYear.value;
    }else if(minYear.value.length != 4){
      minYear.value = "2016";
    }
    var maxYear = document.getElementById("year2");
    if(maxYear.value.length == 1){
      maxYear.value = "200"+maxYear.value;
    }else if(maxYear.value.length == 2){
      maxYear.value = "20"+maxYear.value;
    }else if(maxYear.value.length != 4){
      maxYear.value = "2016";
    }
    var minMonth = document.getElementById("month1");
    if(minMonth.value.length == 1){
      minMonth.value = "0"+minMonth.value;
    }else if(minMonth.value.length != 2){
      minMonth.value = "01";
    }
    var maxMonth = document.getElementById("month2");
    if(maxMonth.value.length == 1){
      maxMonth.value = "0"+maxMonth.value;
    }else if(maxMonth.value.length != 2){
      maxMonth.value = "01";
    }
    var minDay = document.getElementById("day1");
    if(minDay.value.length == 1){
      minDay.value = "0"+minDay.value;
    }else if(minDay.value.length != 2){
      minDay.value = "01";
    }
    var maxDay = document.getElementById("day2");
    if(maxDay.value.length == 1){
      maxDay.value = "0"+maxDay.value;
    }else if(maxDay.value.length != 2){
      maxDay.value = "01";
    }

    // Add X axis
    var x = d3.scaleTime()
      .domain([d3.min(data.data.runs, d => new Date(d.run.submitted)), d3.max(data.data.runs, d => new Date(d.run.submitted))])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data.data.runs, d => (d.run.times.primary_t))])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
  
    // Add dots
    svg.append('g')
      .selectAll("circle")
      .data(data.data.runs)
      .enter()
      .append("circle")
        .attr("cx", d => x(new Date(d.run.submitted)))
        .attr("cy", d => y(d.run.times.primary_t))
        .attr("r", 1.5)
        .attr("runID", d => (d.run.id) )
        .style("fill", "#ffffff")
        .on("click", function (d){
          var textBox = document.getElementById("data-box");
          textBox.value = "Run ID: " + d.run.id;
          textBox.value += "\nRun Submitted:" + d.run.submitted;
        })
        
  })
};

function refreshGraph(){
  var graphPane = document.getElementById("graph-pane");
  var oldGraph = document.getElementById("graph");
  if (oldGraph) {
    graphPane.removeChild(oldGraph);
    displayGraph();
  }
};