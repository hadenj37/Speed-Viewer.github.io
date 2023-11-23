// some functionality adapted from https://d3-graph-gallery.com/graph/scatter_basic.html

// Globals
const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff","#abcdef","#fedcab"];
var legendSize = 0;
var minDate;
var maxDate;
var maxSec = 36000;
const margin = {top: 10, right: 30, bottom: 60, left: 90},
  width = 1050 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

function addAxes() {
  // append the svg object to the body of the page
  var svg = d3.select("#graph-pane")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("id","graph")
    .append("g")
      .attr("id","plot")  
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  // get & validate date bounds //
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

  minDate = new Date(minYear.value+"-"+minMonth.value+"-"+minDay.value);
  maxDate = new Date(maxYear.value+"-"+maxMonth.value+"-"+maxDay.value);
  console.log("Date range is from "+minDate.toISOString()+" to "+maxDate.toISOString());

  /*if(!(d3.select("#fit-checkbox").property("checked"))){*/
    var timeBox = document.getElementById("time-box");
    try {
      maxSec = parseFloat(timeBox.value);
      console.log(`maxSec is ${maxSec}`);
    } catch (error) {
      console.log(`Could not parse ${maxSec} as a float`)
      timeBox.value = `${maxSec}`;
    }
  /*}*/

  // Add X axis
  var x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .attr("class","axis")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, maxSec])
    .range([height, 0]);
  svg.append("g")
    .attr("class","axis")
    .call(d3.axisLeft(y));

  // Add x-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width/2}, ${height+40})`)
    .style("fill","white")
    .text("Date Submitted");

  // Add y-axis label
  svg.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(-60, ${height/2})rotate(-90)`)
    .style("fill","white")
    .text("Run Time (seconds)");
};

function refreshAxes(){
  var graphPane = document.getElementById("graph-pane");
  var oldGraph = document.getElementById("graph");
  if (oldGraph) {
    graphPane.removeChild(oldGraph);
    addAxes();
  }
};

function populateGraph(){
  // Clear Axes
  d3.select("#graph").selectAll("circle").remove();
  
  // Get modules from legend
  const legendModules = d3.selectAll(".legend-module");

  //--Attempt at fitting to data--//
  /*if(d3.select("#fit-checkbox").property("checked") && (legendSize > 0)){
    maxSec = 0;
    legendModules.each(function() {
      // Get game & cateory & level
      const gameDropdown = d3.select(this).select(".game-dropdown");
      const categoryDropdown = d3.select(this).select(".category-dropdown");
      const levelDropdown = d3.select(this).select(".level-dropdown");
  
      // Build API call string
      var apiString = `https://www.speedrun.com/api/v1/leaderboards/${gameDropdown.property("value")}`;
      if(levelDropdown.property("value") != "0"){
        apiString += `/level/${levelDropdown.property("value")}`;
        if(categoryDropdown.property("value") != "0"){
          apiString += `/${categoryDropdown.property("value")}`;
        }
      }else if(categoryDropdown.property("value") != "0"){
        apiString += `/category/${categoryDropdown.property("value")}`;
      }
  
      // Read the data
      d3.json(apiString, function(data) {
        console.log(`making API call: ${apiString}`);
        var localMax = d3.max(data.data.runs, function(d) { return parseFloat(d.run.times.primary_t); });
        if(localMax > maxSec){
          console.log(`${localMax} is greater than ${maxSec}`)
          maxSec = localMax;
          d3.select("#time-box").property("value",`${maxSec}`);
          refreshAxes();
        } else {console.log(`${localMax} is less than or equal to ${maxSec}`);}
      });
    });
    console.log(`maxSec is ${maxSec}`);
    d3.select(".time-box").property("value",`${maxSec}`);
  }*/
  
  // Set Scales
  var x = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width]);
  var y = d3.scaleLinear()
    .domain([0, maxSec])
    .range([height, 0]);
  
  // Add data for each module
  legendModules.each(function(d, index) {
    // Get game & cateory & level
    const gameDropdown = d3.select(this).select(".game-dropdown");
    const categoryDropdown = d3.select(this).select(".category-dropdown");
    const levelDropdown = d3.select(this).select(".level-dropdown");

    // Build API call string
    var apiString = `https://www.speedrun.com/api/v1/leaderboards/${gameDropdown.property("value")}`;
    if(levelDropdown.property("value") != "0"){
      apiString += `/level/${levelDropdown.property("value")}`;
      if(categoryDropdown.property("value") != "0"){
        apiString += `/${categoryDropdown.property("value")}`;
      }
    }else if(categoryDropdown.property("value") != "0"){
      apiString += `/category/${categoryDropdown.property("value")}`;
    }

    // Read the data
    d3.json(apiString, function(data) {
      console.log(`making API call: ${apiString}`);

      // Add points to graph
      var graph = d3.select("#graph");
      graph.select('#plot')
        .selectAll(`.data${index}`)
        .data(data.data.runs.filter(d => {return (minDate <= new Date(d.run.submitted) && new Date(d.run.submitted) <= maxDate && d.run.times.primary_t <= maxSec) }))
        .enter()
        .append("circle")
          .attr("cx", d => x(new Date(d.run.submitted)))
          .attr("cy", d => y(d.run.times.primary_t))
          .attr("r", 3)
          .attr("stroke","black")
          .attr("stroke-width","1")
          .style("fill", colors[index])
          .on("click", function (d){
            // Display specfic run information to the textbox
            var textBox = document.getElementById("data-box");
            textBox.value = `\nLeaderboard Place: ${d.place}`;
            textBox.value += `\nRuntime: ${d.run.times.primary}`
            textBox.value += `\nRun Submitted: ${d.run.submitted.toString()}`;
          });
    })
  });
};

