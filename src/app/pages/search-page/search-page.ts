import { Component, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { suggestTerms } from '../../core/utils/search.util';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HighlightSearchPipe } from '../../core/pipes/highlight.pipe';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-search-page',
  imports: [
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ReactiveFormsModule,
    CardModule,
    HighlightSearchPipe,
    JsonPipe,
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
  standalone: true,
})
export class SearchPage {
  public searchControl = new FormControl('');
  public query = signal('');

  public allTerms = ['gros', 'gras', 'graisse', 'agressif', 'go', 'ros', 'gro'];

  suggestions = signal<{ term: string; diff: number; lenDelta: number }[]>([]);

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.query.set((v ?? '').toString().trim().toLowerCase()));

    effect(() => {
      const q = this.query();
      this.suggestions.set(q ? suggestTerms(q, this.allTerms, 5) : []);
    });
  }
}
