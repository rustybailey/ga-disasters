
var width = 700,
    height = 700;

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")

d3.json("ga-counties.json", function(error, ga) {
  d3.csv("disasters.csv", function(error, data){
    var consolidatedData = {};
    var disasterTypes = [];

    data.forEach(function(v,i){
      if(disasterTypes.indexOf(v["HAZARD_TYPE_COMBO"]) === -1){
        disasterTypes.push(v["HAZARD_TYPE_COMBO"])
      }
    });

    disasterTypes.sort().forEach(function(v, i){
      d3.select(".options-container").append("button")
        .attr("class", "data-option")
        .attr("data-type", v)
        .text(v)
    })

    data.forEach(function(v,i){
      if(v["FIPS_CODE"] in consolidatedData) {
        consolidatedData[v["FIPS_CODE"]].total += 1
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1
        }
      } else {
        consolidatedData[v["FIPS_CODE"]] = {}
        consolidatedData[v["FIPS_CODE"]].total = 1
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1
        }
        
      }
    });

    var quantize = d3.scale.quantize()
        .domain([0, d3.max(d3.values(consolidatedData), function(d) {return d.total})])
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

    var counties = topojson.feature(ga, ga.objects.counties);
    var mapData = counties.features;

    mapData.forEach(function(v,i){
      var id = v.id;
      var thisData = consolidatedData[id] || 0;
      v.data = thisData;
    });


    var projection = d3.geo.albersUsa()
      .scale(8000)
      .translate([-1200, -400]);

    var path = d3.geo.path().projection(projection);
    svg.append("path")
      .datum(counties)
      .attr("d", path);

    svg.selectAll(".county")
        .data(mapData)
      .enter().append("path")
        .attr("class", function(d) { return "county " + d.id + " " + (quantize(d.data.total || 0)); })
        .attr("d", path)
        .attr("stroke", "lightblue")
        .on("mouseover", function(){return tooltip.style("visibility", "visible");})
        .on("mousemove", function(d){
          return tooltip
            .style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
            .text(d.properties.name + " : " + (d.data.total || 0))
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
    console.log(ga, ga.objects.counties, mapData)

    d3.selectAll("button").on("click", function(){
      var selected = d3.select(this);
      var type = selected.attr("data-type");
      d3.selectAll("button").classed("current", false);
      selected.classed("current", true);
      quantize.domain([0, d3.max(d3.values(consolidatedData), function(d) {return d[type]})])
      d3.selectAll(".county")
        .attr("class", function(d) { return "county " + d.id + " " + (quantize(d.data[type] || 0)); })
        .on("mousemove", function(d){
          return tooltip
            .style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
            .text(d.properties.name + " : " + (d.data[type] || 0))
        })
    })
  });
});