import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoDeprecatedTagComponent } from './co-deprecated-tag.component';

describe('CoDeprecatedTagComponent', () => {
  let component: CoDeprecatedTagComponent;
  let fixture: ComponentFixture<CoDeprecatedTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoDeprecatedTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoDeprecatedTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
