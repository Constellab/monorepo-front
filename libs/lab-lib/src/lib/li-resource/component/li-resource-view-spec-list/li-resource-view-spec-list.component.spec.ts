import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceViewSpecListComponent } from './li-resource-view-spec-list.component';

describe('LiResourceViewSpecListComponent', () => {
  let component: LiResourceViewSpecListComponent;
  let fixture: ComponentFixture<LiResourceViewSpecListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewSpecListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiResourceViewSpecListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
