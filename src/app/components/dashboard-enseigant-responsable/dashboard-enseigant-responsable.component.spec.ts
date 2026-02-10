import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEnseigantResponsableComponent } from './dashboard-enseigant-responsable.component';

describe('DashboardEnseigantResponsableComponent', () => {
  let component: DashboardEnseigantResponsableComponent;
  let fixture: ComponentFixture<DashboardEnseigantResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEnseigantResponsableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardEnseigantResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
