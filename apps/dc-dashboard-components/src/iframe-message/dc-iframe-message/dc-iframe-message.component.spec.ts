import { TestBed } from '@angular/core/testing';
import { DcIframeMessageComponent } from './dc-iframe-message.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcIframeMessageComponent, NxWelcomeComponent, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(DcIframeMessageComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome dashboard-components');
  });

  it(`should have as title 'dashboard-components'`, () => {
    const fixture = TestBed.createComponent(DcIframeMessageComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('dashboard-components');
  });
});
