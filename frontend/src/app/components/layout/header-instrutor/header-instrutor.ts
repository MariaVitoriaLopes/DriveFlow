import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-instrutor',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header-instrutor.html',
  styleUrl: './header-instrutor.scss',
})
export class HeaderInstrutor {
  menuAberto = false;
    private router = inject(Router);

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

  
encerrarSessao() {
  localStorage.clear();
  sessionStorage.clear();

  alert('Sua sessão foi encerrada!');

  this.router.navigate(['/login']);
}
}