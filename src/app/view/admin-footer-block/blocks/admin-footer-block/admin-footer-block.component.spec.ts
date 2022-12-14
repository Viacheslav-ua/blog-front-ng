import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFooterBlockComponent } from './admin-footer-block.component';

describe('AdminFooterBlockComponent', () => {
  let component: AdminFooterBlockComponent;
  let fixture: ComponentFixture<AdminFooterBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFooterBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFooterBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
