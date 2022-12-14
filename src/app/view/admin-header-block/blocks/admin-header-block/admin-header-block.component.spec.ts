import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeaderBlockComponent } from './admin-header-block.component';

describe('AdminHeaderBlockComponent', () => {
  let component: AdminHeaderBlockComponent;
  let fixture: ComponentFixture<AdminHeaderBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHeaderBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHeaderBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
