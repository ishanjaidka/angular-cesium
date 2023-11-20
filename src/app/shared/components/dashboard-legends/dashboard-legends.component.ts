import { Component, Inject } from '@angular/core';
import { GlobalStoreService } from '../../services/global-store.service';
import { DashboardView } from '../../../enums/dashboard-view.enum';

@Component({
  selector: 'app-dashboard-legends',
  templateUrl: './dashboard-legends.component.html',
  styleUrls: ['./dashboard-legends.component.scss']
})
export class DashboardLegendsComponent {
  public dashboardViews: string[] = [DashboardView.MapView, DashboardView.NormalView];
  public currentDashboardView: string = this.dashboardViews[0];
  constructor(@Inject(GlobalStoreService) private globalStoreService: GlobalStoreService) {
    this.globalStoreService.setDashboardView(this.currentDashboardView);
  }

  onDashboardViewChanged() {
    this.globalStoreService.setDashboardView(this.currentDashboardView);
  }
}
