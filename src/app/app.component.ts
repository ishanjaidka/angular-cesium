import { Component, Inject, OnInit } from '@angular/core';
import { Configurations } from './models/Configurations.model';
import { TranslateService } from '@ngx-translate/core';
import enJson from './i18n/en.json';

declare var window: { config: Configurations };
const config: Configurations = window.config;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = config.title;

  constructor(@Inject(TranslateService) private readonly translateService: TranslateService,) {
  }

  public ngOnInit(): void {
    this.initTranslations();
  }


  initTranslations() {
    this.translateService.setTranslation('en', { ...enJson });
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }
}
