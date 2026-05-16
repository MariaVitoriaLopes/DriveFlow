import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-form-login',
  imports: [ReactiveFormsModule],
  templateUrl: './form-login.html',
  styleUrl: './form-login.scss',
})
export class FormLogin {

  form;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dadosLogin = {
      email: this.form.value.email!,
      senha: this.form.value.senha!
    };

    this.authService.login(dadosLogin).subscribe({
      next: (resposta) => {
        console.log('Login deu certo:', resposta);
      },
      error: (erro) => {
        console.log('Erro no login:', erro);
      }
    });
  }
}