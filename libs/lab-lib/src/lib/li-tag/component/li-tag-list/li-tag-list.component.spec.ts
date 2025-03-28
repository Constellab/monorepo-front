import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiTagListComponent } from './li-tag-list.component';

describe('LiTagListComponent', () => {
  let component: LiTagListComponent;
  let fixture: ComponentFixture<LiTagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiTagListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
