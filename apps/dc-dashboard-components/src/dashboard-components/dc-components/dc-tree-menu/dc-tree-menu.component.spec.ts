import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcTreeMenuComponent } from './dc-tree-menu.component';

describe('DcTreeMenuComponent', () => {
  let component: DcTreeMenuComponent;
  let fixture: ComponentFixture<DcTreeMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcTreeMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcTreeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
