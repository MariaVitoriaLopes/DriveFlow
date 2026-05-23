import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrls: ['./form-login.scss'],
})
export class FormLogin {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
  });

  onLogin(): void {
    if (this.form.invalid) {
      alert('Por favor, preencha os campos corretamente.');
      return;
    }

    const email = this.form.value.email!;
    const senha = this.form.value.senha!;

    this.auth.login(email, senha).subscribe({
      next: (usuarioLogado) => {
        localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
        localStorage.setItem('usuarioId', usuarioLogado.id);
        localStorage.setItem('userId', usuarioLogado.id);
        localStorage.setItem('userPerfil', usuarioLogado.perfil);

        alert(`Bem-vindo de volta, ${usuarioLogado.nome}!`);

        if (usuarioLogado.perfil === 'INSTRUTOR') {
          this.router.navigate(
            ['/instrutor/configuracoes'],
            { queryParams: { aba: 'pessoais' } }
          );
        } else {
          this.router.navigate(['/aluno/home-aluno']);
        }
      },
      error: (erro) => {
        console.error('Erro na autenticação:', erro);
        alert('E-mail ou senha incorretos! Verifique os dados.');
      }
    });
  }
}