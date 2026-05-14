import { Component } from '@angular/core';
import { FormCadastro } from '../../components/forms/form-cadastro/form-cadastro';
import { RouterLink } from '@angular/router';
import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    FormCadastro,
    RouterLink,
    Header,
    Footer,
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css',
})
export class Cadastro {
  isInstrutor: boolean = false;

  // Método para alterar o valor de isInstrutor
  onTipoChange(event: any) {
    this.isInstrutor = event.target.checked;
  }
}