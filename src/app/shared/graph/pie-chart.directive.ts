import {AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import * as d3 from 'd3';
import {CommonGraph} from './common-graph';
import {svg} from 'd3';

@Directive({
  selector: '[ibitsPieChart]'
})
export class PieChartDirective extends CommonGraph implements AfterViewInit {

  @Input() key;
  @Input() value;
  @Input() color;
  private svg;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'pie-chart');

  }


  renderGraph() {
    const width = this.widthNative - 40;
    const height = this.heightNative - 40;
    const radius = Math.min(width, height) / 2 - 10;
    this.svg = d3.select(this.el.nativeElement)
      .append('svg')
      .attr('width', width).attr('height', height);

    const g = this.svg.append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const color: any = d3.scaleOrdinal()
      .range(this.data.map(e => e[this.color] || this.random_bg_color));

    const pie = d3.pie()
      .value((d) => d[this.value])
      .sort(null);

    const pieGroup = g.selectAll('.pie')
      .data(pie(this.data))
      .enter()
      .append('g')
      .attr('class', 'pie');

    const arc: any = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);

    // @ts-ignore
    pieGroup.append('path')
      .attr('d', arc)
      .attr('fill', (d) => color(d.index))
      .attr('opacity', 0.75)
      .attr('stroke', 'white');

    const text = d3.arc()
      .outerRadius(radius - 30)
      .innerRadius(radius - 30);

    // @ts-ignore
    pieGroup.append('text')
      .attr('fill', 'black')
      .attr('transform', (d: any) => 'translate(' + text.centroid(d) + ')')
      .attr('dy', '5px')
      .attr('font', '10px')
      .attr('text-anchor', 'middle')
      .text(d => d.data[this.key]);
  }

}
