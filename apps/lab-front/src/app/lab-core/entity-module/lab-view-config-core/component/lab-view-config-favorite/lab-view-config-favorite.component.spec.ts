import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LabViewConfigFavoriteComponent} from './lab-view-config-favorite.component';

describe('LabViewConfigFavoriteComponent', () => {
  let component: LabViewConfigFavoriteComponent;
  let fixture: ComponentFixture<LabViewConfigFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabViewConfigFavoriteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabViewConfigFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
