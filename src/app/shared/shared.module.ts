import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CesiumDirective } from './directives/cesium.directive';
import { DashboardLegendsComponent } from './components/dashboard-legends/dashboard-legends.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    SpinnerComponent,
    CesiumDirective,
    DashboardLegendsComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    MaterialModule,
    SpinnerComponent,
    CesiumDirective,
    DashboardLegendsComponent,
    TranslateModule
  ],
})
export class SharedModule { }
