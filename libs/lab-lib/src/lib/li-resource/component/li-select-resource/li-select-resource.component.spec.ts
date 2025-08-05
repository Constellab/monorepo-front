import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiSelectResourceComponent } from './li-select-resource.component';

describe('LiSelectResourceComponent', () => {
  let component: LiSelectResourceComponent;
  let fixture: ComponentFixture<LiSelectResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiSelectResourceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LiSelectResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
