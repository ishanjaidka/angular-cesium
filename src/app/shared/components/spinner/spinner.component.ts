import { Component, OnDestroy } from '@angular/core';
import { GlobalStoreService } from '../../services/global-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnDestroy {
  loading: boolean = true;
  loadingSubscriber: Subscription;
  constructor(public globalStoreService: GlobalStoreService) {
    this.loadingSubscriber = this.globalStoreService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  ngOnDestroy() {
    this.loadingSubscriber?.unsubscribe();
  }
}
