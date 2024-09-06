import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaFolderCardComponent } from './ca-folder-card.component';

describe('CaFolderCardComponent', () => {
  let component: CaFolderCardComponent;
  let fixture: ComponentFixture<CaFolderCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaFolderCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaFolderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
