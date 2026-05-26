import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-cadastro.html',
  styleUrl: './form-cadastro.scss',
})
export class FormCadastro implements OnInit {

  @Input() isInstrutor: boolean = false;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  mostrarSenha = false;
  mostrarRepetirSenha = false;

  mensagemErro = '';
  mensagemSucesso = '';

  form = this.fb.group(
    {
      nome: ['', [Validators.required, Validators.minLength(3)]],

      email: ['', [Validators.required, Validators.email]],

      cpf: ['', [Validators.required]],

      senha: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s]+$/
          )
        ]
      ],

      confirmarSenha: ['', [Validators.required]],

      termos: [false, [Validators.requiredTrue]]
    },

    { validators: this.senhasIguais }
  );

  ngOnInit(): void {}

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  toggleRepetirSenha(): void {
    this.mostrarRepetirSenha = !this.mostrarRepetirSenha;
  }

  senhasIguais(form: AbstractControl) {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;

    return senha === confirmarSenha
      ? null
      : { senhasDiferentes: true };
  }

  onTipoChange(event: any) {
    this.isInstrutor = event.target.checked;
    this.form.get('cpf')?.reset();
  }

  onCpfCnhInput(event: any) {

    let valor: string =
      event?.target?.value?.replace(/\D/g, '') || '';

    if (this.isInstrutor) {

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

    } else {

      if (valor.length > 11) {
        valor = valor.slice(0, 11);
      }

      if (valor.length > 9) {

        valor = valor.replace(
          /(\d{3})(\d{3})(\d{3})(\d{1,2})/,
          '$1.$2.$3-$4'
        );

      } else if (valor.length > 6) {

        valor = valor.replace(
          /(\d{3})(\d{3})(\d{1,3})/,
          '$1.$2.$3'
        );

      } else if (valor.length > 3) {

        valor = valor.replace(
          /(\d{3})(\d{1,3})/,
          '$1.$2'
        );
      }
    }

    this.form.get('cpf')?.setValue(valor, {
      emitEvent: false
    });
  }

  onSubmit() {

    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (this.form.invalid) {

      this.mensagemErro =
        'Preencha todos os campos corretamente, aceite os termos e confirme a senha.';

      this.form.markAllAsTouched();

      this.cdr.detectChanges();

      return;
    }

    const dadosParaEnviar = {
      nome: this.form.value.nome || '',
      email: this.form.value.email || '',
      senha: this.form.value.senha || '',
      cpf: this.form.value.cpf || '',
      perfil: this.isInstrutor
        ? 'INSTRUTOR'
        : 'ALUNO',
    };

    this.http
      .post(
        'http://localhost:8081/api/usuarios/cadastro',
        dadosParaEnviar
      )

      .subscribe({

        next: () => {

          this.mensagemSucesso =
            'Cadastro realizado com sucesso!';

          this.form.reset();

          this.isInstrutor = false;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (erro) => {

          console.error(
            'Erro na comunicação com o Backend:',
            erro
          );

          this.mensagemErro =
            'Erro ao cadastrar. Verifique os dados ou tente novamente mais tarde.';

          this.cdr.detectChanges();
        }
      });
  }

  get searchSenha() {
    return this.form.get('senha');
  }

  temMaiuscula() {
    return /[A-Z]/.test(this.searchSenha?.value || '');
  }

  temMinuscula() {
    return /[a-z]/.test(this.searchSenha?.value || '');
  }

  temNumero() {
    return /\d/.test(this.searchSenha?.value || '');
  }

  temEspecial() {
    return /[\W_]/.test(this.searchSenha?.value || '');
  }

  temTamanho() {
    return (this.searchSenha?.value || '').length >= 8;
  }
}