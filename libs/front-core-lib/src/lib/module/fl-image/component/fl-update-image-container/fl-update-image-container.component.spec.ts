import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlUpdateImageContainerComponent } from './fl-update-image-container.component';

describe('FlSelectImageComponent', () => {
  let component: FlUpdateImageContainerComponent;
  let fixture: ComponentFixture<FlUpdateImageContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlUpdateImageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlUpdateImageContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
