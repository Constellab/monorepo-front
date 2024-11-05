import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoUpdateTypeIconFormComponent } from './co-update-type-icon-form.component';

describe('CoUpdateTypeIconDialogComponent', () => {
  let component: CoUpdateTypeIconFormComponent;
  let fixture: ComponentFixture<CoUpdateTypeIconFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoUpdateTypeIconFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoUpdateTypeIconFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
