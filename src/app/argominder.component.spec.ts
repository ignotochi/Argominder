import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArgoMinderComponent } from './argominder.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ArgoMinderComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(ArgoMinderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'zmLive'`, () => {
    const fixture = TestBed.createComponent(ArgoMinderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('zmLive');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(ArgoMinderComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to zmLive!');
  });
});
