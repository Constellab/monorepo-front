import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabViewSearchPageComponent } from './lab-view-search-page.component';

describe('LabViewboxPageComponent', () => {
  let component: LabViewSearchPageComponent;
  let fixture: ComponentFixture<LabViewSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabViewSearchPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabViewSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
