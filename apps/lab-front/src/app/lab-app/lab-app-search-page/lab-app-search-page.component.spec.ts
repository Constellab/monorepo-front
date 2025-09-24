import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabAppSearchPageComponent } from './lab-app-search-page.component';

describe('LabAppSearchPageComponent', () => {
  let component: LabAppSearchPageComponent;
  let fixture: ComponentFixture<LabAppSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabAppSearchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabAppSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
