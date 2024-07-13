const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = document.querySelector('.container').offsetWidth - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {
    const dataset = data.data;
    
    const parseYear = d3.timeParse("%Y-%m-%d");
    const formatYear = d3.timeFormat("%Y");

    const x = d3.scaleTime()
        .domain([parseYear("1947-01-01"), parseYear("2015-01-01")])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .nice()
        .range([height, 0]);

    const xAxis = d3.axisBottom(x)
        .ticks(d3.timeYear.every(5))
        .tickFormat(d3.timeFormat("%Y"));
    
    svg.append("g")
        .attr("id", "x-axis")
        .attr("class", "tick")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "tick")
        .call(d3.axisLeft(y));

    svg.selectAll(".bar")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(parseYear(d[0])))
        .attr("y", d => y(d[1]))
        .attr("width", (width / dataset.length) * 0.9)
        .attr("height", d => height - y(d[1]))
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("fill", "#d32f2f")
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Date: ${d[0]}<br>GDP: ${d[1]} Billion USD`)
                .attr("data-date", d[0])
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            d3.select("#tooltip").transition().duration(500).style("opacity", 0);
        });
});