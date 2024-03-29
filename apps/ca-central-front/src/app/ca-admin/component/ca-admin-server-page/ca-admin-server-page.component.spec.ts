import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CaAdminServerPageComponent} from './ca-admin-server-page.component';

describe('CaAdminServerInfoPageComponent', () => {
  let component: CaAdminServerPageComponent;
  let fixture: ComponentFixture<CaAdminServerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaAdminServerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaAdminServerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
