import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LabCredentialsTableComponent} from './lab-credentials-table.component';

describe('LabCredentialsTableComponent', () => {
  let component: LabCredentialsTableComponent;
  let fixture: ComponentFixture<LabCredentialsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabCredentialsTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabCredentialsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
