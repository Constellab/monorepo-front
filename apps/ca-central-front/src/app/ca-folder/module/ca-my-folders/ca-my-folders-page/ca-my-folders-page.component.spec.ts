import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CaMyFoldersPageComponent} from './ca-my-folders-page.component';

describe('MyCaFoldersPageComponent', () => {
  let component: CaMyFoldersPageComponent;
  let fixture: ComponentFixture<CaMyFoldersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaMyFoldersPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaMyFoldersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
