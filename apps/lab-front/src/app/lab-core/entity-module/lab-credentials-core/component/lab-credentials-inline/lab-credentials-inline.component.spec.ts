import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabCredentialsInlineComponent } from './lab-credentials-inline.component';

describe('LabCredentialsInlineComponent', () => {
  let component: LabCredentialsInlineComponent;
  let fixture: ComponentFixture<LabCredentialsInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabCredentialsInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabCredentialsInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
