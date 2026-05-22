import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form-locais-atendimento',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-locais-atendimento.html',
  styleUrl: './form-locais-atendimento.scss',
})
export class FormLocaisAtendimento implements OnInit{

  formLocais!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.formLocais = this.fb.group({
      enderecos: this.fb.array([])
    });

    // Exemplo: carregar dados iniciais do backend
    this.carregarEnderecos([
      {
        titulo: 'Endereço 1',
        cep: '11718-270',
        logradouro: 'Rua José Maria de Oliveira',
        numero: 'Nenhum',
        complemento: 'Nenhum',
        bairro: 'Quietude',
        cidade: 'Praia Grande',
        uf: 'São Paulo',
        favorito: true
      },
      {
        titulo: 'Endereço 2',
        cep: '11706-520',
        logradouro: 'Rua Maximina Idelfonso Ventura',
        numero: 'Nenhum',
        complemento: 'Nenhum',
        bairro: '',
        cidade: '',
        uf: '',
        favorito: false
      }
    ]);

    // Observa mudanças de CEP em cada endereço
    this.enderecos.controls.forEach((ctrl, index) => {
      if (ctrl instanceof FormGroup) {
        this.monitorarCep(ctrl, index);
      }
    });
  }

  get enderecos(): FormArray {
    return this.formLocais.get('enderecos') as FormArray;
  }

  criarEndereco(endereco?: any): FormGroup {
    const grupo = this.fb.group({
      titulo: [endereco?.titulo || `Endereço ${this.enderecos.length + 1}`],
      cep: [endereco?.cep || '', Validators.required],
      logradouro: [endereco?.logradouro || '', Validators.required],
      numero: [endereco?.numero || ''],
      complemento: [endereco?.complemento || ''],
      bairro: [endereco?.bairro || ''],
      cidade: [endereco?.cidade || ''],
      uf: [endereco?.uf || ''],
      favorito: [endereco?.favorito || false]
    });

    // Observa CEP para buscar endereço
    this.monitorarCep(grupo, this.enderecos.length);

    return grupo;
  }

  monitorarCep(grupo: FormGroup, index: number) {
    grupo.get('cep')?.valueChanges.subscribe(cep => {
      if (!cep) return;

      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length === 8) {
        this.buscarEnderecoPorCep(cepLimpo, grupo);
      }
    });
  }

  buscarEnderecoPorCep(cep: string, grupo: FormGroup) {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: data => {
        if (!data.erro) {
          grupo.patchValue({
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          });
        }
      },
      error: err => console.error('Erro ao buscar CEP:', err)
    });
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  deletarEndereco(index: number): void {
    this.enderecos.removeAt(index);
  }

  descartarAlteracoes(): void {
    this.formLocais.reset();
  }

  carregarEnderecos(dados: any[]): void {
    dados.forEach(endereco => {
      this.enderecos.push(this.criarEndereco(endereco));
    });
  }

  marcarFavorito(indiceSelecionado: number) {
  this.enderecos.controls.forEach((ctrl, i) => {
    const grupo = ctrl as FormGroup;
    grupo.get('favorito')?.setValue(i === indiceSelecionado);
  });
}

onSubmit(): void {
  if (this.formLocais.valid) {
    const usuarioId = 'ID_DO_INSTRUTOR_LOGADO'; // pegue do localStorage ou AuthService

    // enviar cada endereço individualmente
    this.enderecos.controls.forEach((ctrl: AbstractControl) => {
      const endereco = ctrl.value;
      this.http.put(`http://localhost:8081/api/instrutores/configuracoes/${usuarioId}/local`, endereco)
        .subscribe({
          next: res => console.log('Endereço salvo:', res),
          error: err => console.error('Erro ao salvar endereço:', err)
        });
    });
  } else {
    console.log('Formulário inválido');
  }
}
}