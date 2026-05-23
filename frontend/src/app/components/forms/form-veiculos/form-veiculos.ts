import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Veiculo {
  marca: string;
  modelo: string;
  cor: string;
  ano: string;
  placa: string;
  cambio: string;
  categoria: string;
  versao?: string;
  fotoUrl?: string;
  fotoUrls?: string[];
  recursos?: string[];
  infoExtra?: string;
  padrao?: boolean;
}

@Component({
  selector: 'app-form-veiculos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './form-veiculos.html',
  styleUrl: './form-veiculos.scss',
})
export class FormVeiculos implements OnInit, OnChanges {

  @Input() veiculo?: Veiculo;
  @Input() usuarioId = '';
  @Input() reloadKey = 0;

  @Output() adicionarNovo = new EventEmitter<void>();
  @Output() veiculoAtualizado = new EventEmitter<Veiculo>();
  @Output() veiculoDeletado = new EventEmitter<Veiculo>();

  veiculoForm!: FormGroup;
  veiculos: Veiculo[] = [];

  editMode = false;
  previewImagem = '';
  sideImages: (string | null)[] = [null, null, null];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuarioId =
      this.usuarioId ||
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('userId') ||
      '';

    this.initForm();

    if (this.usuarioId) {
      this.carregarVeiculos();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reloadKey'] && !changes['reloadKey'].firstChange) {
      this.carregarVeiculos();
    }
  }

  initForm(): void {
    this.veiculoForm = this.fb.group({
      marca: [{ value: '', disabled: true }, Validators.required],
      versao: [{ value: '', disabled: true }],
      modelo: [{ value: '', disabled: true }, Validators.required],
      cor: [{ value: '', disabled: true }, Validators.required],
      ano: [{ value: '', disabled: true }, Validators.required],
      placa: [{ value: '', disabled: true }, Validators.required],
      cambio: [{ value: '', disabled: true }, Validators.required],
      categoria: [{ value: '', disabled: true }, Validators.required],
      padrao: [{ value: false, disabled: true }]
    });
  }

  carregarVeiculos(): void {
    if (!this.usuarioId) return;

    const url = `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}/veiculos`;

    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (Array.isArray(res)) {
          this.veiculos = [...res];
        } else if (res?.veiculos) {
          this.veiculos = [...res.veiculos];
        } else {
          this.veiculos = [];
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar veículos:', err);
      }
    });
  }

  editarVeiculo(veiculo: Veiculo, index: number): void {
    this.veiculo = veiculo;

    this.previewImagem = veiculo.fotoUrls?.[0] || veiculo.fotoUrl || '';

    this.sideImages = [
      veiculo.fotoUrls?.[1] || null,
      veiculo.fotoUrls?.[2] || null,
      veiculo.fotoUrls?.[3] || null
    ];

    this.veiculoForm.patchValue({
      marca: veiculo.marca || '',
      versao: veiculo.versao || '',
      modelo: veiculo.modelo || '',
      cor: veiculo.cor || '',
      ano: veiculo.ano || '',
      placa: veiculo.placa || '',
      cambio: veiculo.cambio || '',
      categoria: veiculo.categoria || '',
      padrao: veiculo.padrao || false
    });

    this.editMode = true;
    this.veiculoForm.enable();
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      this.veiculoForm.enable();
    } else {
      this.veiculoForm.disable();
    }
  }

  onSalvar(): void {
    if (this.veiculoForm.invalid) {
      this.veiculoForm.markAllAsTouched();
      return;
    }

    const fotos = [
      ...(this.previewImagem ? [this.previewImagem] : []),
      ...this.sideImages.filter((img): img is string => !!img)
    ];

    const atualizado: Veiculo = {
      ...this.veiculo,
      ...this.veiculoForm.getRawValue(),
      ano: String(this.veiculoForm.getRawValue().ano),
      fotoUrl: this.previewImagem || '',
      fotoUrls: fotos
    };

    const url = `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}/veiculo`;

    this.http.put<Veiculo>(url, atualizado).subscribe({
      next: (res) => {
        alert('Veículo atualizado com sucesso!');

        this.veiculo = atualizado;
        this.editMode = false;
        this.veiculoForm.disable();
        this.veiculoAtualizado.emit(res);

        this.carregarVeiculos();
      },
      error: (err) => {
        console.error('Erro ao atualizar veículo:', err);
        alert('Erro ao atualizar veículo.');
      }
    });
  }

  onDeletar(veiculo: Veiculo): void {
    this.veiculoDeletado.emit(veiculo);
  }

  onAdicionarNovo(): void {
    this.adicionarNovo.emit();
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