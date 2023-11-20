import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLegendsComponent } from './dashboard-legends.component';

describe('DashboardLegendsComponent', () => {
  let component: DashboardLegendsComponent;
  let fixture: ComponentFixture<DashboardLegendsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLegendsComponent]
    });
    fixture = TestBed.createComponent(DashboardLegendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
