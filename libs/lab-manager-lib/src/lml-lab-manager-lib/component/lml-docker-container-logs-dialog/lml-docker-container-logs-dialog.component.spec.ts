import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlDockerContainerLogsDialogComponent } from './lml-docker-container-logs-dialog.component';

describe('CaLabDockerContainerLogsComponent', () => {
  let component: LmlDockerContainerLogsDialogComponent;
  let fixture: ComponentFixture<LmlDockerContainerLogsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerContainerLogsDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LmlDockerContainerLogsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
