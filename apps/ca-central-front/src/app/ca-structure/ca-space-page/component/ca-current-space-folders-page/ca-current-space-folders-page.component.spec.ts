import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaCurrentSpaceFoldersPageComponent } from './ca-current-space-folders-page.component';

describe('CaCurrentSpaceCaFoldersPageComponent', () => {
  let component: CaCurrentSpaceFoldersPageComponent;
  let fixture: ComponentFixture<CaCurrentSpaceFoldersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaCurrentSpaceFoldersPageComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaCurrentSpaceFoldersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
