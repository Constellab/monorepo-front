import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TeLinkDialogComponent} from './te-link-dialog.component';

describe('FlTextEditorLinkDialogComponent', () => {
  let component: TeLinkDialogComponent;
  let fixture: ComponentFixture<TeLinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeLinkDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
