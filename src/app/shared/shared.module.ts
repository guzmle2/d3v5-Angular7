import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AreaGraphDirective} from './graph/area-graph.directive';
import {PieChartDirective} from './graph/pie-chart.directive';
import {LineGraphDirective} from './graph/line-graph.directive';
import {BarVerticalDirective} from './graph/bar-vertical.directive';
import {BarHorizontalDirective} from './graph/bar-horizontal.directive';
import {DashboardService} from '../dashboard/dashboard.service';
import {MapGraphDirective} from './graph/map-graph.directive';

@NgModule({
  declarations: [
    AreaGraphDirective,
    PieChartDirective,
    LineGraphDirective,
    BarVerticalDirective,
    BarHorizontalDirective,
    MapGraphDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    AreaGraphDirective,
    PieChartDirective,
    LineGraphDirective,
    BarVerticalDirective,
    BarHorizontalDirective,
    MapGraphDirective
  ],
  providers: [
    DashboardService,

  ]
})
export class SharedModule {
}
