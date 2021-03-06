// SET UP
// First, set the dimensions and margins of the visual
var margin = {top: 20, right: 20, bottom: 70, left: 115},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// Append the svg object to the body of the page
var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 70)
    .attr("class", "chart")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// DATA
// Get the data and set up initial visualization. This includes a function "Run" which handles all of the visual aspects of the display.
// Basically, I import the csv data and then create the visualization in the same section with the "Run" function.
{d3.csv("data/data.csv").then(function(cdcData) {
    cdcData.forEach(function(d) {
        d.stateAbbr = d.stateAbbr;
        d.stateName = d.stateName;
        d.smoker = +d.smoker;
        d.physicalActivity = +d.physicalActivity;
        d.income = +d.income;
        d.depression = +d.depression;
        d.diabetes = +d.diabetes;
        d.heartAttack = +d.heartAttack;
    });
    VisualizeData(cdcData)
})
};

// VISUALIZATION
// Create the main function which will set up the visualization from input data
function VisualizeData(data) {

    // Set default variables for X and Y values
    var selectedXAxis = "smoker";
    var selectedYAxis = "heartAttack";

    // Set the scales' domains and ranges
    var xScale = d3.scaleLinear()
        .range([0, width])
        .domain([0.9*(d3.min(data, (d) => {return d[selectedXAxis]; })), 1.1*(d3.max(data, (d) => {return d[selectedXAxis]; }))])
    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0.9*(d3.min(data, (d) => {return d[selectedYAxis]; })), 1.1*(d3.max(data, (d) => {return d[selectedYAxis]; }))]);

    // Create the axes

        // X Axis
        var xAxis = svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        // Y axis
        var yAxis = svg.append("g")
            .attr("class", "yAxis")
            .call(d3.axisLeft(yScale));

    // Tooltip: Here I create a function to set up the tool tip. This will display information about the data when moused over.
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([40, -70])
    .html(function(d) {

        // Define three variables: stateInfo, xInfo, yInfo which contain the text information to be displayed.
        var stateInfo = "<div>" + d.stateName + "</div>";
        var xInfo

        // The xInfo is a bit more intensive because it can either be a percentage (physical activity, smoking)
        // or a numerical dollar value (income).
        if (selectedXAxis === "income") {xInfo = "<div>" + selectedXAxis + ": $" + d[selectedXAxis] + "</div>";}
        else {xInfo = "<div>" + selectedXAxis + ": " + d[selectedXAxis] + "%</div>";}

        // yInfo is always a percentage.
        var yInfo = "<div>" + selectedYAxis + ": " + d[selectedYAxis] + "%</div>";

        // Finally, display the information.
        return stateInfo + xInfo + yInfo;
    });
    svg.call(toolTip);

    // Add a circle element for each data point
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", ((d) => {return xScale(d[selectedXAxis]); }))
        .attr("cy", ((d) => {return yScale(d[selectedYAxis]); }))
        .attr("r", 12)
        // Tooltip rules: show tooltip when mousing-over; remove when mousing-out.
        .on("mouseover", ((d) => {
            toolTip.show(d, this)}))
        .on("mouseout", ((d) => {
            toolTip.hide(d)}));

    // Add state labels to scatterplot circles
    svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "stateText")
        .attr("x", ((d) => {return xScale(d[selectedXAxis]); }))
        .attr("y", ((d) => {return yScale(d[selectedYAxis]); }))
        .attr("dx", "-0.65em")
        .attr("dy", "0.4em")
        .attr("font-size", "10px")
        .text((d) => {return d.stateAbbr})
        // Tooltip rules: show tooltip, hide tooltip etc.
        .on("mouseover", ((d) => {
            toolTip.show(d)}))
        .on("mouseout", ((d) => {
            toolTip.hide(d)}));

    // X axis labels

    // Create a group element to hold our bottom axes labels.
    svg.append("g").attr("class", "xAxisLabels");
    var xAxisLabels = d3.select(".xAxisLabels");

    // This will adjust the position of the labels to the appropriate place below the axis.
    function placeXLabel() {
        xAxisLabels.attr("transform", "translate(" + (width / 2) + ", " + (height + margin.top + 20) + ")");
    }

    placeXLabel()

        // "Smoker (%)" label
        xAxisLabels.append("text")
            .attr("y", 0)
            .attr("value", "smoker")
            .attr("axis", "x")
            .attr("selected", "active")
            .classed("active", true)
            .style("text-anchor", "middle")
            .text("Smoker (%)");

        // "Physical Activity Last Month (%)" label
        xAxisLabels.append("text")
            .attr("y", 25)
            .attr("value", "physicalActivity")
            .attr("axis", "x")
            .attr("selected", "inactive")
            .classed("inactive", true)
            .style("text-anchor", "middle")
            .text("Physical Activity Last Month (%)");

        // "Household Income (Median)" label
        xAxisLabels.append("text")
            .attr("y", 50)
            .attr("value", "income")
            .attr("axis", "x")
            .attr("selected", "inactive")
            .classed("inactive", true)
            .style("text-anchor", "middle")
            .text("Household Income (Median)");

    // Y axis labels

    // Add a second label group, for the Y axis.
    svg.append("g").attr("class", "yAxisLabels");
    var yAxisLabels = d3.select(".yAxisLabels");

    // Like before, adjust the position of the labels to the appropriate place to the left of the axis.
    function placeYLabel() {
        yAxisLabels.attr("transform", "translate(0," + (height)/2 + ")rotate(-90)");
        }
    placeYLabel();
        
        //"Depression (%)" label
        yAxisLabels.append("text")
            .attr("y", -100)
            .attr("value", "depression")
            .attr("axis", "y")
            .attr("selected", "inactive")
            .classed("inactive", true)
            .style("text-anchor", "middle")
            .text("Depression (%)");       

        //"Heart Attack Ever (%)" label
        yAxisLabels.append("text")
            .attr("y", -75)
            .attr("value", "heartAttack")
            .attr("axis", "y")
            .attr("selected", "active")
            .classed("active", true)
            .style("text-anchor", "middle")
            .text("Heart Attack Ever (%)");
    
        //"Diabetes Ever (%)" label
        yAxisLabels.append("text")
            .attr("y", -50)
            .attr("value", "diabetes")
            .attr("axis", "y")
            .attr("selected", "inactive")
            .classed("inactive", true)
            .style("text-anchor", "middle")
            .text("Diabetes Ever (%)");

    // INTERACTIVITY
    // This section adds the interactive element where clicking on an axis changes the graph by updating the X or Y values to
    // match the selected input.

    // Create a function which updates the X axis title and appearance when clicked
    function UpdateXAxis(clickedVariable) {
        // Switch the currently active variable to inactive (one of three variables).
        xAxisLabels.selectAll("text")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
    
        // Switch the variable just clicked to active.
        clickedVariable.classed("inactive", false).classed("active", true);
        };

    // Similar function for Y axis
    function UpdateYAxis(clickedVariable) {
        // Switch the currently active variable to inactive (one of three variables).
        yAxisLabels.selectAll("text")
            .filter(".active")
            .classed("active", false)
            .classed("inactive", true);
    
        // Switch the variable just clicked to active.
        clickedVariable.classed("inactive", false).classed("active", true);
        };
    
    // Now input code for changing the data, axis scale, and axis label when clicked/selected.
    xAxisLabels.selectAll("text").on("click", function() {
    
    // Save the selected text so I can reference it.
    var selected = d3.select(this);

    // Only update the display if an inactive display is selected (otherwise, keep the display - graph, axes, labels - the same)
    if (selected.classed("inactive")) {

        // Save the axis label from the selected text.
        var axisValue = selected.attr("value");

        // Make the selected variable the current value for "selectedXAxis"
        selectedXAxis = axisValue;

        // Update the domain of x.
        xScale.domain([0.9*(d3.min(data, (d) => {return d[selectedXAxis]; })), 1.1*(d3.max(data, (d) => {return d[selectedXAxis]; }))])

        // Now use a transition when updating the xAxis.
        xAxis.transition().duration(500).call(d3.axisBottom(xScale));

        // Now update the location of the circles. Provide a transition for each state circle from the original to the new location.
        d3.selectAll("circle").each(function() {
        d3.select(this)
            .transition()
            .attr("cx", ((d) => {return xScale(d[selectedXAxis]); }))
            .duration(500);
        });

        // Need change the location of the state texts, too: give each state text the same motion as the matching circle.
        d3.selectAll(".stateText").each(function() {
        d3.select(this)
            .transition()
            .attr("x", ((d) => {return xScale(d[selectedXAxis]); }))
            .duration(500);
        });

        // Finally, change the classes of the last active label and the clicked label.
        UpdateXAxis(selected);
    }
    });

    // In the other case, y is the selected axis:
    yAxisLabels.selectAll("text").on("click", function() {
    
    // Save the selected text.
    var selected = d3.select(this);
        
    // Only update the display if an inactive display is selected (otherwise, keep the display - graph, axes, labels - the same)
    if (selected.classed("inactive")) {
        
        // Save the axis label from the selected text.
        var axisValue = selected.attr("value");

        // Make the selected variable the current value for "selectedYAxis"
        selectedYAxis = axisValue;
        
        // Update the domain of y.
        yScale.domain([0.9*(d3.min(data, (d) => {return d[selectedYAxis]; })), 1.1*(d3.max(data, (d) => {return d[selectedYAxis]; }))])
        
        // Now use a transition when updating the yAxis.
        yAxis.transition().duration(500).call(d3.axisLeft(yScale));
        
        // Now update the location of the circles. Provide a transition for each state circle from the original to the new location.
        d3.selectAll("circle").each(function() {
        d3.select(this)
            .transition()
            .attr("cy", ((d) => {return yScale(d[selectedYAxis]); }))
            .duration(500);
        });
        
        // Need change the location of the state texts, too: give each state text the same motion as the matching circle.
        d3.selectAll(".stateText").each(function() {
        d3.select(this)
            .transition()
            .attr("y", ((d) => {return yScale(d[selectedYAxis]); }))
            .duration(500);
        });
        
        // Finally, change the classes of the last active label and the clicked label.
        UpdateYAxis(selected);
    }
    })
};
