import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaProjectDetailInfoComponent } from './ca-project-detail-info.component';

describe('CaProjectDetailInfoComponent', () => {
  let component: CaProjectDetailInfoComponent;
  let fixture: ComponentFixture<CaProjectDetailInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaProjectDetailInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaProjectDetailInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
