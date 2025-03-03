import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaCommunityAppCreateDialogComponent } from './ha-community-app-create-dialog.component';

describe('HaCommunityAppCreateDialogComponent', () => {
  let component: HaCommunityAppCreateDialogComponent;
  let fixture: ComponentFixture<HaCommunityAppCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HaCommunityAppCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaCommunityAppCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
