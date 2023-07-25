import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaAdminServerInfoPageComponent} from './ca-admin-server-info-page.component';

describe('CaAdminServerInfoPageComponent', () => {
  let component: CaAdminServerInfoPageComponent;
  let fixture: ComponentFixture<CaAdminServerInfoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminServerInfoPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminServerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
