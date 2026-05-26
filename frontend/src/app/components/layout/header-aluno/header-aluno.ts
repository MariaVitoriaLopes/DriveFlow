import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-aluno',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header-aluno.html',
  styleUrl: './header-aluno.scss',
})
export class HeaderAluno {
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

encerrarSessao() {
  localStorage.clear();
  sessionStorage.clear();

  alert('Sua sessão foi encerrada!');

  this.router.navigate(['/login']);
}
}