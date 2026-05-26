import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

export interface Veiculo {
  marca: string;
  modelo: string;
  versao?: string;
  cor: string;
  ano: string;
  placa: string;
  cambio: string;
  categoria: 'A' | 'B';
  recursos: string[];
  infoExtra?: string;
  principal: boolean;
  fotosUrl: string[];
}

@Component({
  selector: 'app-form-add-novo-veiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-add-novo-veiculo.html',
  styleUrls: ['./form-add-novo-veiculo.scss']
})
export class FormAddNovoVeiculo implements OnInit {
  @Output() veiculoSalvo = new EventEmitter<Veiculo>();
  @Output() cancelar = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  veiculoForm!: FormGroup;

  fotosArquivos: File[] = [];
  fotosPreview: string[] = [];

  marcas = [
    'Chevrolet', 'Volkswagen', 'Fiat', 'Ford', 'Renault', 'Toyota',
    'Honda', 'Hyundai', 'Jeep', 'Nissan', 'Peugeot', 'Citroën',
    'Mitsubishi', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Volvo',
    'BYD', 'GWM', 'Caoa Chery', 'JAC', 'Land Rover', 'Lexus',
    'Mini', 'Porsche', 'Ram', 'Suzuki', 'Subaru', 'Abarth',
    'Agrale', 'Alfa Romeo', 'Dodge', 'Iveco'
  ];

versoes = [
  '1.0',
  '1.0 Turbo',
  '1.3',
  '1.4',
  '1.5',
  '1.6',
  '1.8',
  '2.0',

  'LT 1.0',
  'LT 1.4',
  'LTZ',
  'Premier',

  'Sense',
  'Vision',
  'Drive',
  'Drive 1.0',
  'Drive 1.3',

  'Attractive',
  'Essence',
  'Sporting',

  'Trendline',
  'Comfortline',
  'Highline',

  'GL',
  'GLS',

  'EX',
  'EXL',
  'LX',

  'SR',
  'XEI',
  'Altis',

  'Limited',
  'Longitude',
  'Sport',

  'Platinum',
  'Titanium',
  'Freestyle',

  'Advance',
  'Exclusive',

  'RS',
  'SS',

  'Manual',
  'Automático',
  'CVT'
];

  cores = [
    'Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho',
    'Azul', 'Verde', 'Amarelo', 'Marrom', 'Bege',
    'Dourado', 'Laranja', 'Vinho'
  ];

  anos = Array.from({ length: 31 }, (_, i) => String(new Date().getFullYear() + 1 - i));

  cambios = ['Manual', 'Automático', 'Automatizado', 'CVT'];

  categorias = [
    { label: 'Categoria A', value: 'A' },
    { label: 'Categoria B', value: 'B' }
  ];

  recursos = [
    'Ar-condicionado',
    'ABS',
    'Duplo comando',
    'Direção elétrica',
    'Direção hidráulica',
    'Travas elétricas',
    'Vidros elétricos',
    'Airbag',
    'Sensor de ré'
  ];

  modalAberto = false;
  modalTitulo = '';
  modalMensagem = '';
  modalErro = false;

  abrirModal(titulo: string,mensagem: string,erro = false): void {

    this.modalTitulo = titulo;
    this.modalMensagem = mensagem;
    this.modalErro = erro;

    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
  }

  ngOnInit(): void {
    this.veiculoForm = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      versao: [''],
      cor: ['', Validators.required],
      ano: ['', Validators.required],
      placa: ['', [
        Validators.required,
        Validators.pattern(/^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})$/)
      ]],
      cambio: ['', Validators.required],
      categoria: ['', Validators.required],
      recursos: [[]],
      infoExtra: ['', Validators.maxLength(500)],
      principal: [false]
    });
  }

  onFotosSelecionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivos = Array.from(input.files || []);

    if (!arquivos.length) return;

    if (this.fotosArquivos.length + arquivos.length > 4) {
      // alert('Você pode selecionar no máximo 4 fotos.');
      this.abrirModal('Erro','Você pode selecionar no máximo 4 fotos.');
      input.value = '';
      return;
    }

    arquivos.forEach((file) => {
      const tipoValido = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);

      if (!tipoValido) {
        // alert('Formato inválido. Use PNG, JPEG ou JPG.');
        this.abrirModal('Erro', 'Formato inválido. Use PNG, JPEG ou JPG.');
        return;
      }

      this.fotosArquivos.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.fotosPreview.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removerFoto(index: number): void {
    this.fotosArquivos.splice(index, 1);
    this.fotosPreview.splice(index, 1);
  }

  formatarPlaca(): void {
    const valor = this.veiculoForm.get('placa')?.value || '';

    const placa = valor
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 7);

    this.veiculoForm.get('placa')?.setValue(placa, { emitEvent: false });
  }

  toggleRecurso(recurso: string): void {
    const recursosSelecionados = this.veiculoForm.get('recursos')?.value || [];

    if (recursosSelecionados.includes(recurso)) {
      this.veiculoForm.patchValue({
        recursos: recursosSelecionados.filter((r: string) => r !== recurso)
      });
    } else {
      this.veiculoForm.patchValue({
        recursos: [...recursosSelecionados, recurso]
      });
    }
  }

  submit(): void {
    if (this.veiculoForm.invalid) {
      this.veiculoForm.markAllAsTouched();
      return;
    }

    const veiculo: Veiculo = {
      ...this.veiculoForm.value,
      fotosUrl: this.fotosPreview
    };

    this.veiculoSalvo.emit(veiculo);
  }

  cancelarCadastro(): void {
    this.cancelar.emit();
  }
}