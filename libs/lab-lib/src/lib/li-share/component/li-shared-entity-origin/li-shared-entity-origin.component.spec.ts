import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSharedEntityOriginComponent } from './li-shared-entity-origin.component';

describe('LabResourceShareOriginComponent', () => {
  let component: LiSharedEntityOriginComponent;
  let fixture: ComponentFixture<LiSharedEntityOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSharedEntityOriginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSharedEntityOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
