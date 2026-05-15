import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer,
    RouterLink
], // 👈 AQUI
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  frases = [
    'Aprenda a dirigir com um instrutor particular perto de você',
    'Conectamos quem quer aprender com quem sabe ensinar',
    'Seu instrutor de direção autônomo, a poucos cliques',
  ];

  index = signal(0);

  constructor() {
    this.iniciarLoop();
  }

  opacidade = signal(1);
  animando = signal(false);

  iniciarLoop() {
    setTimeout(() => {
      this.animando.set(true);
      this.opacidade.set(0);

      setTimeout(() => {
        this.index.update((i) => (i + 1) % this.frases.length);
        this.opacidade.set(1);
        this.animando.set(false);
      }, 400);

      this.iniciarLoop();
    }, 5000);
  }

  get fraseAtual() {
    return this.frases[this.index()];
  }

  tipoUsuario: 'aluno' | 'instrutor' = 'aluno';

  selecionar(tipo: 'aluno' | 'instrutor') {
    this.tipoUsuario = tipo;
  }

  perguntaAberta: number | null = null;

  toggle(index: number) {
    this.perguntaAberta = this.perguntaAberta === index ? null : index;
  }
}
