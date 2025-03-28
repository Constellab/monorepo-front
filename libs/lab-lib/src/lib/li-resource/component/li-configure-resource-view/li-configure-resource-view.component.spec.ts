import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiConfigureResourceViewComponent } from './li-configure-resource-view.component';

describe('BioxConfigureResourceViewComponent', () => {
  let component: LiConfigureResourceViewComponent;
  let fixture: ComponentFixture<LiConfigureResourceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiConfigureResourceViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiConfigureResourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
