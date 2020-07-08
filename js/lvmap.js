



var ctx = document.getElementById('chart');
var ctxLine = document.getElementById('chart_line');
var ctxPie = document.getElementById('chart_pie');

let pieChartFn = (lab) => {
  var myChart = new Chart(ctxPie,{
    type: 'doughnut',
    data : {
      datasets: [{
          data: lab,
          backgroundColor: [
            "#4082a8",
            "#009caa",
            "#00b07a",
            "#8fb72e",
            "#ffa600"
          ],
          borderColor: [
            "#CDA776",
            "#CDA776",
            "#CDA776",
            "#CDA776",
            "#CDA776"
          ],
      }],
  
      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: [
          '5-Star',
          '4-Star',
          '3-Star',
          '2-Star',
          '1-Star'
      ]
  }
 
})
}

let lineChartFn = (x,y) => {
  var myChart = new Chart(ctxLine,{
    type: 'line',
    

    data: {
      labels: x,
      datasets:[{
        label: 'Average Rating',
        borderColor: "#3e95cd",
        pointRadius: 0,
        width: 0,
        data: y

      }
      ],
    },
    options:{
      
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            
          },
          zoom: {
            enabled: true,
            mode: 'x',
       
            speed: 0.0001,
            sensitivity: 0.001
          }
        }
      }

    }
    
  })
}

let barChartFn = (xLabels,days) => {
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: xLabels,
      datasets: [
        {
          label: 'Check-ins',
          data: days,
          backgroundColor: '#756bb1'
          
        }
      ]
    },
    options: {
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            
            
            
            
          },
          zoom: {
            enabled: true,
            mode: 'x',
            
            speed:  0.0001,
            sensitivity: 0.0001
          }
        }
      }
      
    }
  });
}

    var leafletMap = L.map('map').setView([33.427204, -111.939896], 13);
 


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(leafletMap);



    var svgMap = d3.select(leafletMap.getPanes().overlayPane).append("svg")
      .attr("width", 2000).attr("height", 2500);
    var circleGroup = svgMap.append("g").attr("class", "leaflet-zoom-hide");


    var tooltipmap = d3.select("#map").append("div").attr("class", "toolTipMap");


    d3.csv('data/Restaurants.csv', function (error, dataset) {
        if (error) throw error;

        dataset.forEach(function(d) {
            d.LatLng = new L.LatLng(d.latitude, d.longitude);
            d.star = +d.star;

            
          });



        var circleBind = circleGroup.selectAll("g")
          .data(dataset)

         var mapCircles = circleBind.enter()
          .append("g")
          .append("circle")
          .attr("pointer-events", "visible")
          .attr("r", 7)
          .attr("class", "circleMap")
          .on('click',function(d){
            $("#exampleModal").modal();
            //d3.select('#detailbar').style('display', 'block');4
            d3.select('#exampleModalLabel').html(d.name)
            //d3.select('#storename').html(d.name);
            donut(d.id);
            stack(d.id);
            avgR(d.id);
            console.log(d.id)})
          .attr("id-class", function(d){return d.id;})
            .attr("star-class", function(d){return d.star;})
            .attr("review-class", function(d){return d.review_count;})
            
             .on("mousemove", function(d){
                 tooltipmap
                     .style("left", d3.event.pageX - 50 + "px")
                     .style("top", d3.event.pageY - 150 + "px")
                     .style("display", "inline-block")
                     .html("<div class=note>"+"<em class=noteInside>"+(d.name)+"</em>"+"</div >" + "<div />" +"Rating: " + d.star + "<div />"+ "Total Reviews: "+ d.review_count
                         + "<div />" + "Address: " + (d.address));
             })
             .on("mouseout", function(d){ tooltip.style("display", "none");});
            // .on('click', selectBus)；

        function updateMap() {
           mapCircles.attr("transform",
           function(d) {
             return "translate("+
              leafletMap.latLngToLayerPoint(d.LatLng).x +","+
              leafletMap.latLngToLayerPoint(d.LatLng).y +")";
            });
          }

        leafletMap.on("viewreset", updateMap);
        updateMap();

      });



function donut(businessid){
(function(d3) {

        d3.json("./data/pie_chart_data.json", (function(data){
           console.log(data[businessid])
           var dataset = data[businessid]
           var vals = Object.values(dataset)
           pieChartFn(vals)

        }));

})(window.d3);
   d3.selectAll(".donutPath").remove();
}


function avgR(businessid){
    
  d3.json("./data/avg_rating_data.json", (function(data){

    var unordered = data[businessid]
    const ordered = {};
    Object.keys(unordered).sort().forEach(function(key) {
    ordered[key] = unordered[key];
      });

    let xVals = []
    let yVals = []
    for (var key in ordered) {

      xVals.push(key) 
      yVals.push(ordered[key])

    }
    
    lineChartFn(xVals,yVals)

  }))
   
    
}


function stack(businessid){

  
  d3.json("./data/weekday_checkins_hash.json", (function(data){
    var checkins = data[businessid]
    console.log(checkins)
    let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let sun = checkins['Sunday']
    let mon = checkins['Monday']
    let tues = checkins['Tuesday']
    let weds = checkins['Wednesday']
    let thurs = checkins['Thursday']
    let fri = checkins['Friday']
    let sat = checkins['Saturday']
    let week = [sun, mon, tues, weds, thurs, fri, sat]
  
  barChartFn(days,week)
  }));
   
  
}

$("#exampleModal").on('hide.bs.modal', function(){
  $('#chart').remove();
  $('#chart_line').remove();
  $('#chart_pie').remove();

  $('.packageClass').append('<canvas id="chart"><canvas>');
  $('.packageClass1').append('<canvas id="chart_line"><canvas>');
  $('.packageClass2').append('<canvas id="chart_pie"><canvas>');
  ctx = document.getElementById('chart')
  ctxLine = document.getElementById('chart_line')
  ctxPie = document.getElementById('chart_pie')
  //barChartFn([],[],[],[],[],[])
});

