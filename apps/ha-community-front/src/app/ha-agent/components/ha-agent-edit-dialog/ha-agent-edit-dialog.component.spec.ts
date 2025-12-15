import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentEditDialogComponent } from './ha-agent-edit-dialog.component';

describe('HaAgentEditDialogComponent', () => {
  let component: HaAgentEditDialogComponent;
  let fixture: ComponentFixture<HaAgentEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentEditDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAgentEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
