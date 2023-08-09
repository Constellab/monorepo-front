import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectUserConfigDialogComponent} from './ca-project-user-config-dialog.component';

describe('CaProjectUserConfigDialogComponent', () => {
  let component: CaProjectUserConfigDialogComponent;
  let fixture: ComponentFixture<CaProjectUserConfigDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaProjectUserConfigDialogComponent]
    });
    fixture = TestBed.createComponent(CaProjectUserConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
