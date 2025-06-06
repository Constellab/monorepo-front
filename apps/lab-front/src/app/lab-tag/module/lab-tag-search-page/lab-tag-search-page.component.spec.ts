import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTagSearchPageComponent } from './lab-tag-search-page.component';

describe('LabTagSearchPageComponent', () => {
  let component: LabTagSearchPageComponent;
  let fixture: ComponentFixture<LabTagSearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTagSearchPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTagSearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
