import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {CommonGraph} from './common-graph';
import * as d3 from 'd3';

@Directive({
  selector: '[ibitsBarHorizontal]'
})
export class BarHorizontalDirective extends CommonGraph implements AfterViewInit {
  @Input() key: any;
  @Input() value: any;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'line-graph');

  }

  renderGraph() {
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = this.width - margin.left - margin.right,
      height = this.height - margin.top - margin.bottom;

    const y = d3.scaleBand()
      .range([height, 0])
      .padding(0.1);

    const x = d3.scaleLinear()
      .range([0, width]);

    const svg = d3.select(this.el.nativeElement).append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');

    this.data.forEach(d => d[this.value] = +d[this.value]);
    // @ts-ignore
    x.domain([0, d3.max(this.data, d => d[this.value])]);
    y.domain(this.data.map(d => d[this.key]));

    svg.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('width', d => x(d[this.value]))
      .attr('class', 'bar')
      .attr('y', d => y(d[this.key]))
      .attr('height', y.bandwidth());


    console.log('asd');
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append('g')
      .call(d3.axisLeft(y));
  }


}
