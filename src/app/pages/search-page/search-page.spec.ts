import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';

import { SearchPage } from './search-page';

describe('SearchPage (zoneless)', () => {
  let fixture: ComponentFixture<SearchPage>;
  let component: SearchPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates query when typing', async () => {
    const inputDe = fixture.debugElement.query(By.css('input'));
    const input: HTMLInputElement = inputDe.nativeElement;

    input.value = 'gros';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    await fixture.whenStable();
    await fixture.whenRenderingDone();

    expect(component.query()).toBe('gros');
  });

  it('computes suggestions when query changes', async () => {
    component.searchControl.setValue('gros');
    fixture.detectChanges();

    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const suggestions = component.suggestions();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0].term).toBe('gros');
  });

  it('renders suggestions into the DOM', async () => {
    component.searchControl.setValue('gros');
    fixture.detectChanges();

    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ul li'));
    const texts = items.map((li) => (li.nativeElement as HTMLLIElement).textContent!.trim());

    expect(texts.length).toBeGreaterThanOrEqual(1);
    expect(texts[0]).toBe('gros (Match parfait )');
  });

  it('hides list when query is empty', async () => {
    component.searchControl.setValue('');
    fixture.detectChanges();

    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    const ul = fixture.debugElement.query(By.css('ul'));
    expect(ul).toBeNull();
  });
});
