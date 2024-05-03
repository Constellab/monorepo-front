import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeMentionPortalComponent} from './te-mention-portal.component';

describe('TeMentionPortalComponent', () => {
  let component: TeMentionPortalComponent;
  let fixture: ComponentFixture<TeMentionPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeMentionPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeMentionPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
