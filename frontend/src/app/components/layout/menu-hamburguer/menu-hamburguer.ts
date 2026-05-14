import { Component, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-hamburguer',
  imports: [RouterLink],
  templateUrl: './menu-hamburguer.html',
  styleUrl: './menu-hamburguer.scss',
})
export class MenuHamburguer {
  menuOpen = false;

  constructor(private renderer: Renderer2) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const bars = document.querySelectorAll('.bar');  // Selecionando as barras do hambúrguer

    if (this.menuOpen) {
      // Adiciona a transformação para criar o "X"
      this.renderer.setStyle(bars[0], 'transform', 'rotate(45deg) translateY(15px)');
      this.renderer.setStyle(bars[1], 'opacity', '0');
      this.renderer.setStyle(bars[2], 'transform', 'rotate(-45deg) translateY(-15px)');
    } else {
      // Volta ao estado original
      this.renderer.setStyle(bars[0], 'transform', 'none');
      this.renderer.setStyle(bars[1], 'opacity', '1');
      this.renderer.setStyle(bars[2], 'transform', 'none');
    }
  }
}
