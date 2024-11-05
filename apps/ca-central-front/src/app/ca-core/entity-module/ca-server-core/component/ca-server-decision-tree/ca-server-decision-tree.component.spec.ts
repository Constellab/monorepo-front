import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaServerDecisionTreeComponent } from './ca-server-decision-tree.component';

describe('CaServerDecisionTreeComponent', () => {
  let component: CaServerDecisionTreeComponent;
  let fixture: ComponentFixture<CaServerDecisionTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaServerDecisionTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaServerDecisionTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
