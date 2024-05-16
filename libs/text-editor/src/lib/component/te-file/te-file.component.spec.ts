import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeFileComponent} from './te-file.component';

describe('TeFileComponent', () => {
  let component: TeFileComponent;
  let fixture: ComponentFixture<TeFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
