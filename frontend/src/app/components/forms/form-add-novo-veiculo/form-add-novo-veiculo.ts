import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  EventEmitter,
  Output,
  inject
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Veiculo } from '../form-veiculos/form-veiculos';
import { Router } from '@angular/router';

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

  @ViewChild('mainFile') mainFile!: ElementRef<HTMLInputElement>;
  @ViewChildren('sideFile') sideFiles!: QueryList<ElementRef<HTMLInputElement>>;

  private router = inject(Router);

  veiculoForm!: FormGroup;

  mainImageUrl = '';
  sideImages: string[] = ['', '', ''];

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

  uploadMainImage(): void {
    this.mainFile.nativeElement.click();
  }

  uploadSideImage(index: number): void {
    const input = this.sideFiles.toArray()[index];
    input?.nativeElement.click();
  }

  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSideImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.sideImages[index] = reader.result as string;
    };
    reader.readAsDataURL(file);
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
      fotoUrl: this.mainImageUrl,
      principal: form.principal
    };

    this.veiculoSalvo.emit(novoVeiculo);
        this.router.navigate(
      ['/instrutor/configuracoes'],
      {
        queryParams: { aba: 'veiculo' }
      }
    );
  }

  cancelarCadastro(): void {
    this.cancelar.emit();
  }
}