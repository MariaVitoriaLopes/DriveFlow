import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './filtro.html',
  styleUrl: './filtro.scss',
})
export class Filtro {

  dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  diasSelecionados: any = {};
  categoriaSelecionada = 'Categoria B';
  cambioSelecionado = 'Manual';

  limparFiltros() {
    this.dias.forEach(d => this.diasSelecionados[d] = false);
    this.categoriaSelecionada = 'Categoria B';
    this.cambioSelecionado = 'Manual';
  }

  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }

}
