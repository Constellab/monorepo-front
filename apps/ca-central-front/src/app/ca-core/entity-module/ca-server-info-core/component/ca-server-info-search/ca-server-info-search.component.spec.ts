import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaServerInfoSearchComponent} from './ca-server-info-search.component';

describe('CaServerInfoSearchComponent', () => {
  let component: CaServerInfoSearchComponent;
  let fixture: ComponentFixture<CaServerInfoSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerInfoSearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerInfoSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
