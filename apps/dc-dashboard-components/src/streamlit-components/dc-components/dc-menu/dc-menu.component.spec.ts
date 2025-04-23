import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcMenuComponent } from './dc-menu.component';

describe('DcMenuComponent', () => {
  let component: DcMenuComponent;
  let fixture: ComponentFixture<DcMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
