import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceCardComponent } from './li-resource-card.component';

describe('BioxResourceCardComponent', () => {
  let component: LiResourceCardComponent;
  let fixture: ComponentFixture<LiResourceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
