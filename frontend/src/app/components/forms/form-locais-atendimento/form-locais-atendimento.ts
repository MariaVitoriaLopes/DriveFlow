import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-locais-atendimento',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-locais-atendimento.html',
  styleUrl: './form-locais-atendimento.scss',
})
export class FormLocaisAtendimento implements OnInit{

    formLocais!: FormGroup;

  constructor(private fb: FormBuilder) { }

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
  }

  get enderecos(): FormArray {
    return this.formLocais.get('enderecos') as FormArray;
  }

  criarEndereco(endereco?: any): FormGroup {
    return this.fb.group({
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

  onSubmit(): void {
    if (this.formLocais.valid) {
      console.log('Dados enviados:', this.formLocais.value);
      // Aqui você pode enviar para o backend via serviço HttpClient
      // ex: this.apiService.salvarEnderecos(this.formLocais.value).subscribe(...)
    } else {
      console.log('Formulário inválido');
    }
  }
}
