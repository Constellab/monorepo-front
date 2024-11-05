import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeTitlesListComponent } from './te-titles-list.component';

describe('TeTitlesListComponent', () => {
  let component: TeTitlesListComponent;
  let fixture: ComponentFixture<TeTitlesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeTitlesListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeTitlesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
