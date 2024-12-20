import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LmlDockerContainerErrorDialogComponent } from './lml-docker-container-error-dialog.component';

describe('LmlDockerContainerErrorDialogComponent', () => {
  let component: LmlDockerContainerErrorDialogComponent;
  let fixture: ComponentFixture<LmlDockerContainerErrorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LmlDockerContainerErrorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LmlDockerContainerErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
