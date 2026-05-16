import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Importado para fazer o POST
import { CommonModule } from '@angular/common'; // Importado para manipulação de classes no HTML
import { Router } from '@angular/router'; // Importado para mudar de página

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
  private http = inject(HttpClient); // Injetando o cliente HTTP
  private router = inject(Router); // Injetando o roteador do Angular

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Função que será chamada quando o usuário submeter o formulário
  onLogin() {
    if (this.form.valid) {
      const credenciais = {
        email: this.form.value.email,
        senha: this.form.value.senha
      };

      console.log('Enviando dados de login para o Java:', credenciais);

      // Faz a requisição POST para a rota do seu Controller Java
      this.http.post('http://localhost:8081/api/usuarios/login', credenciais)
        .subscribe({
          next: (usuarioLogado: any) => {
            // O Java encontrou o usuário e validou a senha!
            alert(`Bem-vindo de volta, ${usuarioLogado.nome}!`);

            // Salva os dados na sessão do navegador (útil para proteger rotas depois)
            localStorage.setItem('usuario', JSON.stringify(usuarioLogado));

            // Verifica o perfil retornado do MongoDB para decidir a página
            if (usuarioLogado.perfil === 'INSTRUTOR') {
              console.log('Navegando para o painel do Instrutor...');
              this.router.navigate(['/dashboard-instrutor']); // Ajuste para sua rota real
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
