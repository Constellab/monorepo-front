import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaResourceDetailPageComponent } from './ca-resource-detail-page.component';

describe('CaResourceDetailPageComponent', () => {
  let component: CaResourceDetailPageComponent;
  let fixture: ComponentFixture<CaResourceDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaResourceDetailPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaResourceDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
