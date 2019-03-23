// Grab the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// space for placing words
var labelArea = 110;

// padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// create circles
var circRadius;
function crGet() 
{
  if (width <= 530) 
    {
        circRadius = 5;
    }
  else 
    {
        circRadius = 10;
    }
}
crGet();

//x axis label
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

function xTextRefresh() 
{
  xText.attr("transform", "translate(" + ((width - labelArea) / 2 + labelArea) + ", " + (height - margin - tPadBot) + ")" );
}
xTextRefresh();

xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

//make text readable
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// displays y axis label
svg.append("g").attr("class", "yText");

// selects the group of data
var yText = d3.select(".yText");

function yTextRefresh() 
{
    yText.attr
    (
        "transform",
        "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();

yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Lacks Healthcare (%)");

// import csv
d3.csv("assets/data/data.csv").then(function(data) 
{
    visualize(data);
});

// visualizes the csv data
function visualize(theData) 
{
    //determine which axis the data belongs to
    var curX = "poverty";
    var curY = "obesity";

    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // tooltip setup
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) 
        {
            console.log(d)

            var theX;

            var theState = "<div>" + d.state + "</div>"; //grabs state name
            
            var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
            
            if (curX === "poverty") 
                {
                    theX = "<div>" + curX + ": " + d[curX] + "%</div>"; //format data into percents
                }
            else 
                {
                    theX = "<div>" +
                    curX +
                    ": " +
                    parseFloat(d[curX]).toLocaleString("en") +
                    "</div>";
                }
            // Display what we capture.
            return theState + theX + theY;
        });
  // Call the toolTip function.
  svg.call(toolTip);

  // set min and max for x axis
  function xMinMax() 
  {
        // min will grab the smallest datum from the selected column.
        xMin = d3.min(theData, function(d) 
            {
                return parseFloat(d[curX]) * 0.90;
            });

        xMax = d3.max(theData, function(d) 
            {
                return parseFloat(d[curX]) * 1.10;
            });
  }

  // set min and max for y axis
  function yMinMax() 
  {
    yMin = d3.min(theData, function(d) 
        {
            return parseFloat(d[curY]) * 0.90;
        });

    yMax = d3.max(theData, function(d) 
        {
            return parseFloat(d[curY]) * 1.10;
        });
  }

  xMinMax();
  yMinMax();

  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);

  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // set x and y tick counts.
  function tickCount() 
  {
        if (width <= 500) 
            {
                xAxis.ticks(5);
                yAxis.ticks(5);
            }
        else 
            {
                xAxis.ticks(10);
                yAxis.ticks(10);
            }
  }
  tickCount();

  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // group dots and data
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // append data to each dot
  theCircles
    .append("circle")
    .attr("cx", function(d) 
        {
            return xScale(d[curX]);
        })
    .attr("cy", function(d) 
        {
            return yScale(d[curY]);
        })
    .attr("r", circRadius)
    .attr("class", function(d) 
        {
            return "stateCircle " + d.abbr;
        })
  // adds labels to dots
  theCircles
    .append("text")
    .text(function(d) 
        {
            return d.abbr;
        })
    .attr("dx", function(d) 
        {
            return xScale(d[curX]);
        })
    .attr("dy", function(d) 
        {
            return yScale(d[curY]) + circRadius / 2.5; //centers text
        })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
}