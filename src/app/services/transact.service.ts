import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { AppConfig } from '../app-config';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactService {

  config: any;
  constructor(private httpClient: HttpClient, private app_config: AppConfig) {
    this.config = this.app_config.get();
  }

  postReport(obj) {
    // let token: any;
    // token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/report/", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  putReport(obj) {
    // let token: any;
    // token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.put<any>(this.config.Api.global_api + "/report/", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postReportProgress(obj) {
    // let token: any;
    // token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/reportprogress/", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postReportProgressDetail(obj) {
    // let token: any;
    // token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/reportprogressdetail/", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postUpload(fileToUpload: File, nameTag: string) {
    //let token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('x-access-token', "ad");
    const formData: FormData = new FormData();
    formData.append(nameTag, fileToUpload, fileToUpload.name);
    const options: {
      observe: 'events';
      reportProgress: boolean;
      headers: HttpHeaders;
    } = {
      reportProgress: true,
      observe: 'events',
      headers: _headers
    };
    const req = new HttpRequest('POST', this.config.Api.global_api + "/report/upload", formData, options);
    return this.httpClient.request(req).pipe(map(event => { return event }));
  }

  getReport(criteria: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/report/cr/", criteria, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getReportProgress(criteria: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/reportprogress/cr/", criteria, { headers: headers }).pipe()
  }

  getReportProgressDetail(criteria: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/reportprogressdetail/cr/", criteria, { headers: headers }).pipe()
  }

  putReportProgressDetail(obj: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.put<any>(this.config.Api.global_api + "/reportprogressdetail/", obj, { headers: headers }).pipe()
  }

  getPushNotif(criteria: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/pushnotif/cr/", criteria, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postPushData(obj: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/pushnotif/", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postPushNotif(obj: any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/pushnotif/notif/to", obj, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getReporting(criteria:any){
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/reporting/cr/", criteria, { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
}
