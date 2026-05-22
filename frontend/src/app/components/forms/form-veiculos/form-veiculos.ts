import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Veiculo {
  id?: string;
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  placa: string;
  cambio: string;
  categoria: string;
  versao?: string;
  capa?: string;
  definidoComoPadrao?: boolean;
}
@Component({
  selector: 'app-form-veiculos',
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './form-veiculos.html',
  styleUrl: './form-veiculos.scss',
})
export class FormVeiculos {

  @Input() veiculo!: Veiculo;
  @Input() usuarioId!: string;
  @Output() adicionarNovo = new EventEmitter<void>();
  @Output() veiculoAtualizado = new EventEmitter<Veiculo>();
  @Output() veiculoDeletado = new EventEmitter<Veiculo>();

  veiculoForm!: FormGroup;
  editMode = false;
  previewImagem?: string;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.veiculoForm = this.fb.group({
      marca: [{ value: this.veiculo.marca, disabled: true }, Validators.required],
      modelo: [{ value: this.veiculo.modelo, disabled: true }, Validators.required],
      cor: [{ value: this.veiculo.cor, disabled: true }, Validators.required],
      ano: [{ value: this.veiculo.ano, disabled: true }, Validators.required],
      placa: [{ value: this.veiculo.placa, disabled: true }, Validators.required],
      cambio: [{ value: this.veiculo.cambio, disabled: true }, Validators.required],
      categoria: [{ value: this.veiculo.categoria, disabled: true }, Validators.required],
      versao: [{ value: this.veiculo.versao, disabled: true }],
      definidoComoPadrao: [{ value: this.veiculo.definidoComoPadrao, disabled: true }]
    });
    this.previewImagem = this.veiculo.capa || '';
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) this.veiculoForm.enable();
    else this.veiculoForm.disable();
  }

  onSalvar() {
    if (this.veiculoForm.valid) {
      const atualizado: Veiculo = { ...this.veiculo, ...this.veiculoForm.value, capa: this.previewImagem };

      const url = `http://localhost:8081/api/${this.usuarioId}/veiculo`;

this.http.put<Veiculo>(url, atualizado).subscribe({
  next: (res: Veiculo) => {
    console.log('Veículo atualizado com sucesso', res);
    this.veiculoForm.disable();
    this.editMode = false;
    this.veiculoAtualizado.emit(res);
  },
  error: (err: any) => {
    console.error('Erro ao atualizar veículo', err);
  }
});
    }
  }

  onDeletar() {
    this.veiculoDeletado.emit(this.veiculo);
  }

  onAdicionarNovo() {
    this.adicionarNovo.emit();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.previewImagem = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
}
