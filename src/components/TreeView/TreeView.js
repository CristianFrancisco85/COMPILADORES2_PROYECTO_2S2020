import React from 'react';
import * as d3 from 'd3'
import {AST} from '../../scripts/mainScript'


class TreeView extends React.Component {
 

  genTree= ()=>{
    console.log(AST)
    this.update(AST.AST)
  };

  update = (data) => {
    
  let margin = {top: 20, right: 90, bottom: 30, left: 90},
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  let treemap = d3.tree()
  .size([height, width]);

  let nodes = d3.hierarchy(AST.AST, function(d) {
    return d.Instrucciones;
  });

  nodes = treemap(nodes);

  let svg = d3.select(this.refs.treeView).append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom),
  g = svg.append("g")
  .attr("transform",
  "translate(" + margin.left + "," + margin.top + ")");

  let link = g.selectAll(".link")
  .data( nodes.descendants().slice(1))
  .enter().append("path")
  .attr("class", "link")
  .attr("d", function(d) {
  return "M" + d.y + "," + d.x
  + "C" + (d.y + d.parent.y) / 2 + "," + d.x
  + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
  + " " + d.parent.y + "," + d.parent.x;
  });


  var node = g.selectAll(".node")
  .data(nodes.descendants())
  .enter().append("g")
  .attr("class", function(d) { 
  return "node" + 
  (d.children ? " node--internal" : " node--leaf"); })
  .attr("transform", function(d) { 
  return "translate(" + d.y + "," + d.x + ")"; });

  node.append("circle")
  .attr("r", 10);

  node.append("text")
  .attr("dy", ".35em")
  .attr("x", function(d) { return d.children ? -13 : 13; })
  .style("text-anchor", function(d) { 
  return d.children ? "end" : "start"; })
  .text(function(d) { return d.data.name; });

  }

  render(){
    return (
    <div ref="treeView" className="row col-md-12 ">
      <button onClick={this.genTree} className="btn btn-warning">Ver Arbol</button>
    </div>
    )
  }
}
export default TreeView;
