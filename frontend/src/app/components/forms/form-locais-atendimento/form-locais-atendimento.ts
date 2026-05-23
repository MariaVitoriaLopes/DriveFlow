import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-form-locais-atendimento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './form-locais-atendimento.html',
  styleUrls: ['./form-locais-atendimento.scss'],
})
export class FormLocaisAtendimento implements OnInit, OnChanges {

  formLocais!: FormGroup;
  usuarioId = '';
  carregando = false;
  salvando = false;

constructor(
  private fb: FormBuilder,
  private http: HttpClient,
  private cdr: ChangeDetectorRef
) {}

  @Input() reloadKey = 0;

  ngOnInit(): void {
    this.usuarioId =
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('userId') ||
      '';

    this.formLocais = this.fb.group({
      enderecos: this.fb.array([])
    });

    this.buscarLocaisCadastrados();
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['reloadKey'] && !changes['reloadKey'].firstChange) {
    this.buscarLocaisCadastrados();
  }
}

  get enderecos(): FormArray {
    return this.formLocais.get('enderecos') as FormArray;
  }

  criarEndereco(endereco?: any): FormGroup {
    const grupo = this.fb.group({
      titulo: [endereco?.titulo || `Endereço ${this.enderecos.length + 1}`],
      cep: [endereco?.cep || '', Validators.required],
      logradouro: [endereco?.logradouro || ''],
      numero: [endereco?.numero || ''],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || ''],
      cidade: [endereco?.cidade || ''],
      uf: [endereco?.uf || ''],
      favorito: [!!endereco?.favorito]
    });

    this.monitorarCep(grupo);

    return grupo;
  }

buscarLocaisCadastrados(): void {
  if (!this.usuarioId) {
    console.warn('Usuário não encontrado.');
    return;
  }

  this.carregando = true;

  const url = `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}/locais`;

  this.http.get<any>(url).subscribe({
    next: (res) => {
      const locais = Array.isArray(res)
        ? res
        : res?.locaisAtendimento || [];

      const novosEnderecos = locais.map((local: any, index: number) =>
        this.criarEndereco({
          ...local,
          titulo: local.titulo || `Endereço ${index + 1}`
        })
      );

      this.formLocais.setControl(
        'enderecos',
        this.fb.array(novosEnderecos)
      );

      this.carregando = false;
      this.cdr.detectChanges();

      console.log('Locais aplicados:', this.enderecos.value);
    },
    error: (err) => {
      console.error('Erro ao buscar locais:', err);

      this.formLocais.setControl(
        'enderecos',
        this.fb.array([])
      );

      this.carregando = false;
      this.cdr.detectChanges();
    }
  });
}

adicionarEnderecoTemporario(): void {
  this.enderecos.insert(
    0,
    this.criarEndereco({
      titulo: `Novo endereço`,
      favorito: this.enderecos.length === 0,
      temporario: true
    })
  );
}

  deletarEndereco(index: number): void {
    this.enderecos.removeAt(index);
    this.reordenarTitulos();

    const temFavorito = this.enderecos.controls.some(ctrl =>
      !!ctrl.get('favorito')?.value
    );

    if (!temFavorito && this.enderecos.length > 0) {
      this.enderecos.at(0).get('favorito')?.setValue(true);
    }
  }

  descartarAlteracoes(): void {
    this.buscarLocaisCadastrados();
  }

  marcarFavorito(indiceSelecionado: number): void {
    this.enderecos.controls.forEach((ctrl, i) => {
      ctrl.get('favorito')?.setValue(i === indiceSelecionado);
    });
  }

  reordenarTitulos(): void {
    this.enderecos.controls.forEach((ctrl, index) => {
      ctrl.get('titulo')?.setValue(`Endereço ${index + 1}`);
    });
  }

  monitorarCep(grupo: FormGroup): void {
    grupo.get('cep')?.valueChanges.subscribe(cep => {
      const cepRaw = cep || '';
      const cepLimpo = cepRaw.replace(/\D/g, '');

      if (cepLimpo.length === 8) {
        this.buscarEnderecoPorCep(cepLimpo, grupo);
      }
    });
  }

  buscarEnderecoPorCep(cep: string, grupo: FormGroup): void {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: data => {
        if (!data.erro) {
          grupo.patchValue({
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || ''
          }, { emitEvent: false });
        }
      },
      error: err => console.error('Erro ao buscar CEP:', err)
    });
  }

  onSubmit(): void {
    if (this.salvando) return;

    if (!this.usuarioId) {
      alert('Usuário não encontrado.');
      return;
    }

    if (this.enderecos.length === 0) {
      alert('Adicione pelo menos um local de atendimento.');
      return;
    }

    if (this.formLocais.invalid) {
      this.formLocais.markAllAsTouched();
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.salvando = true;

    const locais = this.enderecos.getRawValue()
      .map((local: any) => ({
        ...local,
        favorito: !!local.favorito
      }))
      .sort((a: any, b: any) => {
        if (a.temporario && !b.temporario) return 1;
        if (!a.temporario && b.temporario) return -1;
        return 0;
      })
      .map((local: any, index: number) => ({
        ...local,
        temporario: false,
        titulo: `Endereço ${index + 1}`
      }));

    const url = `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}/locais`;

    this.http.put(url, locais).subscribe({
      next: () => {
        alert('Locais salvos com sucesso!');
        this.salvando = false;
        this.buscarLocaisCadastrados();
      },
      error: err => {
        console.error('Erro ao salvar locais:', err);
        alert('Erro ao salvar locais.');
        this.salvando = false;
      }
    });
  }
}