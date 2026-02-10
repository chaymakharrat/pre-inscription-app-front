import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardScolariteComponent } from './dashboard-scolarite.component';

describe('DashboardScolariteComponent', () => {
  let component: DashboardScolariteComponent;
  let fixture: ComponentFixture<DashboardScolariteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardScolariteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardScolariteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
