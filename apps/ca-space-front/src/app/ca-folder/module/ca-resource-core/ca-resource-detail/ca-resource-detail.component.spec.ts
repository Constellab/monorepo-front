import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaResourceDetailComponent } from './ca-resource-detail.component';

describe('CaResourceDetailComponent', () => {
  let component: CaResourceDetailComponent;
  let fixture: ComponentFixture<CaResourceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaResourceDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaResourceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
