import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Veiculo {
  id?: string;
  marca: string;
  modelo: string;
  placa: string;
  ano: string;
  cor: string;
  cambio: string;
  categoria: string;
  fotoUrl?: string;
  principal: boolean;
}

@Component({
  selector: 'app-form-veiculos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-veiculos.html',
  styleUrl: './form-veiculos.scss',
})
export class FormVeiculos implements OnInit, OnChanges {
  @Input() veiculo!: Veiculo;

  @Output() veiculoAtualizado = new EventEmitter<Veiculo>();
  @Output() veiculoDeletado = new EventEmitter<Veiculo>();

  veiculoForm!: FormGroup;
  editMode = false;
  previewImagem = '';

  constructor(private fb: FormBuilder) {}

ngOnInit(): void {
  this.veiculoForm = this.fb.group({
    marca: [{ value: '', disabled: true }, Validators.required],
    modelo: [{ value: '', disabled: true }, Validators.required],
    cor: [{ value: '', disabled: true }],
    ano: [{ value: '', disabled: true }],
    placa: [{ value: '', disabled: true }],
    cambio: [{ value: '', disabled: true }],
    categoria: [{ value: '', disabled: true }],
    principal: [{ value: false, disabled: true }]
  });

  if (this.veiculo) {
    this.carregarDadosNoForm();
  }
}

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['veiculo'] && this.veiculoForm && this.veiculo) {
    this.carregarDadosNoForm();
  }
}

carregarDadosNoForm(): void {
  console.log('VEÍCULO RECEBIDO NO CARD:', this.veiculo);

  this.veiculoForm.patchValue({
    marca: this.veiculo?.marca || '',
    modelo: this.veiculo?.modelo || '',
    cor: this.veiculo?.cor || '',
    ano: this.veiculo?.ano || '',
    placa: this.veiculo?.placa || '',
    cambio: this.veiculo?.cambio || '',
    categoria: this.veiculo?.categoria || '',
    principal: this.veiculo?.principal || false
  });

  this.previewImagem = this.veiculo?.fotoUrl || '';
}

  toggleEdit(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.veiculoForm.enable();
    } else {
      this.veiculoForm.disable();
      this.veiculoForm.patchValue(this.veiculo);
      this.previewImagem = this.veiculo.fotoUrl || '';
    }
  }

  onSalvar(): void {
    if (this.veiculoForm.invalid) return;

    const atualizado: Veiculo = {
      ...this.veiculo,
      ...this.veiculoForm.getRawValue(),
      fotoUrl: this.previewImagem
    };

    this.veiculoAtualizado.emit(atualizado);
    this.veiculoForm.disable();
    this.editMode = false;
  }

  onDeletar(): void {
    this.veiculoDeletado.emit(this.veiculo);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagem = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}