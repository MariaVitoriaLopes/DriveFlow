import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';

@Component({
  selector: 'app-form-add-novo-veiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form-add-novo-veiculo.html',
  styleUrls: ['./form-add-novo-veiculo.scss'],
})
export class FormAddNovoVeiculo implements OnInit {

  @Output() veiculoSalvo = new EventEmitter<any>();

  @ViewChild('mainFile') mainFile!: ElementRef<HTMLInputElement>;

  veiculoForm!: FormGroup;

  usuarioId = '';
  salvando = false;

  fotosSelecionadas: File[] = [];

  mainImageUrl: string | null = null;
  sideImages: (string | null)[] = [null, null, null];

  marcas = ['Fiat', 'Chevrolet', 'Volkswagen', 'Ford'];
  versoes = ['LT 1.0', 'LT 1.4', 'EX 1.6'];
  cores = ['Branco', 'Preto', 'Prata'];
  anos = Array.from({ length: 30 }, (_, i) => 2026 - i);
  cambios = ['Manual', 'Automático'];
  categorias = ['Categoria A (Moto)', 'Categoria B (Carro)'];

  recursos = [
    'Ar-condicionado',
    'ABS',
    'Duplo comando',
    'Direção elétrica',
    'Direção hidráulica',
    'Travas elétricas'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuarioId =
      localStorage.getItem('usuarioId') ||
      localStorage.getItem('userId') ||
      '';

    this.veiculoForm = this.fb.group({
      marca: ['', Validators.required],
      versao: [''],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: ['', Validators.required],
      placa: ['', Validators.required],
      cambio: ['', Validators.required],
      categoria: ['', Validators.required],
      recursos: [[]],
      infoExtra: [''],
      padrao: [false]
    });
  }

  abrirSeletorFotos(): void {
    this.mainFile.nativeElement.click();
  }

  onFotosSelecionadas(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const arquivos = Array.from(input.files).slice(0, 4);

    this.fotosSelecionadas = arquivos;

    this.limparPreviews();

    arquivos.forEach((file, index) => {
      const previewUrl = URL.createObjectURL(file);

      if (index === 0) {
        this.mainImageUrl = previewUrl;
      } else {
        this.sideImages[index - 1] = previewUrl;
      }
    });

    input.value = '';
  }

  limparPreviews(): void {
    if (this.mainImageUrl) {
      URL.revokeObjectURL(this.mainImageUrl);
    }

    this.sideImages.forEach(img => {
      if (img) URL.revokeObjectURL(img);
    });

    this.mainImageUrl = null;
    this.sideImages = [null, null, null];
  }

  toggleRecurso(rec: string): void {
    const recursosAtuais: string[] = this.veiculoForm.get('recursos')?.value || [];

    const novosRecursos = recursosAtuais.includes(rec)
      ? recursosAtuais.filter(r => r !== rec)
      : [...recursosAtuais, rec];

    this.veiculoForm.patchValue({
      recursos: novosRecursos
    });
  }

  recursoSelecionado(rec: string): boolean {
    const recursosAtuais: string[] = this.veiculoForm.get('recursos')?.value || [];
    return recursosAtuais.includes(rec);
  }

submit(): void {
  if (this.salvando) return;

  this.usuarioId =
    localStorage.getItem('usuarioId') ||
    localStorage.getItem('userId') ||
    '';

  if (!this.usuarioId) {
    alert('Usuário não encontrado. Faça login novamente.');
    return;
  }

  if (!this.veiculoForm.value.marca || !this.veiculoForm.value.modelo) {
    alert('Preencha pelo menos marca e modelo.');
    return;
  }

  const veiculo = {
    marca: this.veiculoForm.value.marca,
    modelo: this.veiculoForm.value.modelo,
    placa: this.veiculoForm.value.placa,
    ano: String(this.veiculoForm.value.ano || ''),

    versao: this.veiculoForm.value.versao,
    cor: this.veiculoForm.value.cor,
    cambio: this.veiculoForm.value.cambio,
    categoria: this.veiculoForm.value.categoria,
    recursos: this.veiculoForm.value.recursos,
    infoExtra: this.veiculoForm.value.infoExtra,
    padrao: this.veiculoForm.value.padrao
  };

  const formData = new FormData();

  formData.append('veiculo', JSON.stringify(veiculo));

  this.fotosSelecionadas.forEach(file => {
    formData.append('fotos', file);
  });

  const url = `http://localhost:8081/api/instrutores/configuracoes/${this.usuarioId}/veiculo`;

  this.salvando = true;

  this.http.post(url, formData)
    .pipe(
      catchError(err => {
        console.error('Erro ao salvar veículo:', err);
        alert('Erro ao salvar veículo!');
        return throwError(() => err);
      }),
      finalize(() => {
        this.salvando = false;
      })
    )
    .subscribe(res => {
      alert('Veículo salvo com sucesso!');
      this.veiculoSalvo.emit(res);
    });
}
}