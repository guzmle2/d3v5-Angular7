import {AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import * as d3 from 'd3';
import {TYPE_GRAPH} from '../models/type-graph.enum';
import {CommonGraph} from './common-graph';

@Directive({
  selector: '[ibitsAreaGraph]'
})
export class AreaGraphDirective extends CommonGraph {

  @Input() data = [];
  @Input() value;
  @Input() graphDimensions;
  @Input() keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  @Input() type_graph: TYPE_GRAPH;
  private svg: any;
  private graphAxes: any;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'area');

  }


  renderGraph() {

    this.data.map(a => {
      a.interval = new Date(a.interval);
      return a;
    });
    if (typeof this.graphDimensions === 'undefined') {
      // first time
      this.setInitialGraphData();
      this.setAxesBasedOnDimensions();
      this.updateAxesBasedOnData();
      this.drawGraph();
      this.plotArea(false);
    } else {
      // update
      this.updateAxesBasedOnData();
      this.updateAxesWithNewData();
      this.plotArea(true);
    }
  }

  setInitialGraphData() {
    const margins = {top: 20, right: 20, bottom: 30, left: 50};
    const raints = {min: 740, max: 1200};

    this.graphDimensions = {
      margin: margins,
      width: (this.widthNative || raints.min) - margins.left - 40,
      height: (this.heightNative || 500) - margins.bottom
    };

    this.graphDimensions.width = Math.max(Math.min(this.graphDimensions.width, raints.max), raints.min);
  }

  setAxesBasedOnDimensions() {
    this.graphAxes = {
      x: d3.scaleTime().range([0, this.graphDimensions.width]),
      y: d3.scaleLinear().range([this.graphDimensions.height, 0])
    };

    this.graphAxes.xAxis = d3.axisBottom(this.graphAxes.x);
    this.graphAxes.yAxis = d3.axisLeft(this.graphAxes.y).tickSize(-this.graphDimensions.width);
  }

  drawGraph() {
    this.svg = d3
      .select(this.el.nativeElement)
      .append('svg')
      .attr('width', this.graphDimensions.width + this.graphDimensions.margin.left)
      .attr('height', this.graphDimensions.height + this.graphDimensions.margin.top + this.graphDimensions.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.graphDimensions.margin.left + ',' + this.graphDimensions.margin.top + ')');

    this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + this.graphDimensions.height + ')')
      .call(this.graphAxes.xAxis);

    this.svg
      .append('g')
      .attr('class', 'y-axis')
      .call(this.graphAxes.yAxis);
  }

  updateAxesBasedOnData() {
    const maxYVal = this.getHighestValueForYAxis();

    // Set domains for axes
    this.graphAxes.x.domain(d3.extent(this.data, d => d.interval));
    this.graphAxes.y.domain([0, maxYVal]);
  }

  updateAxesWithNewData() {
    this.graphAxes.xAxis.scale(this.graphAxes.x);
    this.graphAxes.yAxis.scale(this.graphAxes.y);

    const t = d3.transition().duration(500);

    this.svg
      .select('.x-axis')
      .transition(t)
      .call(this.graphAxes.xAxis);

    this.svg
      .select('.y-axis')
      .transition(t)
      .call(this.graphAxes.yAxis);
  }

  plotArea(update) {
    const stack = d3.stack();
    stack.keys(this.keys);
    stack.order(d3.stackOrderReverse);

    const area = startFromZero => {
      const highestVal = this.getHighestValueForYAxis();
      return d3
        .area()
        .x((d: any) => this.graphAxes.x(d.data.interval))
        .y0(d => (startFromZero ? highestVal : this.graphAxes.y(d[0])))
        .y1(d => (startFromZero ? highestVal : this.graphAxes.y(d[1])));
    };


    const dataPath = this.svg
      .selectAll('.data-path')
      .data(stack(this.data))
      .enter()
      .append('g')
      .attr('class', d => 'data-path type-' + d.key);

    dataPath.exit().remove();
    dataPath
      .append('path')
      .attr('class', 'area')
      .attr('d', area(true))
      .transition()
      .delay(200)
      .duration(700)
      .attr('d', area(false));
  }

  getHighestValueForYAxis() {
    return d3.max(this.data, d => {
      const vals = d3.keys(d).map(key => (!key.startsWith('interval') ? d[key] : 0));
      return d3.sum(vals);
    });
  }
}
