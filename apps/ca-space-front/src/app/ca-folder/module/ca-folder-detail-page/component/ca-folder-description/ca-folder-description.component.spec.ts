import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderDescriptionComponent } from './ca-folder-description.component';

describe('CaFolderDescriptionComponent', () => {
  let component: CaFolderDescriptionComponent;
  let fixture: ComponentFixture<CaFolderDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderDescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
