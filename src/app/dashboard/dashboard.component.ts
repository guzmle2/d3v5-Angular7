import {AfterViewInit, Component, Injector, OnInit} from '@angular/core';
import {DashboardService} from './dashboard.service';

@Component({
  selector: 'ibits-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  dashboardService = this.injector.get(DashboardService);
  dataArea;
  dataBarHorizontal;
  dataBarVertical;
  dataPie;
  dataLine;
  dataMap = [];
  dataOrigin: any;

  constructor(protected injector: Injector) {
  }

  ngOnInit() {
    this.getData();
  }


  getData() {
    this.dashboardService.getData().subscribe(e => {
      this.dataOrigin = e;
      this.loadIP(e);
      this.loadPie(e);
      this.loadArea(e);
      // this.loadBarVertical(e);
      // this.dataArea = this.transformData1(e, 'ioc_type');
      // this.dataBarHorizontal = this.transformData1(e, 'impact');
      // this.dataLine = this.transformData1(e, 'impact');
      // console.log('dataBarHorizontal', this.dataBarHorizontal);
      // console.log('dataLine', this.dataLine);
    });
  }

  loadIP(e, filter?) {
    if (!filter) {
      filter = 'ip';
    }
    this.dataMap = this.transformData1(e, filter);
    this.dataMap.map(e => {
      e.lat = this.getRandomInRange(-180, 180, 3);
      e.long = this.getRandomInRange(-90, 90, 3);
      e.radio = this.getRandomInRange(0, 20, 0);
      return e;
    });
  }

  loadPie(e, filter?) {
    if (!filter) {
      filter = 'category';
    }
    this.dataPie = [];
    const percent100 = e.hits.hits.length;
    const data = this.transformData1(e, filter);
    data.forEach(val => {
      const obj = {
        label: val[Object.keys(val).find(e => e !== 'source')],
        value: (val.source.length * 100) / percent100
      };
      obj.label += ' ' + obj.value + '%';
      this.dataPie.push(obj);
    });
  }

  loadLine(e, filter?) {
    this.dataLine = [];
    e.hits.hits.forEach(val => {
      const obj = {
        date: val._source.datetime,
        value: val._source.confidence < 0 ? 0 : val._source.confidence
      };
      if (this.dataLine.length <= 10) {
        this.dataLine.push(obj);
      }
    });
  }


  getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  }

  ngAfterViewInit() {
  }

  transformData1(res, keyAgroup) {
    const data = [];
    res.hits.hits.map(a => a._source).forEach(w => {
      const index = data.findIndex(e => e[keyAgroup] === w[keyAgroup]);
      if (index === -1) {
        const obj = <any>{};
        obj[keyAgroup] = w[keyAgroup];
        obj.source = [];
        obj.source.push(w);
        data.push(obj);
      } else {
        data[index].source.push(w);
      }
    });
    return data;
  }

  loadBarVertical(e: any) {
    this.dataBarVertical = [
      {
        language: 'Rust',
        value: 78.9,
        color: '#000000'
      },
      {
        language: 'Kotlin',
        value: 75.1,
        color: '#00a2ee'
      },
      {
        language: 'Python',
        value: 68.0,
        color: '#fbcb39'
      },
      {
        language: 'TypeScript',
        value: 67.0,
        color: '#007bc8'
      },
      {
        language: 'Go',
        value: 65.6,
        color: '#65cedb'
      },
      {
        language: 'Swift',
        value: 65.1,
        color: '#ff6e52'
      },
      {
        language: 'JavaScript',
        value: 61.9,
        color: '#f9de3f'
      },
      {
        language: 'C#',
        value: 60.4,
        color: '#5d2f8e'
      },
      {
        language: 'F#',
        value: 59.6,
        color: '#008fc9'
      },
      {
        language: 'Clojure',
        value: 59.6,
        color: '#507dca'
      }
    ];

  }

  loadArea(e, filter?) {
    this.dataArea = [];
    e.hits.hits.forEach(val => {
      const obj = {
        interval: val._source['@timestamp'],
        value: val._source.confidence < 0 ? 0 : val._source.confidence
      };
      if (this.dataArea.length <= 10) {
        this.dataArea.push(obj);
      }
    });
  }
}
