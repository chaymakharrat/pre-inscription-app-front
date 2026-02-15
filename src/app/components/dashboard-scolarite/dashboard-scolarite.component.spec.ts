import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScolariteDashboardComponent } from './dashboard-scolarite.component';

describe('ScolariteDashboardComponent', () => {
  let component: ScolariteDashboardComponent;
  let fixture: ComponentFixture<ScolariteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScolariteDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScolariteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
