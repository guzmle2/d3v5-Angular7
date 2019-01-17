import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(protected http: HttpClient) {
  }

  getData(): Observable<any> {
    const url = './assets/_search.json';
    return this.http.get(url)
      .pipe(
        map(a => a),
        catchError(e => this.handleError(e))
      );

  }

  getInfoIP(IP): Observable<any> {
    const url = environment.api_URL + IP + environment.TOKEN_IPINFO;
    return this.http.get(url)
      .pipe(
        map(a => a),
        catchError(e => this.handleError(e))
      );

  }

  dataWorld(): Observable<any> {
    const url = './assets/world-110m.json';
    return this.http.get(url)
      .pipe(
        map(a => a),
        catchError(e => this.handleError(e))
      );

  }


  handleError(error: any) {
    return throwError(error);
  }
}
