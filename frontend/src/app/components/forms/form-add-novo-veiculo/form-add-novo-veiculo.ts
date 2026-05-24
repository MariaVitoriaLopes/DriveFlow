import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChildren,
  ElementRef,
  QueryList,
  EventEmitter,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Veiculo } from '../form-veiculos/form-veiculos';

@Component({
  selector: 'app-form-add-novo-veiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-add-novo-veiculo.html',
  styleUrls: ['./form-add-novo-veiculo.scss'],
})
export class FormAddNovoVeiculo implements OnInit {
  @Output() veiculoSalvo = new EventEmitter<Veiculo>();
  @Output() cancelar = new EventEmitter<void>();

  @ViewChildren('fotoInput') fotoInputs!: QueryList<ElementRef<HTMLInputElement>>;

  veiculoForm!: FormGroup;

  fotosPreview: string[] = ['', '', '', ''];

  marcas = ['Fiat', 'Chevrolet', 'Volkswagen', 'Ford', 'Honda', 'Toyota', 'Hyundai', 'Renault'];
  versoes = ['Básica', 'Completa', 'Sport', 'Premium'];
  cores = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul'];
  anos = Array.from({ length: 30 }, (_, i) => String(2026 - i));
  cambios = ['Manual', 'Automático'];
  categorias = ['Categoria A', 'Categoria B', 'Categoria AB'];

  recursos = [
    'Ar-condicionado',
    'Direção hidráulica',
    'Sensor de ré',
    'Câmera de ré',
    'Vidro elétrico',
    'Controle de estabilidade'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.veiculoForm = this.fb.group({
      marca: ['', Validators.required],
      versao: [''],
      modelo: ['', Validators.required],
      cor: [''],
      ano: [''],
      placa: ['', Validators.required],
      cambio: [''],
      categoria: [''],
      recursos: [[]],
      infoExtra: [''],
      principal: [false]
    });
  }

  abrirSeletorFoto(index: number): void {
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
    this.fotosPreview[index] = '';
  }

  toggleRecurso(recurso: string): void {
    const selecionados: string[] = this.veiculoForm.get('recursos')?.value || [];

    if (selecionados.includes(recurso)) {
      this.veiculoForm.get('recursos')?.setValue(
        selecionados.filter(r => r !== recurso)
      );
    } else {
      this.veiculoForm.get('recursos')?.setValue([...selecionados, recurso]);
    }
  }

  submit(): void {
    if (this.veiculoForm.invalid) {
      this.veiculoForm.markAllAsTouched();
      return;
    }

    const form = this.veiculoForm.value;

    const novoVeiculo: Veiculo = {
      marca: form.marca,
      modelo: form.modelo,
      placa: form.placa,
      ano: form.ano,
      cor: form.cor,
      cambio: form.cambio,
      categoria: form.categoria,
      fotosUrl: this.fotosPreview.filter(foto => !!foto),
      principal: form.principal
    };

    this.veiculoSalvo.emit(novoVeiculo);
  }

  cancelarCadastro(): void {
    this.cancelar.emit();
  }
}