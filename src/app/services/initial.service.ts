import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../app-config';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InitialService {

  config: any;
  constructor(private httpClient: HttpClient, private app_config: AppConfig) {
    this.config = this.app_config.get();
  }

  getJSON(filejson: string): Observable<any> {
    return this.httpClient.get("assets/jsonatte/" + filejson);
  }

  getConfig() {
    return this.app_config.get();
  }

  getInitialMaster() {
    // let token: any;
    // token = JSON.parse(localStorage.getItem('currentUser'));
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.get<any>(this.config.Api.global_api + "/enum/", { headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getMasterProject(criteria:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/project/cr/", criteria,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  postMasterProject(obj:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/project/", obj,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  upsertMasterProject(obj:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/project/post/upsert/", obj,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getMasterPic(criteria:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/pic/cr/", criteria,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getMasterUser(criteria:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/users/cr/", criteria,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
  
  getMasterLocation(criteria:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/location/cr/", criteria,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }

  getMasterRules(criteria:any) {
    let _headers = new HttpHeaders().set('Content-Type', 'application/json');
    const headers = _headers.append('x-access-token', "ad");
    return this.httpClient.post<any>(this.config.Api.global_api + "/rules/cr/", criteria,{ headers: headers }).pipe(
      map(
        res => {
          return res;
        }
      ));
  }
}
