import { Component, signal } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { Header } from './components/layout/header/header';
import { Footer } from './components/layout/footer/footer';
import { MenuHamburguer } from './components/layout/menu-hamburguer/menu-hamburguer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, MenuHamburguer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('driveFlow');
}

