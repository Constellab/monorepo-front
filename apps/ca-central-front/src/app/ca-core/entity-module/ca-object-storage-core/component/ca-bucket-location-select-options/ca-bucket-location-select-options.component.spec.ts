import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaBucketLocationSelectOptionsComponent} from './ca-bucket-location-select-options.component';

describe('CaBucketLocationSelectOptionsComponent', () => {
  let component: CaBucketLocationSelectOptionsComponent;
  let fixture: ComponentFixture<CaBucketLocationSelectOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaBucketLocationSelectOptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaBucketLocationSelectOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
