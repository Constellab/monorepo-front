import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiShareLinkTableComponent } from './li-share-link-table.component';

describe('LiShareLinkTableComponent', () => {
  let component: LiShareLinkTableComponent;
  let fixture: ComponentFixture<LiShareLinkTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiShareLinkTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiShareLinkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
