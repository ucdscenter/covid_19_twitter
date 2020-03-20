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

    d3.selectAll(".c" + el.id).classed("redhighlight", true)
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
  }//selectHashtag



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
  }//enlargeNode


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
  }//hideName


  let linkbox = svg.append("g")
                .attr("class", "links")


 let link  = linkbox.selectAll(".line")

  let node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")

  let newLinks = data.links

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

   
    node = node.data(data.nodes, function(d){
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

  simulation.nodes(data.nodes).on("tick", ticked);
  simulation.force("link").links(newLinks);



node.attr("id", function(d){
    if(d.retweets == 0 && d.links == 0){
       d3.select(this).attr("display", "none")
    }
   
    return d3.select(this).attr("id");
  })


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
