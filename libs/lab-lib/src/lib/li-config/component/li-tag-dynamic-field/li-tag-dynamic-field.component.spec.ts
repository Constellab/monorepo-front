import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagDynamicFieldComponent } from './li-tag-dynamic-field.component';

describe('LiTagDynamicFieldComponent', () => {
  let component: LiTagDynamicFieldComponent;
  let fixture: ComponentFixture<LiTagDynamicFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagDynamicFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagDynamicFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
