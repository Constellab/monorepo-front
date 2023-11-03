import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaCurrentSpaceOtherPageComponent} from './ca-current-space-other-page.component';

describe('CaCurrentSpaceOtherPageComponent', () => {
  let component: CaCurrentSpaceOtherPageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceOtherPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceOtherPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceOtherPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
