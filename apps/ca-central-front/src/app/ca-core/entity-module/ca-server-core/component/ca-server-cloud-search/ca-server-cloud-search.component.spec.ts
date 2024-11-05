import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaServerCloudSearchComponent } from './ca-server-cloud-search.component';

describe('CaServerInfoSearchComponent', () => {
  let component: CaServerCloudSearchComponent;
  let fixture: ComponentFixture<CaServerCloudSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerCloudSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerCloudSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
