import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-cadastro.html',
  styleUrl: './form-cadastro.scss',
})
export class FormCadastro implements OnInit {
  @Input() isInstrutor: boolean = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);


  form = this.fb.group({
    nome: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    cpf: ['', [Validators.required]],
    senha: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/)
      ]
    ]
  });

  ngOnInit(): void {}

  onTipoChange(event: any) {
    this.isInstrutor = event.target.checked;
  }


  onSubmit() {
    if (this.form.valid) {

      const dadosParaEnviar = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        senha: this.form.value.senha,
        cpf: this.form.value.cpf,
        perfil: this.isInstrutor ? 'INSTRUTOR' : 'ALUNO'
      };

      console.log('Enviando para o MongoDB através do Java:', dadosParaEnviar);


      this.http.post('http://localhost:8081/api/usuarios/cadastro', dadosParaEnviar)
        .subscribe({
          next: (resposta) => {
            alert('Cadastro realizado com sucesso! Verifique seu banco de dados.');
            this.form.reset(); // Limpa a tela após sucesso
          },
          error: (erro) => {
            console.error('Erro na comunicação com o Backend:', erro);
            alert('Erro ao cadastrar. O seu projeto Java está rodando na porta 8081?');
          }
        });
    } else {
      alert('Por favor, preencha todos os campos e cumpra os requisitos da senha.');
    }
  }


  get searchSenha() {
    return this.form.get('senha');
  }

  temMaiuscula() { return /[A-Z]/.test(this.searchSenha?.value || ''); }
  temMinuscula() { return /[a-z]/.test(this.searchSenha?.value || ''); }
  temNumero() { return /\d/.test(this.searchSenha?.value || ''); }
  temEspecial() { return /[\W_]/.test(this.searchSenha?.value || ''); }
  temTamanho() { return (this.searchSenha?.value || '').length >= 8; }
}
