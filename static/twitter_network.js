'use strict'



 d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
  };

  d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };


  let chargeCalc = function(num){
      console.log(num);
      if (num < 200){
        return -100
      }
      if(num < 800){
        return -30
      }
      if(num < 1000){
        return -23
      }
      if(num < 2000){
        return -18
      }
      if(num < 3000){
        return - 12
      }
      if(num < 4000){
        return -8
      }
      if(num < 5000){
        return -6
      }
      if(num < 6000){
        return -5
      }
      return -3
}


  //format labels
function labely(i, text){
    var row = 35
    var sq = square 
    if(text){
      sq  = 0
  }
   // var row = 20
    if( i < 4){
      return row - sq
    }
    if( i < 8){
      return row * 2  - sq
    }
    if( i < 12){
      return row * 3 - sq
    }
    if( i < 16){
      return row * 4 - sq
    }
    if( i < 20){
      return row * 5 - sq
    }
  }

function setClass(node, d, i){
 /* d.tweets_in_text.forEach(function(tag){
    node.classed(tag, true)
  })*/
  return true
}

function getJsonFromUrl(hashBased) {
    var query;
    if(hashBased) {
      var pos = location.href.indexOf("?");
      if(pos==-1) return [];
      query = location.href.substr(pos+1);
    } else {
      query = location.search.substr(1);
    }
    var result = {};
    query.split("&").forEach(function(part) {
      if(!part) return;
      part = part.split("+").join(" "); // replace every + with space, regexp-free version
      var eq = part.indexOf("=");
      var key = eq>-1 ? part.substr(0,eq) : part;
      var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
      var from = key.indexOf("[");
      if(from==-1) result[decodeURIComponent(key)] = val;
      else {
        var to = key.indexOf("]",from);
        var index = decodeURIComponent(key.substring(from+1,to));
        key = decodeURIComponent(key.substring(0,from));
        if(!result[key]) result[key] = [];
        if(!index) result[key].push(val);
        else result[key][index] = val;
      }
    });
    return result;
}


async function wrapper(){
  const width = window.innerWidth - 10
  const height = window.innerHeight - 10
 
  let radius = 4,
      charge = -20,
      linkDistance = 20,
      textboxwidth = 170,
      barheight = 80

  let labelcols = 4

  let transform = d3.zoomIdentity;

  let  labelenclosewidth = width

  let labelwidth = (width)/4 - 10
  let square = 15

  var parseDate = d3.timeParse('%a %b %d %X +0000 %Y')
  var origin = 220
  var slide_h = 150
  
  let params  = getJsonFromUrl(window.location.search);

  let hashcolor = d3.scaleOrdinal(d3.schemeSet1);
  let color = function(thing){
    return 'white'
  }//d3.scaleOrdinal(d3.schemeSet2)

  let nodeToggle = 1


  d3.select('#svg_network').remove()
  d3.select('#labelgraph').remove()
  d3.select("#svgbar").remove()
  d3.select("#graph_metrics_table").remove()


  let barChart = d3.select("#barchart")
      .append("svg")
      .attr("width", width)
      .attr("height", barheight)
      .attr("id", "svgbar")

  var barg = barChart.append("g")
    .attr("transform", "translate(" + 0 + "," + 5 + ")");
  let fp = "/" + params.hashtag + "_network.json"
  d3.selectAll(".thehashtag").text(params.hashtag)
  let data = await d3.json(fp)

  
  
  console.log(data)

let terms = data.terms.sort(function(a,b){
  return b.score - a.score
 });
 terms = terms.slice(0, 20)

 console.log(terms)
let x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
    x.domain(terms.map(function(d){
      return d.h
    }))
let  y = d3.scaleLinear().rangeRound([barheight - 35, 0]);
    y.domain([0, d3.max(terms, function(d){
      return d.score;
    })])

  barg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," +(barheight - 35 )+ ")")
      .call(d3.axisBottom(x));


  barg.selectAll(".bar")
    .data(terms)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.h); })
      .attr("y", function(d) { return y(d.score); })
      .style("fill", function(d, i){
        if (i < 9){
          return hashcolor(i) 
        }
        {
          return hashcolor(8)
        }

      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return (barheight  - 35)- y(d.score); })
      .on("click", function(d, i){
        var se = d3.select(this).classed("barselected")
        var hcolor
        console.log(se)
        if (se == false){
           if (i < 9){
            hcolor =  hashcolor(i) 
          }
          else{
            hcolor = hashcolor(8)
          }
          d3.selectAll(".c" + d.h).style("fill", hcolor).classed("barselected", true)
          d3.selectAll(".r" + d.h).style("background-color", hcolor).classed("barselected", true)
          d3.select(this).classed("barselected", true)
        }
        else{
          d3.selectAll(".c" + d.h).style("fill", color(1)).classed("barselected", false)
          d3.selectAll(".r" + d.h).style("background-color", color(1)).classed("barselected", false)
          d3.select(this).classed("barselected", false)
        }
       
       

      });

