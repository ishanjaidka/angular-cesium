import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from "rxjs";
import { DashboardView } from '../../enums/dashboard-view.enum';

@Injectable({
  providedIn: 'root'
})
export class GlobalStoreService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<any>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  private authLayoutContent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public authLayoutContent$: Observable<string> = this.authLayoutContent.asObservable();

  // spinner
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public loading$: Observable<boolean> = this.loading.asObservable();

  // dashboard
  private currentDashboard: BehaviorSubject<string> = new BehaviorSubject<string>(DashboardView.MapView);
  public currentDashboard$: Observable<string> = this.currentDashboard.asObservable();

  constructor() {
  }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }


  // can be used later
  async checkIfUserIsVerified(userId: string) {

  }

  setLoading(loading: boolean) {
    this.loading.next(loading);
  }

  setDashboardView(dashboardView: string) {
    this.currentDashboard.next(dashboardView);
  }
}
