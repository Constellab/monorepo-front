import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RvViewStreamlitComponent} from './rv-view-streamlit.component';

describe('RvViewStreamlitComponent', () => {
  let component: RvViewStreamlitComponent;
  let fixture: ComponentFixture<RvViewStreamlitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RvViewStreamlitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RvViewStreamlitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
