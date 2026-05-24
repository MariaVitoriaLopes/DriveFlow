import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChildren,
  ElementRef,
  QueryList
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
  fotosUrl: string[];
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

  @ViewChildren('fotoInput') fotoInputs!: QueryList<ElementRef<HTMLInputElement>>;

  veiculoForm!: FormGroup;
  editMode = false;

  fotosPreview: string[] = ['', '', '', ''];

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
    this.veiculoForm.patchValue({
      marca: this.veiculo.marca || '',
      modelo: this.veiculo.modelo || '',
      cor: this.veiculo.cor || '',
      ano: this.veiculo.ano || '',
      placa: this.veiculo.placa || '',
      cambio: this.veiculo.cambio || '',
      categoria: this.veiculo.categoria || '',
      principal: this.veiculo.principal || false
    });

    const fotos = this.veiculo.fotosUrl || [];
    this.fotosPreview = [
      fotos[0] || '',
      fotos[1] || '',
      fotos[2] || '',
      fotos[3] || ''
    ];
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.veiculoForm.enable();
    } else {
      this.veiculoForm.disable();
      this.carregarDadosNoForm();
    }
  }

  abrirSeletorFoto(index: number): void {
    if (!this.editMode) return;

    const input = this.fotoInputs.toArray()[index];

    if (input) {
      input.nativeElement.click();
    }
  }

  onFotoSelecionada(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (index < 0 || index > 3) {
      alert('Você só pode escolher até 4 fotos.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.fotosPreview[index] = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  removerFoto(index: number): void {
    if (!this.editMode) return;

    this.fotosPreview[index] = '';
  }

  onSalvar(): void {
    if (this.veiculoForm.invalid) return;

    const atualizado: Veiculo = {
      ...this.veiculo,
      ...this.veiculoForm.getRawValue(),
      fotosUrl: this.fotosPreview.filter(foto => !!foto)
    };

    this.veiculoAtualizado.emit(atualizado);
    this.veiculoForm.disable();
    this.editMode = false;
  }

  onDeletar(): void {
    this.veiculoDeletado.emit(this.veiculo);
  }
}
