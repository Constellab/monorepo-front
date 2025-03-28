import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiVenvTableComponent } from './li-venv-table.component';

describe('LiVenvTableComponent', () => {
  let component: LiVenvTableComponent;
  let fixture: ComponentFixture<LiVenvTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiVenvTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiVenvTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
