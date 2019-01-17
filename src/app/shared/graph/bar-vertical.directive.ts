import {AfterViewInit, Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {CommonGraph} from './common-graph';
import * as d3 from 'd3';

@Directive({
  selector: '[ibitsBarVertical]'
})
export class BarVerticalDirective extends CommonGraph implements AfterViewInit {
  @Input() key: any;
  @Input() value: any;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    super(el, renderer);
    this.renderer.addClass(this.el.nativeElement, 'line_bar');

  }

  renderGraph() {
    let width = this.widthNative;
    let height = this.heightNative;

    const svg = d3.select(this.el.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    width = width - 40;
    height = height - 40;
    const chart = svg.append('g')
      .attr('transform', `translate(${30}, ${10})`);

    const xScale = d3.scaleBand()
      .range([0, width])
      .domain(this.data.map((s) => s[this.key]))
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 100]);


    // @ts-ignore
    const makeYLines = () => d3.axisLeft()
      .scale(yScale);

    chart.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    chart.append('g')
      .call(d3.axisLeft(yScale));

    chart.append('g')
      .attr('class', 'grid')
      .call(makeYLines()
        .tickSize(-width, 0, 0)
        .tickFormat('')
      );

    const barGroups = chart.selectAll()
      .data(this.data)
      .enter()
      .append('g');


    barGroups
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (g) => xScale(g[this.key]))
      .attr('y', (g) => yScale(g[this.value]))
      .attr('prop-key', this.key)
      .attr('prop-value', this.value)
      .attr('height', (g) => height - yScale(g[this.value]))
      .attr('width', xScale.bandwidth())
      .on('mouseenter', function (actual, i) {

        const prop_key = this.getAttribute('prop-key');
        const prop_value = this.getAttribute('prop-value');

        d3.selectAll('.value')
          .attr('opacity', 0);

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 0.6)
          .attr('x', (a) => xScale(a[prop_key]) - 5)
          .attr('width', xScale.bandwidth() + 10);

        const y = yScale(actual[prop_value]);
        chart.append('line')
          .attr('id', 'limit')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', width)
          .attr('y2', y);

        barGroups.append('text')
          .attr('class', 'divergence')
          .attr('x', (a) => xScale(a[prop_key]) + xScale.bandwidth() / 2)
          .attr('y', (a) => yScale(a[prop_value]) + 30)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
          .text((a, idx) => {
            const divergence = (a[prop_value] - actual[prop_value]).toFixed(1);

            let text = Number(divergence) > 0 ? '+' : '';
            text += `${divergence}%`;

            return idx !== i ? text : '';
          });

      })
      .on('mouseleave', function () {


        const prop_key = this.getAttribute('prop-key');
        const prop_value = this.getAttribute('prop-value');
        d3.selectAll('.value')
          .attr('opacity', 1);

        d3.select(this)
          .transition()
          .duration(300)
          .attr('opacity', 1)
          .attr('x', (a) => xScale(a[prop_key]))
          .attr('width', xScale.bandwidth());

        chart.selectAll('#limit').remove();
        chart.selectAll('.divergence').remove();
      });



  }

}
