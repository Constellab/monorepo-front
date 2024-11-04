import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentEditStyleDialogComponent } from './ha-agent-edit-style-dialog.component';

describe('HaAgentEditStyleDialogComponent', () => {
  let component: HaAgentEditStyleDialogComponent;
  let fixture: ComponentFixture<HaAgentEditStyleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentEditStyleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HaAgentEditStyleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
