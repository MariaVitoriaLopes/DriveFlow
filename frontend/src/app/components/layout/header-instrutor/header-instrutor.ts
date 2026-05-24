import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-instrutor',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header-instrutor.html',
  styleUrl: './header-instrutor.scss',
})
export class HeaderInstrutor {
  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenuMobile() {
    if (window.innerWidth <= 1024) {
      this.menuAberto = false;
    }
  }

  async compartilhar() {
    const link = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Meu site',
          text: 'Olha isso aqui',
          url: link
        });
      } 
      catch (erro) {
        console.log('Compartilhamento cancelado');
      }
    } 
    
    else {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(link);
      } else {
        const textarea = document.createElement('textarea');

        textarea.value = link;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      alert('Seu navegador não suporta compartilhamento. O link foi copiado!');
    }
  }
}