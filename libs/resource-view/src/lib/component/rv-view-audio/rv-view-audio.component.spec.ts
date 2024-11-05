import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvViewAudioComponent } from './rv-view-audio.component';

describe('RvViewAudioComponent', () => {
  let component: RvViewAudioComponent;
  let fixture: ComponentFixture<RvViewAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewAudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RvViewAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
