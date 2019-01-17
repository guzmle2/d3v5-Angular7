import {AfterViewInit, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';
import * as d3 from 'd3';

export class CommonGraph implements OnInit, AfterViewInit, OnChanges {
  @Input() data: any;
  @Input() width;
  @Input() height;
  id = 'id_' + new Date().getTime();
  lastEle: any;

  t: any;

  constructor(protected el: ElementRef, protected renderer: Renderer2) {
    this.lastEle = this.el;
  }

  ngAfterViewInit(): void {
    this.renderGraph();
    this.t = d3.transition()
      .duration(750);
  }

  renderGraph() {

  }

  ngOnInit(): void {
  }

  get widthNative() {

    const bounds = this.el.nativeElement.getBoundingClientRect();
    const width = bounds.width - 20;
    const height = bounds.height - 20;
    return width;
  }

  get heightNative() {
    const bounds = this.el.nativeElement.getBoundingClientRect();
    const width = bounds.width - 20;
    const height = bounds.height - 20;
    // return this.el.nativeElement.offsetHeight;
    return height;
  }

  get random_bg_color() {
    const x = Math.floor(Math.random() * 256);
    const y = Math.floor(Math.random() * 256);
    const z = Math.floor(Math.random() * 256);
    const bgColor = 'rgba(' + x + ',' + y + ',' + z + ',' + 0.5 + ')';
    return bgColor;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    if (this.el.nativeElement.children.length) {
      this.el.nativeElement.removeChild(this.el.nativeElement.children[0]);
      d3.select(this.el.nativeElement).selectAll('*').remove();
      this.renderGraph();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onResize();
  }
}
