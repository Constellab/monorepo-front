import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaRootFoldersPageComponent } from './ca-root-folders-page.component';

describe('CaMyFolder2Component', () => {
  let component: CaRootFoldersPageComponent;
  let fixture: ComponentFixture<CaRootFoldersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaRootFoldersPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaRootFoldersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
