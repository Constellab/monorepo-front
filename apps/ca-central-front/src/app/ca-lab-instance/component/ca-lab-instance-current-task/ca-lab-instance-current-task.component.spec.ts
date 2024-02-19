import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaLabInstanceCurrentTaskComponent} from './ca-lab-instance-current-task.component';

describe('CaLabInstanceCurrentTaskComponent', () => {
  let component: CaLabInstanceCurrentTaskComponent;
  let fixture: ComponentFixture<CaLabInstanceCurrentTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabInstanceCurrentTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabInstanceCurrentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
