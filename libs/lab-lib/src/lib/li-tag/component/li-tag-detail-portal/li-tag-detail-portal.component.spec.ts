import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagDetailPortalComponent } from './li-tag-detail-portal.component';

describe('LiTagDetailPortalComponent', () => {
  let component: LiTagDetailPortalComponent;
  let fixture: ComponentFixture<LiTagDetailPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagDetailPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagDetailPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
