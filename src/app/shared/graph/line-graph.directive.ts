import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import * as d3 from 'd3';
import {CommonGraph} from './common-graph';

@Directive({
  selector: '[ibitsLineGraph]'
})
export class LineGraphDirective extends CommonGraph implements AfterViewInit {
  @Input() margin = {top: 50, right: 50, bottom: 50, left: 50};
  @Input() width = this.widthNative - this.margin.left - this.margin.right;
  @Input() height = this.heightNative - this.margin.top - this.margin.bottom;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'line-graph');

  }

  renderGraph() {

    const n = this.data.length;

    const xScale = d3.scaleLinear()
      .domain([0, n - 1])
      .range([0, this.width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([this.height, 0]);

    const line: any = d3.line()
      .x(function (d, i) {
        return xScale(i);
      })
      .y((d: any) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const dataset = d3.range(n).map(function (d) {
      return {'y': d3.randomUniform(1)()};
    });

    const svg = d3.select(this.el.nativeElement).append('svg')
      .attr('width', this.widthNative)
      .attr('height', this.heightNative)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.heightNative + ')')
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(yScale));

    svg.append('path')
      .datum(dataset)
      .attr('class', 'line')
      .attr('d', line);

    svg.selectAll('.dot')
      .data(dataset)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', function (d, i) {
        return xScale(i);
      })
      .attr('cy', function (d) {
        return yScale(d.y);
      })
      .attr('r', 5)
      .on('mouseover', function (a, b, c) {
        console.log(a);
      })
      .on('mouseout', function () {
      });
//       .on("mousemove", mousemove);

//   var focus = svg.append("g")
//       .attr("class", "focus")
//       .style("display", "none");

//   focus.append("circle")
//       .attr("r", 4.5);

//   focus.append("text")
//       .attr("x", 9)
//       .attr("dy", ".35em");

//   svg.append("rect")
//       .attr("class", "overlay")
//       .attr("width", width)
//       .attr("height", height)
//       .on("mouseover", function() { focus.style("display", null); })
//       .on("mouseout", function() { focus.style("display", "none"); })
//       .on("mousemove", mousemove);

//   function mousemove() {
//     var x0 = x.invert(d3.mouse(this)[0]),
//         i = bisectDate(data, x0, 1),
//         d0 = data[i - 1],
//         d1 = data[i],
//         d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//     focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
//     focus.select("text").text(d);
//   }
  }


}
