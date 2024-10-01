import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaLabCurrentTaskComponent } from './ca-lab-current-task.component';

describe('CaLabCurrentTaskComponent', () => {
  let component: CaLabCurrentTaskComponent;
  let fixture: ComponentFixture<CaLabCurrentTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaLabCurrentTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaLabCurrentTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
