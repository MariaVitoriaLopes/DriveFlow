import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-form-add-novo-veiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form-add-novo-veiculo.html',
  styleUrls: ['./form-add-novo-veiculo.scss'],
})
export class FormAddNovoVeiculo implements OnInit {

  @Output() veiculoSalvo = new EventEmitter<any>();

  @ViewChild('mainFile') mainFile!: ElementRef;
  @ViewChild('sideFile') sideFile!: ElementRef;

  veiculoForm!: FormGroup;

  marcas = ['Fiat', 'Chevrolet', 'Volkswagen', 'Ford'];
  versoes = ['LT 1.0', 'LT 1.4', 'EX 1.6'];
  cores = ['Branco', 'Preto', 'Prata'];
  anos = Array.from({length: 30}, (_, i) => 2023 - i);
  cambios = ['Manual', 'Automático'];
  categorias = ['Categoria A (Moto)', 'Categoria B (Carro)'];
  recursos = ['Ar-condicionado', 'ABS', 'Duplo comando', 'Direção elétrica', 'Direção hidráulica', 'Travas elétricas'];

  mainImageUrl: string | null = null;
  sideImages: (string | null)[] = [null, null, null];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.veiculoForm = this.fb.group({
      marca: [''],
      versao: [''],
      modelo: [''],
      cor: [''],
      ano: [''],
      placa: [''],
      cambio: [''],
      categoria: [''],
      recursos: [[]],
      infoExtra: [''],
      padrao: [false]
    });
  }

  uploadMainImage() {
    this.mainFile.nativeElement.click();
  }

  onMainImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.mainImageUrl = URL.createObjectURL(file);
  }

  uploadSideImage(index: number) {
    this.sideFile.nativeElement.click();
  }

  onSideImageSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) this.sideImages[index] = URL.createObjectURL(file);
  }

  toggleRecurso(rec: string) {
    const recursos = this.veiculoForm.value.recursos;
    if (recursos.includes(rec)) {
      this.veiculoForm.patchValue({ recursos: recursos.filter((r: string) => r !== rec) });
    } else {
      this.veiculoForm.patchValue({ recursos: [...recursos, rec] });
    }
  }

  submit() {
    if (!this.veiculoForm.valid) return;

    const formData = new FormData();
    Object.entries(this.veiculoForm.value).forEach(([key, value]) => {
      if (key === 'recursos') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as any);
      }
    });

    if (this.mainFile.nativeElement.files[0]) {
      formData.append('imagemPrincipal', this.mainFile.nativeElement.files[0]);
    }

    this.sideFile.nativeElement.files?.forEach((file: File) => {
      formData.append('imagensLaterais', file);
    });

    // POST direto para API
    this.http.post('http://localhost:8081/api/veiculos', formData)
      .pipe(
        catchError(err => {
          alert('Erro ao salvar veículo!');
          throw err;
        })
      )
      .subscribe((res: any) => {
        // Backend respondeu sucesso → emite evento para pai
        this.veiculoSalvo.emit(res);

        // Limpa o formulário
        this.veiculoForm.reset();
        this.mainImageUrl = null;
        this.sideImages = [null, null, null];
      });
  }
}