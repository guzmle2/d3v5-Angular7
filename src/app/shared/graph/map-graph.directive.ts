import {AfterViewInit, Directive, ElementRef, Injector, Input, OnInit, Renderer2} from '@angular/core';
import {CommonGraph} from './common-graph';
import * as topojson from 'topojson-client';
import * as d3 from 'd3';

declare var jQuery: any;

@Directive({
  selector: '[ibitsMapGraph]'
})
export class MapGraphDirective extends CommonGraph implements OnInit, AfterViewInit {


  @Input() keyLongitude;
  @Input() keyLatitud;
  @Input() color;
  t: any;
  private svg: any;
  private _data;
  @Input() textTooltip: any;

  constructor(protected el: ElementRef, protected renderer: Renderer2, protected injector: Injector) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'graph-map');

  }

  renderGraph() {
    const width = this.widthNative;
    const height = this.heightNative;
    this.svg = d3
      .select(this.el.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);


    const projection = d3
      .geoEquirectangular()
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);


    const geocircle = d3.geoCircle();

    const urlJson = 'https://gist.githubusercontent.com/mbostock/4090846/raw/d534aba169207548a8a3d670c9c2cc719ff05c47/world-110m.json';
    d3.json(urlJson).then((worldData: any) => {

      const groups = this.svg.append('g');
      groups
        .selectAll('path')
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter()
        .append('path')
        .attr('class', 'country')
        .style('fill', d => 'rgb(220,220,220)')
        .attr('d', path);

      this.svg
        .append('rect')
        .attr('class', 'border')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none');

      this.svg
        .append('line')
        .attr('class', 'axis')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', width)
        .attr('y2', height / 2)
        .attr('fill', 'none');

      this.svg
        .append('line')
        .attr('class', 'axis')
        .attr('x1', width / 2)
        .attr('y1', 0)
        .attr('x2', width / 2)
        .attr('y2', height)
        .attr('fill', 'none');
      const div = d3.select(this.el.nativeElement).append('div').attr('class', 'tooltip')
        .attr('class', 'tooltip')
        .style('opacity', 0);
      for (const s of this._data) {
        let text = this.textTooltip;
        if (text) {
          text = this.textTooltip + ': ';
          text += s[this.textTooltip];
        }
        const washington = projection([s[this.keyLatitud], s[this.keyLongitude]]);
        const radio = s.radio || 20;
        this.svg
          .append('circle')
          .attr('cx', washington[0])
          .attr('cy', washington[1])
          .attr('r', radio)
          .style('fill', s.color || 'red')
          .style('opacity', 0.6)
          .on('mouseover', function (d, i) {
            d3.select(this).transition()
              .duration(500)
              .style('fill', s.color || 'black')
              .attr('r', radio * 2);


            if (text) {
              div.transition()
                .duration(200)
                .style('opacity', .9);
              div.html(text)
                .style('left', (d3.event.pageX) + 'px')
                .style('top', (d3.event.pageY - 80) + 'px');
            }
          })
          .on('mouseout', function (d, i) {

            d3.select(this).transition()
              .duration(500)
              .style('fill', s.color || 'red')
              .attr('r', radio);

            if (text) {
              div.transition()
                .duration(500)
                .style('opacity', 0);
            }
          });
      }

    });

  }

  get data() {
    return this._data;
  }

  @Input('data')
  set data(value) {
    this._data = value;
    this.onResize();
  }
}

