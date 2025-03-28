import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiNotesUsingResourceComponent } from './li-notes-using-resource.component';

describe('LiNotesUsingResourceComponent', () => {
  let component: LiNotesUsingResourceComponent;
  let fixture: ComponentFixture<LiNotesUsingResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiNotesUsingResourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiNotesUsingResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
