import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HaAgentCreateDialogComponent } from './ha-agent-create-dialog.component';

describe('HaAgentCreateDialogComponent', () => {
  let component: HaAgentCreateDialogComponent;
  let fixture: ComponentFixture<HaAgentCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HaAgentCreateDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HaAgentCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
