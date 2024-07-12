import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrProcessInfoDialogComponent } from './pr-process-info-dialog.component';

describe('PrProcessInfoDialogComponent', () => {
  let component: PrProcessInfoDialogComponent;
  let fixture: ComponentFixture<PrProcessInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrProcessInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrProcessInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