barg.selectAll("text").attr("text-anchor", "middle").attr("transform", "rotate(10)")


  let table = d3.select("#graph_table")
                .append("table")
                .attr("id", "graph_metrics_table")

  let tablehead = table.append("thead")

  let tablebody = table.append("tbody")
 let headData =  ["handle", "betweenness", "degree", "harmonic"]

  tablehead.append("tr")
        .selectAll("th")
        .data(headData)
        .enter()
        .append("th")
          .text(function(d){
            return d;
          })
          .on("click", function(d, i){
             rows.sort(function(a, b) { 
              return b.graph_score[d] - a.graph_score[d];
               });
          })
          .style("cursor", "pointer")




  let rows = tablebody.selectAll("tr")
                .data(data.nodes.filter(function(d){
                  
                  if (d.group[0] == 2){
                    return false
                  }
                  return true
                }))
                .enter()
                .append("tr")
                .style("background-color", function(d){
                  console.log(d.group)
                  return color(d.group[0])
                })
                .attr("class", function(d){
                  let class_string = ""
                  d.hashtags.forEach(function(h){
                    class_string = class_string + " r" + h
                  })
                  return class_string
                })
                .attr("id", function(d){
                  console.log(d)
                  return "r" + d.name
                })
                .on("click", function(d){
                  d3.select("#c" + d.name).moveToFront().dispatch("click")

                 // d3.select("#" + d.name).attr("durr", enlargeNode)
                })

                .style("cursor", "pointer")
    let f = d3.format("<.4f")
    let cells = rows.selectAll("td")
              .data(function(row) {
                return headData.map(function (column2) {
                  //console.log(column)]
                  return { column: column2, value: row.graph_score[column2]}
                });
              })
              .enter()
              .append('td')
                .text(function(d){
                  if (d.column != "handle"){
                     return f(d.value)
                  }
                 return d.value
                })

      $("th:eq( 1 )").trigger("click")
  let cScale = d3.scaleLinear().domain([0, data.terms.length]).range([0, 2 * Math.PI]);


  charge = chargeCalc(data.nodes.length)

  let nodes = data.nodes
  let links = data.links

  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id)
        .distance((d) => 5 )
        .strength(0.1)
      )
      .force("charge", d3.forceManyBody()
        .strength(-200)
      )
       .force('center', d3.forceCenter((width - (width * .25)) / 2, height / 2))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  let svg = d3.select("#network").append("svg").attr("id", "svg_network")
    .attr("height", height)
    .attr("width", width - (width * .25))



  const zoomRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    

  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.3)
    .selectAll("line")
    .data(links)
    .enter().append("line")
      .attr("stroke-width", function(d){
        return (1/d.value) / 3; 
      })
      /*.attr("class", function(d){
        return "link_" + d.source.id + " " + "link_"+ d.target.id
      })*/;

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("id", 'nodes_outer_g')
    .selectAll("g")
    .data(nodes)
    .enter().append("g")
      .attr("class", 'node_g')
      .attr("id", function(d){
        return "id_" + d.id
      })



  node.append("circle")
    .attr("r", function(d){
      if (d.score != undefined){
      return Math.sqrt(d.score / Math.PI) * 10
    }
    return 5
    })
    .attr("fill", function(d){
      return color(d.group[0])
    })
    .attr("class", function(d){
      let classstr = ""
      d.hashtags.forEach(function(d){
        classstr =  classstr + ' c' + d;
      })
      return classstr
    })
    .attr("id", function(d){
      return 'c' + d.name
    })
    .style("stroke", 'black')
    .on("click", function(d){
          highlightEdges(d.id)

        })
    .on("mouseover", function(d){
        $('.mouseover').removeClass('hidden')
            let mouseloc = d3.mouse(document.getElementById('svg_network'))
            let data = { left: mouseloc[0] + 30, top: mouseloc[1] + 150}
            $('.mouseover').offset(data)
            d3.select(".mouseover").style("background-color", color(d.group[0]))
            if(d.text != undefined){
              $('.mouseover p').text("---"+d.name + "---\n" + d.text)
            }
            else{
              $('.mouseover p').text(d.id + ":" + d.count)
            }
            
        })
        .on("mouseout", function(d){
          $('.mouseover').addClass('hidden')
        });


  node.append("text")
    .style("stroke", "black")
    .style("stroke-width", '.5px')
    .text(function(d){
      if(d.count != undefined){
        return '#' + d.id
      }
      else d3.select(this).remove()
    })

  $('.mouseover').off()

  const zoom = d3.zoom()
      .scaleExtent([.02, 200])
      .on("zoom", zoomed);

  zoomRect.on("click", function(){
    $('.deselected_node').removeClass('deselected_node')
    $('.selected_edge').removeClass('selected_edge')
  }
  )
  zoomRect.call(zoom)
    //.call(zoom.translateTo, 0, 0)
    .call(zoom.scaleTo, .5);


  function highlightEdges(id){
  /*console.log(id)
  console.log($(".link_" + id))
  $('.selected_edge').removeClass('selected_edge')
  $(".link_" + id).addClass("selected_edge")*/
  $('.selected_edge').removeClass('selected_edge')
  $('.node_g').addClass("deselected_node")
  $('#' + "id_" + id).removeClass("deselected_node")
  link.attr("class", function(d){
    if(d.target.id == id){
      $('#' + "id_" + d.source.id).removeClass("deselected_node")
      return 'selected_edge'
    }
    else if(d.source.id == id){
      $('#' + "id_" + d.target.id).removeClass("deselected_node")
      return 'selected_edge'
    }
    else{
      return ''
    }
  })

}


function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
}
  let tickcount = 0
  simulation.on("tick", () => {
    $('#loading-label').text("Generating network locations " + tickcount + "%")
    tickcount += 1
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    /*node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);*/


    node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
    if (tickcount >= 100){
      simulation.stop()
      $('#loading-label').text("Finishing up")
        $('#loading-div').addClass("hidden")
        d3.selectAll(".post-loading").classed("hidden", false)
     
      
    }
  });

  function zoomed() {

    transform = d3.event.transform;
    d3.select('#nodes_outer_g').attr("transform", d3.event.transform);
    link.attr("transform", d3.event.transform);
  }

}//wrapper

wrapper()