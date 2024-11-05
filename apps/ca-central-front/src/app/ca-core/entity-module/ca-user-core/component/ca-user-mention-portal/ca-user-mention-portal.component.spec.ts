import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaUserMentionPortalComponent } from './ca-user-mention-portal.component';

describe('CaUserMentionPortalComponent', () => {
  let component: CaUserMentionPortalComponent;
  let fixture: ComponentFixture<CaUserMentionPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaUserMentionPortalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaUserMentionPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
