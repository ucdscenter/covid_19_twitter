'use strict'

  //move to front
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




  let width = 1000,
      height = 800,
      radius = 4,
      charge = -20,
      linkDistance = 20,
      textboxwidth = 170,
      barheight = 80

let labelcols = 4

let  labelenclosewidth = width

  let labelwidth = (width)/4 - 10
  let square = 15



var parseDate = d3.timeParse('%a %b %d %X +0000 %Y')
  var origin = 220
  var slide_h = 150
  






    let params  = getJsonFromUrl(window.location.search);
    file = 'twitter/' +  params.hashtag + '_network.json'
  viz()


  selectThing.selectAll("option").data(files).enter().append("option").attr("value", function(d){
    return d
  })
  .text(function(d){
    return d
  })



  $scope.nodeToggle = 1

  let hashcolor = d3.scaleOrdinal(d3.schemeSet1);
  let color = d3.scaleOrdinal(d3.schemeSet2)


  
 /* $scope.days=[]
  for(let i = 25; i < 26; i++){
    $scope.days.push(i)
  }
  $scope.day = 25*/





 let viz = async function(){
    console.log(location)
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

  let graph = await d3.json(file)

  console.log(graph)
  let bots = []//await d3.csv('bots.csv')
  let news = []//await d3.csv('customnews.csv')


 // console.log(graph.terms)

 let terms = graph.terms.sort(function(a,b){
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

let rad = d3.scaleLinear()
 rad.domain(d3.extent(graph.nodes, function(d){
  return d.score;
 }))
 rad.range([2, 30])

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
        d3.select(this).classed('barselected', function(d){

        let se = d3.select(this).classed('barselected')
        console.log(se)
        let barcolor = hashcolor(8)
        if (i < 9){
          barcolor = hashcolor(i) 
        }
        d3.selectAll('.' + d.h).style("fill", function(d){
          if(se){
           
             d3.select(this).select("circle").style("fill", color(d.group[0]))
          }
          else{
             console.log(d3.select(this).select("circle").style("fill"))
               d3.select(this).select("circle").style("fill", barcolor)
          }
        })
        .classed("hashcolored"+ i, !se)
        d3.selectAll('.' + d.h + "row").style("background-color", function(d){
          if(se){
             return color(d.group[0]);
          }
          else{
               return barcolor
          }
        })
        .classed("hashcolored"+ i, !se)


          return !d3.select(this).classed('barselected');
        })
       // console.log(d3.selectAll('.' + d.h))

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
                .data(graph.nodes.filter(function(d){
                  
                  if (d.group[0] == 2){
                    return false
                  }
                  return true
                }))
                .enter()
                .append("tr")
                .style("background-color", function(d){
               //   console.log(d.grou)
                  return color(d.group[0])
                })
                .attr("class", function(d){
                  let class_string = ""
                  d.hashtags.forEach(function(h){
                    class_string = class_string + " " + h + "row"
                  })
                  return class_string
                })
                .on("click", function(d){
                  d3.select("#" + d.name).moveToFront()
                  d3.select("#" + d.name).attr("durr", enlargeNode)
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



  let newLinks = graph.links


   console.log(graph)
   console.log(bots)



   let botsdict = {}
    bots.forEach(function(d){
      botsdict[d.name] = 1;
    })
  let newsdict = {}
    news.forEach(function(d){
      newsdict[d.name] = 1;
    })


  let cScale = d3.scaleLinear().domain([0, graph.terms.length]).range([0, 2 * Math.PI]);


  let charge = chargeCalc(graph.nodes.length)

  let simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(charge))
    .force("collision", d3.forceCollide().radius(function(d){
      return 0
    }))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink().iterations(2).id(function(d) { return d.id; }))
    .force("x", d3.forceX())
    .force("y", d3.forceY())
    .on("tick", ticked);


  let svg = d3.select("#network").append("svg").attr("id", "svg_network")
    .attr("height", height)
    .attr("width", width)




  function showName(el){
    console.log()


    d3.selectAll(".c" + el.id).classed("redhighlight", true)
    d3.select()
    let selnode = d3.select(this)
    
    selnode.moveToFront();
    selnode.select("text").moveToFront()
    selnode.style('stroke-opacity', 1)
    selnode.select('.nametext').classed('hide', false)
  }

    function selectHashtag(d,i){
    console.log(d)

    console.log(d3.selectAll('.' + d))

    let box = d3.select(this)
    console.log(box.attr('class'))
    if (box.attr('class') == 'unselected'){
      box.attr('class', 'selected')
      box.select('#select' + d).transition()
          .duration(250)
          .style('opacity', .5)
          
       d3.selectAll('.' + d)
      .classed('hide', true)
    }
    else{
      box.attr('class', 'unselected')
      box.select('#select' + d).transition()
          .duration(250)
          .style('opacity', .1)
         d3.selectAll('.' + d)
      .classed('hide', false)
    }


    return 1
  }

function enlargeNode(){

  let selnode = d3.select(this)
 
  let selcircle = selnode.select("circle")
  if (selnode.classed("small")){
    selnode.classed("big", true)
    selnode.classed("small", false)
    selcircle.transition().duration(250)
          .attr("r", 30)
  }
  else {
    selnode.classed("big", false)
    selnode.classed("small", true)
    selcircle.transition().duration(250)
          .attr("r", function(d){
            if ($scope.nodeToggle == 1){
              return rad(d.score)
             }
             else{
              return Math.sqrt(d.retweet_count/Math.PI) 
             }
           
          //  return 7 *  Math.sqrt(d.score/Math.PI);
          })
  }
      if (selnode.classed("big")){


    let fo = selnode.append("foreignObject")
    .attr("width", textboxwidth)
    .attr("class", "textbox")
    .attr("height",  function(d){
               let len = 0
              d.text.forEach(function(tweet){
                len = len + tweet.length
              })
            return   (len/20 + 2) * 13
              })
    .attr("x", function(d){
      let selX = selnode.attr("transform").slice(10, 16) 
      if (selX > (width/2)){
        return -textboxwidth
      }
      return 0
    })
    .attr("y", function(d){
      let selY = selnode.attr("transform").slice(selnode.attr("transform").indexOf(",") + 1, selnode.attr("transform").indexOf(",") + 7)
      if (selY > height/2){
        return  - (d.text.length * 50)
      }

      return 0

    })

     let div = fo.append("xhtml:div").append("div")
      .style('color', "black")
      .style('background-color', function(d){
        return color(d.group[0]);
       })
    div.append("p").html(function(d){
       let text = d.name + ':'
        d.text.forEach(function(entry){
          text = text + '<br>____<br>' + entry
        })
        return text
    });
  }
  else{
    selnode.select(".textbox").remove()
  }

    return
  }


function hideName(el){

  d3.selectAll(".c" + el.id).classed("redhighlight", false)
    let selnode = d3.select(this)
        selnode.style('stroke-opacity', .3)
    if (!d3.select(this).classed("big")){
      selnode.moveToBack()
      link.moveToBack()
      //link2.moveToBack()
    }

    selnode.select('.nametext').classed('hide', true)
  }


let linkbox = svg.append("g")
                .attr("class", "links")


 let link  = linkbox.selectAll(".line")

console.log(link)

  let node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
let restarted = true;
function restart(){


  link = link.data(newLinks, function(d){
    return d.source.name + "_" + d.target.name;
  })
  link.exit().remove()

  

  link = link.enter().append("line")
      .attr("stroke", "grey")
      .attr("stroke-opacity", .5)
      .attr("stroke-width", function(d){ 
       /* if (files.indexOf(file) < 5){
           return d.value / 3;
        }*/
        return (1/d.value) / 3; })
      .style("fill", "none")
      .attr("class", function(d){
        return "c" + d.source + " " + "c" + d.target
      })
      .on("click", function(d){
        console.log(d)
      }).merge(link);

    if(restarted){
   
    node = node.data(graph.nodes, function(d){
      return d.id
    })

    node.exit().remove()

    node = node.enter().append("g")
      .attr("id", function(d){
        return d.name
      })
      .attr('hashtags', function(d){
        let hclass = ""
      let theNode =   d3.select(this)
      d.hashtags.forEach(function(h){
       theNode.classed(h, true)
      });
      //console.log(hclass)
       return hclass;
      })
      .classed('small', function(d, i){
        //add tweet classes for quick selection/removal
        var thing = setClass(d3.select(this), d, i)
        return thing
      })
      .classed("bots", function(d){

        if (d.name in botsdict){

       //   console.log(d.name)
       //   console.log(d)
          return true;
        }
        else{
          return false
        }
      })
      .classed("news", function(d){
        if (d.name in newsdict){
          return true;
        }
        else{
          return false
        }
      }).call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)).merge(node);




  let circle = node.append("circle")
      .attr("r", function(d){
        return rad(d.score)//7 * Math.sqrt((d.score/Math.PI))
      })
      .attr("fill", function(d) { 
        return color(d.group[0]); })
      .attr("opacity", 1)
      .style("stroke", function(d){
        return color(d.group[0]);
      })
      .style("stroke-width", 1)


  node.on('click', enlargeNode)
    .on("dblclick", function(d){
      d3.select(this).classed("no_display", true)
      filter(d);
    })
    .on('mouseover', showName)
    .on('mouseout',hideName)

    let text = node.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('class', 'nametext')
             .style('font-family', 'Helvetica')
             .style('fill', 'black')
             .style('stroke', function(d){return color(d.group[0])})
             .style('stroke-width', .1)
             .style('background-color', 'black')
            .style('font-size', '14px')
            .text(function(d){return d.name;})
            .classed('hide', true);

  simulation.nodes(graph.nodes).on("tick", ticked);
}
  simulation.force("link").links(newLinks);
  simulation.alpha(.1).restart();
  restarted = false
  };//restart
   
restart()
let restoreButton = d3.select('#restoreButton').on("click", restoreLinks)

function restoreLinks(){
  d3.selectAll(".no_display").classed("no_display", false)
  newLinks = graph.links;
  restart()
}


d3.select("#searchName").on("keydown", function(){
    if (d3.event.keyCode==13){

      let handle = document.getElementById("searchName").value
    //  console.log(document.getElementById("searchName").value)
    console.log(handle)
      d3.select('#' + handle).attr("nada", enlargeNode)
    }
  })


let removeHandleButton = d3.select('#nameButton').on("click", function(d){
    let handle = document.getElementById("searchName").value
          d3.select('#' + handle).attr("id", function(d){
         d3.select(this).classed("no_display", true)
         filter(d);
         return  d3.select(this).attr('id')
      })
  })

  let botsButton = d3.select("#botsButton").on("click", function(d){
    let botsNodes = d3.selectAll('.bots')

    console.log(botsNodes)
    botsNodes.attr('id', function(d){
      //console.log(d)
      d3.select(this).classed("no_display", true)
      filter(d)
      return d3.select(this).attr('id');
    })

  })

  let newsButton = d3.select("#newsButton").on("click", function(d){
    let newsNodes = d3.selectAll('.news')

    console.log(newsNodes)
    newsNodes.attr('id', function(d){
      console.log(d)
      d3.select(this).classed("no_display", true)
      filter(d)
      return d3.select(this).attr('id');
    })

  })





node.attr("id", function(d){
    if(d.retweets == 0 && d.links == 0){
       d3.select(this).attr("display", "none")
    }
   
    return d3.select(this).attr("id");
  })



  function filter(d){
    //simulation.stop()
    newLinks = newLinks.filter(function(link){
      if (link.target == d || link.source == d){
        return false
      }
      return true
    })

    restart()


  }





function ticked() {

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

   

        node
        .attr("transform", function(d){
           let xtrans = Math.max(radius, Math.min(width - d.score, d.x))
           let ytrans = Math.max(radius, Math.min(height -d.score, d.y))
          return "translate(" + xtrans + "," + ytrans + ")";  })



  //  simulation.stop()
  }


function dragstarted(d) {
 if (!d3.event.active) simulation.alphaTarget(0.1).restart();

  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}


let toggleButton = function(nodesize){
  nodeToggle = nodesize
  var circles = d3.selectAll('circle').transition()
  if(nodeToggle == 2){
      circles
     .duration(250)
     .attr("r", function(d){
      return Math.sqrt(d.retweet_count/Math.PI) 
     });
  }
  else{
      circles
     .duration(250)
     .attr("r", function(d){
       return rad(d.score)//7 *  Math.sqrt(d.score/Math.PI); 
     });

  } 
}

  }
  //location.pathname = location.pathname
  console.log(location.pathname)

  viz();
