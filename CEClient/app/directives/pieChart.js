angular
  .module('crimeChartApp')
  .directive('pieChart', function ($window, $parse) {
    return{
      restrict: 'EA',
      template: "<svg></svg>",

      link: function(scope, elem, attrs){
        var exp = $parse(attrs.chartData);
        var dataToPlot = exp(scope);
        var d3 = $window.d3;
        var rawSvg = elem.find("svg");
        var svg = d3.select(rawSvg[0]);

        function drawChart(){
          var w = 960;
          var h = 450;
          var r = Math.min(w, h)/2;

          var color = d3.scale.category20();
          var vis = svg.data([dataToPlot])
            .attr("width", w)
            .attr("height", h)
            .append("svg:g").attr("transform", "translate(" + r + "," + r + ")");

          var slices = vis.append("svg:g").attr("class", "slices");
          var labels = vis.append("svg:g").attr("class", "labels");
          var lines = vis.append("svg:g").attr("class", "lines");

          var pie = d3.layout.pie().value(function(d){return d.value;});
          var arc = d3.svg.arc().outerRadius(r * 0.8).innerRadius(r * 0.4);

          var arcs = slices
            .selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

          arcs.append("svg:path")
            .attr("fill", function(d, i){
              return color(i);
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", "1")
            .attr("d", function (d) {
              return arc(d);
            })
            .on("mouseover", function(e){
              $(this)
                .attr("fill-opacity", ".5")
                .css({"stroke": "green", "stroke-width": "1px"});
            })
            .on("mouseout",function(e){
              $(this)
                .attr("fill-opacity", "1")
                .css({"stroke-width": "0px"});
            })
            .attr("style","cursor:pointer;")
            .append("svg:title")
            .text(function(d, i) { return dataToPlot[i].label + ': '+ dataToPlot[i].value; });

          //arcs.append("svg:text")
          //  .attr("transform", function(d){
          //    d.innerRadius = 0;
          //    d.outerRadius = r;
          //    return "translate(" + arc.centroid(d) + ")";})
          //  .attr("text-anchor", "middle")
          //  .text( function(d, i) {
          //      return dataToPlot[i].label;
          //    }
          //  )
          //  .attr("style","cursor:pointer;")
          //  .attr("fill","#fff")
          //  .classed("slice-label",true);

          var key = function(d,i){ return dataToPlot[i].label; };

          var text = svg.select(".labels").selectAll("text")
            .data(pie(dataToPlot), key);

          text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d, i) {
              return dataToPlot[i].label;
            });

          function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
          }

          var outerArc = d3.svg.arc()
            .innerRadius(r * 0.9)
            .outerRadius(r * 0.9);

          text.transition().duration(1000)
            .attrTween("transform", function(d) {
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = r * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate("+ pos +")";
              };
            })
            .styleTween("text-anchor", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start":"end";
              };
            });

          text.exit()
            .remove();

          var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(dataToPlot), key);

          polyline.enter()
            .append("polyline").style("opacity",.3).style("stroke", "black").style("stroke-width", "2px").style("fill", "none");

          polyline.transition().duration(1000)
            .attrTween("points", function(d){
              this._current = this._current || d;
              var interpolate = d3.interpolate(this._current, d);
              this._current = interpolate(0);
              return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = r * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
              };
            });

          polyline.exit()
            .remove();
        }

        scope.$watchCollection(exp, function(newVal, oldVal){
          if (newVal.length > 0){
            dataToPlot = newVal;
            drawChart();
          }
        });
      }
    };
  });

