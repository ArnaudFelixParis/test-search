import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchPage } from './pages/search-page/search-page';

@Component({
  selector: 'app-root',
  imports: [SearchPage],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('test-search');
}
