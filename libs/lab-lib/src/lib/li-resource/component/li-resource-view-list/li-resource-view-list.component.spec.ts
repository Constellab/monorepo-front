import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiResourceViewListComponent } from './li-resource-view-list.component';

describe('LabResourcesListComponent', () => {
  let component: LiResourceViewListComponent;
  let fixture: ComponentFixture<LiResourceViewListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiResourceViewListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiResourceViewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
