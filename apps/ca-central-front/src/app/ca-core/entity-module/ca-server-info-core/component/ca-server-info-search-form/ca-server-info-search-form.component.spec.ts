import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaServerInfoSearchFormComponent} from './ca-server-info-search-form.component';

describe('CaServerInfoSearchFormComponent', () => {
  let component: CaServerInfoSearchFormComponent;
  let fixture: ComponentFixture<CaServerInfoSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerInfoSearchFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerInfoSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
