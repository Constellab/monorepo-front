import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabTagListComponent } from './lab-tag-list.component';

describe('LabTagListComponent', () => {
  let component: LabTagListComponent;
  let fixture: ComponentFixture<LabTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LabTagListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LabTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
