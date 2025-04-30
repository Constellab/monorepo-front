import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderInlineComponent } from './ca-folder-inline.component';

describe('CaFolderInlineComponent', () => {
  let component: CaFolderInlineComponent;
  let fixture: ComponentFixture<CaFolderInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderInlineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CaFolderInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
