import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaLabFreeInfoComponent } from './ca-lab-free-info.component';

describe('LabFreeInfoComponent', () => {
  let component: CaLabFreeInfoComponent;
  let fixture: ComponentFixture<CaLabFreeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabFreeInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaLabFreeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
