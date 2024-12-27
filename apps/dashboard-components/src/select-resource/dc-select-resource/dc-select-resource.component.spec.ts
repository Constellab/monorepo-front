import { TestBed } from '@angular/core/testing';
import { DcSelectResourceComponent } from './dc-select-resource.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcSelectResourceComponent, NxWelcomeComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DcSelectResourceComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome dashboard-components');
  });

  it(`should have as title 'dashboard-components'`, () => {
    const fixture = TestBed.createComponent(DcSelectResourceComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dashboard-components');
  });
});
