import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoAgentCreateDialogFormComponent } from './co-agent-create-dialog-form.component';

describe('CoAgentCreateDialogFormComponent', () => {
  let component: CoAgentCreateDialogFormComponent;
  let fixture: ComponentFixture<CoAgentCreateDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoAgentCreateDialogFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoAgentCreateDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
