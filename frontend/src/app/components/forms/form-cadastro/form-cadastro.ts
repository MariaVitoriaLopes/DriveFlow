import { CommonModule } from '@angular/common';
import { Component, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // 1. IMPORTANTE: Importar o cliente HTTP

@Component({
  selector: 'app-form-cadastro',
  standalone: true, // Garante que é um componente standalone moderno
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
  private http = inject(HttpClient); // 2. Injetar o HttpClient para enviar os dados

  // 3. Adicionados os campos 'nome' e 'email' para combinar com o banco NoSQL
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

  // 4. ESSA FUNÇÃO VAI ENVIAR O JSON PARA O JAVA
  onSubmit() {
    if (this.form.valid) {
      // Monta o JSON misturando o formulário com a regra de perfil que o Java espera
      const dadosParaEnviar = {
        nome: this.form.value.nome,
        email: this.form.value.email,
        senha: this.form.value.senha,
        cpf: this.form.value.cpf,
        perfil: this.isInstrutor ? 'INSTRUTOR' : 'ALUNO'
      };

      console.log('Enviando para o MongoDB através do Java:', dadosParaEnviar);

      // Dispara o POST para o Controller do seu Backend
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

  // Seus métodos de validação visual de senha continuam iguaizinhos abaixo:
  get searchSenha() {
    return this.form.get('senha');
  }

  temMaiuscula() { return /[A-Z]/.test(this.searchSenha?.value || ''); }
  temMinuscula() { return /[a-z]/.test(this.searchSenha?.value || ''); }
  temNumero() { return /\d/.test(this.searchSenha?.value || ''); }
  temEspecial() { return /[\W_]/.test(this.searchSenha?.value || ''); }
  temTamanho() { return (this.searchSenha?.value || '').length >= 8; }
}
