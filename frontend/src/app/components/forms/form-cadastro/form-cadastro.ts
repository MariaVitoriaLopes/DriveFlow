import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule,} from '@angular/forms';

@Component({
  selector: 'app-form-cadastro',
  imports: [
    CommonModule,        // Importa o CommonModule para usar diretivas como ngClass
    ReactiveFormsModule  // Importa ReactiveFormsModule para formularios reativos
  ],
  templateUrl: './form-cadastro.html',
  styleUrl: './form-cadastro.scss',
})
export class FormCadastro implements OnInit{ //Implementa OnInit corretamente
  @Input() isInstrutor: boolean = false;  // Recebe a variável do componente pai

  private fb = inject(FormBuilder);

  form = this.fb.group({
    cpf: [''],
    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/)
      ]
    ]
  });

  // Implementação do método ngOnInit
  ngOnInit(): void {
    // Inicializações adicionais, se necessárias
  }

  onTipoChange(event: any) {
    this.isInstrutor = event.target.checked;
  }

  get senha() {
    return this.form.get('senha');
  }

  temMaiuscula() {
    return /[A-Z]/.test(this.senha?.value || '');
  }

  temMinuscula() {
    return /[a-z]/.test(this.senha?.value || '');
  }

  temNumero() {
    return /\d/.test(this.senha?.value || '');
  }

  temEspecial() {
    return /[\W_]/.test(this.senha?.value || '');
  }

  temTamanho() {
    return (this.senha?.value || '').length >= 8;
  }
}
