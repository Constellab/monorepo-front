import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoUserInlineComponent } from './co-user-inline.component';

describe('CoUserInlineComponent', () => {
  let component: CoUserInlineComponent;
  let fixture: ComponentFixture<CoUserInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoUserInlineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoUserInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
