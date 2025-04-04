import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcProcessConfigComponent } from './dc-process-config.component';

describe('DcProcessConfigComponent', () => {
  let component: DcProcessConfigComponent;
  let fixture: ComponentFixture<DcProcessConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcProcessConfigComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcProcessConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
