import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersManagementComponentComponent } from './users-management-component.component';

describe('UsersManagementComponentComponent', () => {
  let component: UsersManagementComponentComponent;
  let fixture: ComponentFixture<UsersManagementComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersManagementComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersManagementComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