// called upon module creation
function populateGameDropdown(module) {
  var apiString = "https://www.speedrun.com/api/v1/games?_bulk=yes&max=1000";
  var searchText = d3.select("#game-searchbar").property("value");
  if(searchText.length > 0){
    apiString += `&name=${searchText}`;
  }

  d3.json(apiString, function(data) {
    console.log(`making API call: ${apiString}`);
    // populate game dropdown with game titles & ids
    module.select(".game-dropdown")
      .selectAll(".apiOpt")
      .data(data.data)
      .enter()
      .append("option")
        .property("value", d => d.id)
        .text(d => d.names.international);
  });
};

// dependent on game chosen, per API docs
// called by game-dropdown onchange
function populateCategoryDropdown(module) {
  var gameDropdown = module.select(".game-dropdown");
  var categoryDropdown = module.select(".category-dropdown");
  var apiString = `https://www.speedrun.com/api/v1/games/${gameDropdown.property("value")}/categories`;
  d3.json(apiString, function(data) {
    console.log(`making API call: ${apiString}`);  
    categoryDropdown.selectAll(".apiOpt")
      .data(data.data)
      .enter()
      .append("option")
        .property("value", d => d.id)
        .property("type", d => d.type)
        .text(d => d.name)
  });
};

function populateLevelDropdown(module) {
  var gameDropdown = module.select(".game-dropdown");
  var levelDropdown = module.select(".level-dropdown");
  levelDropdown.selectAll("option").remove();
  levelDropdown.append("option")
    .property("value","0")
    .text("N/A");
  var apiString = `https://www.speedrun.com/api/v1/games/${gameDropdown.property("value")}/levels`;
  d3.json(apiString, function(data) {
    console.log(`making API call: ${apiString}`);
    levelDropdown.selectAll(".apiOpt")
      .data(data.data)
      .enter()
      .append("option")
        .property("value", d => d.id)
        .text(d => d.name)
  });
};

function handleCategorySelect(dropdown, module){
  if(dropdown.options[dropdown.selectedIndex].type == "per-level"){
    populateLevelDropdown(module);
  }else{
    populateGraph();
  }
};

// Adds a module to the legend
function initModule(){
  // Update legendSize & crate moduleId
  legendSize += 1;
  var moduleId = "module"+legendSize.toString();

  // Append new module to legend
  var legend = d3.select("#legend");
  legend.append("div")
      .attr("id",moduleId)
      .attr("class","legend-module")

  // Add elements to module
  var module = d3.select("#"+moduleId);

  // Game
  module.append("p")
    .text("Game:");
  module.append("select")
    .attr("class","game-dropdown")
    .on("change", function() {
      console.log(`Game selection changed in ${module.attr("id")}`);
      var categoryDropdown = module.select(".category-dropdown");
      categoryDropdown.selectAll("option").remove();
      categoryDropdown.append("option")
        .property("value","0")
        .text("N/A");
      var levelDropdown = module.select(".level-dropdown");
      levelDropdown.selectAll("option").remove();
      levelDropdown.append("option")
          .property("value","0")
          .text("N/A");
      populateCategoryDropdown(module);
    })
    .append("option")
      .property("value","0")
      .text("None");
    
  // Category
  module.append("p")
    .text("Category:");
  module.append("select")
    .attr("class", "category-dropdown")
    .on("change", function() {
      console.log(`Category selection changed in ${module.attr("id")}`);
      handleCategorySelect(this, module);
    })
    .append("option")
      .property("value","0")
      .text("N/A");

  // Level
  module.append("p")
    .text("Level:");
  module.append("select")
    .attr("class", "level-dropdown")
    .on("change", function() {
      console.log(`Level selection changed in ${module.attr("id")}`);
      populateGraph();
    })
    .append("option")
      .property("value","0")
      .text("N/A");

  // Remove Button
  module.append("button")
    .text("Remove")
    .on("click", function(){
      console.log(`Removing ${module.attr("id")}`);
      removeModule(module);
    });

  // Color
  module.append("svg")
    .attr("height","20")
    .attr("width","20")
    .append("circle")
    .style("fill", colors[legendSize-1])
    .attr("r","10")
    .attr("cx","10")
    .attr("cy","10");

  // Add games to dropdown
  populateGameDropdown(module);
};

function removeModule(module){
  // Remove module in question
  module.remove();
  legendSize -= 1;

  var remainingModules = d3.selectAll(".legend-module");
  remainingModules.each(function(d,i){
    var currentModule = d3.select(this);
    currentModule.attr("id",`module${(i+1)}`);
    currentModule.select("circle").style("fill",colors[i]);
  });

  populateGraph();
};