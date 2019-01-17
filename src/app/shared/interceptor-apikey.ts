import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class InterceptorApikey implements HttpInterceptor {

  constructor(private  injector: Injector) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({headers: req.headers.set('Access-Control-Allow-Origin', '*')});
    req = req.clone({headers: req.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')});
    req = req.clone({headers: req.headers.set('Access-Control-Allow-Headers', '*')});
    console.log(req);
    return next.handle(req);
  }
}
