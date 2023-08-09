import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaProjectSharedListComponent} from './ca-project-shared-list.component';

describe('CaProjectSharedGroupsListComponent', () => {
  let component: CaProjectSharedListComponent;
  let fixture: ComponentFixture<CaProjectSharedListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaProjectSharedListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaProjectSharedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
