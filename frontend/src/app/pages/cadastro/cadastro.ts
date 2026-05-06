import { Component } from '@angular/core';
import { FormCadastro } from '../../components/forms/form-cadastro/form-cadastro';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormCadastro, RouterLink],
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