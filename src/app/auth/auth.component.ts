import { Component } from '@angular/core';
import { Configurations } from '../models/Configurations.model';

declare var window: { config: Configurations };
const config: Configurations = window.config;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  footer = config.footer;
  constructor() {
  }
}
