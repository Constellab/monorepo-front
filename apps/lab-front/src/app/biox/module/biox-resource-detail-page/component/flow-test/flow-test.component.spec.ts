import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowTestComponent } from './flow-test.component';

describe('FlowTestComponent', () => {
  let component: FlowTestComponent;
  let fixture: ComponentFixture<FlowTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
