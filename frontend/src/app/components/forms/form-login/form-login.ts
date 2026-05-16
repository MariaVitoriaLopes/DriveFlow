import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });


  onLogin() {
    if (this.form.valid) {
      const credenciais = {
        email: this.form.value.email,
        senha: this.form.value.senha
      };

      console.log('Enviando dados de login para o Java:', credenciais);


      this.http.post('http://localhost:8081/api/usuarios/login', credenciais)
        .subscribe({
          next: (usuarioLogado: any) => {

            alert(`Bem-vindo de volta, ${usuarioLogado.nome}!`);


            localStorage.setItem('usuario', JSON.stringify(usuarioLogado));


            if (usuarioLogado.perfil === 'INSTRUTOR') {
              console.log('Navegando para o painel do Instrutor...');
              this.router.navigate(['/instrutor/dashboard']);
            } else {
              console.log('Navegando para o painel do Aluno...');
              this.router.navigate(['/dashboard-aluno']); // Ajuste para sua rota real
            }
          },
          error: (erro) => {
            console.error('Erro na autenticação:', erro);
            alert('E-mail ou senha incorretos! Verifique os dados.');
          }
        });
    } else {
      alert('Por favor, preencha os campos corretamente.');
    }
  }
}
