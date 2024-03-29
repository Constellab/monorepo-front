import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaServerCloudSearchFormComponent} from './ca-server-cloud-search-form.component';

describe('CaServerInfoSearchFormComponent', () => {
  let component: CaServerCloudSearchFormComponent;
  let fixture: ComponentFixture<CaServerCloudSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerCloudSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerCloudSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
