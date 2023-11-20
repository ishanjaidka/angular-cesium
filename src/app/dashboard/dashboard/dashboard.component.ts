import { Component, Inject, OnDestroy } from '@angular/core';
import { GlobalStoreService } from '../../shared/services/global-store.service';
import { Subscription } from 'rxjs';
import { DashboardView } from '../../enums/dashboard-view.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  private dashboardViewSubscription!: Subscription;
  public dashboardEnum = DashboardView;
  public currentDashboardView!: string;
  constructor(@Inject(GlobalStoreService) private globalStoreService: GlobalStoreService) {
    this.dashboardViewSubscription = this.globalStoreService.currentDashboard$.subscribe((currentView) => {
      this.currentDashboardView = currentView;
    });
  }

  ngOnDestroy() {
    this.dashboardViewSubscription.unsubscribe();
  }
}
