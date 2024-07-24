import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaSelectProjectDialogComponent } from './ca-select-project-dialog.component';

describe('CaSelectProjectComponent', () => {
  let component: CaSelectProjectDialogComponent;
  let fixture: ComponentFixture<CaSelectProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaSelectProjectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaSelectProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
