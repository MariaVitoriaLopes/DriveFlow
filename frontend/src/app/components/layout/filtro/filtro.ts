import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './filtro.html',
  styleUrl: './filtro.scss',
})
export class Filtro {

  dias = [
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
    'Domingo',
  ];

  diasSelecionados: Record<string, boolean> = {};

  categoriaSelecionada = 'Categoria B';
  cambioSelecionado = 'Manual';

  menuAberto = false;

  limparFiltros() {
    this.dias.forEach(
      dia => this.diasSelecionados[dia] = false
    );

    this.categoriaSelecionada = 'Categoria B';
    this.cambioSelecionado = 'Manual';
  }

}