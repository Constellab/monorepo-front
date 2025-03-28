import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagEntityDetailComponent } from './li-tag-entity-detail.component';

describe('LabTagDetailComponent', () => {
  let component: LiTagEntityDetailComponent;
  let fixture: ComponentFixture<LiTagEntityDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagEntityDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiTagEntityDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
