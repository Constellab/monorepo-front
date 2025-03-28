import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiSyncObjectButtonComponent } from './li-sync-object-button.component';

describe('LiSyncObjectButtonComponent', () => {
  let component: LiSyncObjectButtonComponent;
  let fixture: ComponentFixture<LiSyncObjectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSyncObjectButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiSyncObjectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
