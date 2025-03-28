import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceViewHistoricComponent } from './li-resource-view-historic.component';

describe('LiResourceViewHistoricComponent', () => {
  let component: LiResourceViewHistoricComponent;
  let fixture: ComponentFixture<LiResourceViewHistoricComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewHistoricComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceViewHistoricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
