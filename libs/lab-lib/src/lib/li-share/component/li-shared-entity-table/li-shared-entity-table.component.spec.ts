import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSharedEntityTableComponent } from './li-shared-entity-table.component';

describe('LiSharedEntityTableComponent', () => {
  let component: LiSharedEntityTableComponent;
  let fixture: ComponentFixture<LiSharedEntityTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiSharedEntityTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiSharedEntityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
