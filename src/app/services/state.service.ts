import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { NcrReport } from '../model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private bulkNcr = new BehaviorSubject<any>(null);
  currentBulkNcr = this.bulkNcr.asObservable();

  private bulkNcrFiltered = new BehaviorSubject<any>(null);
  currentBulkNcrFiltered = this.bulkNcrFiltered.asObservable();

  private ncr = new BehaviorSubject<any>(null);
  currentNCR = this.ncr.asObservable();

  private title = new BehaviorSubject<string>("");
  currentTitle = this.title.asObservable();

  private scrollPosition = new BehaviorSubject<number>(0);
  currentScrollPosition = this.scrollPosition.asObservable();

  private blocking = new BehaviorSubject<number>(0);
  currentBlocking = this.blocking.asObservable();
  constructor() { }

  setTitle(o) {
    this.title.next(o);
  }

  setScrollPosition(o){
    this.scrollPosition.next(o);
  }

  setBlocking(o){
    this.blocking.next(o);
  }

  setNCR(o){
    this.ncr.next(o);
  }

  setBulkNcr(o){
    this.bulkNcr.next(o);
  }

  setBulkNcrFiltered(o){
    this.bulkNcrFiltered.next(o);
  }
}
