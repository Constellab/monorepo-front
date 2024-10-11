import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoAgentListItemComponent } from './co-agent-list-item.component';

describe('CoAgentListItemComponent', () => {
  let component: CoAgentListItemComponent;
  let fixture: ComponentFixture<CoAgentListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoAgentListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoAgentListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
