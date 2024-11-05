import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTimestampComponent } from './te-timestamp.component';

describe('TeTimestrampComponent', () => {
  let component: TeTimestampComponent;
  let fixture: ComponentFixture<TeTimestampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTimestampComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTimestampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
