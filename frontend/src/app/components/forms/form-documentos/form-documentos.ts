import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-documentos.html',
  styleUrl: './form-documentos.scss',
})
export class FormDocumentos implements OnChanges {
  @Input() instrutor: any;
  @Input() abaAtiva: string = '';

  form: FormGroup;
  cnhExpanded = true;
  certificadoExpanded = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      documentos: this.fb.array([])
    });
  }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['instrutor'] ||
      changes['abaAtiva']
    ) {
      if (this.abaAtiva === 'documentos' && this.instrutor) {
        this.carregarDocumentos();
      }
    }
  }

  get documentos(): FormArray {
    return this.form.get('documentos') as FormArray;
  }

  carregarDocumentos(): void {
    this.documentos.clear();

    console.log('CNH RECEBIDA:', this.instrutor?.cnh);

    if (this.instrutor.cnh) {
      this.documentos.push(this.criarDocumentoForm('CNH', this.instrutor.cnh));
    } else {
      this.documentos.push(this.criarDocumentoForm('CNH'));
    }

    if (this.instrutor.credencialInstrutor) {
      this.documentos.push(this.criarDocumentoForm('CERTIFICADO', this.instrutor.credencialInstrutor));
    } else {
      this.documentos.push(this.criarDocumentoForm('CERTIFICADO'));
    }
  }

  criarDocumentoForm(tipo: string, doc: any = {}): FormGroup {
    return this.fb.group({
      tipo: [tipo],
      nomeCompleto: [doc.nomeCompleto || ''],
      numeroDocumento: [doc.numeroDocumento || ''],
      dataEmissao: [doc.dataEmissao || ''],
      dataValidade: [doc.dataValidade || ''],
      categoriaA: [doc.categorias?.includes('A') || false],
      categoriaB: [doc.categorias?.includes('B') || false],
      frente: [doc.fotoFrenteUrl || null],
      verso: [doc.fotoVersoUrl || null],
      statusValidacao: [doc.statusValidacao || 'PENDENTE']
    });
  }

  toggleAccordion(tipo: string): void {
    if (tipo === 'CNH') {
      this.cnhExpanded = !this.cnhExpanded;
    } else {
      this.certificadoExpanded = !this.certificadoExpanded;
    }
  }

onFileChange(
  event: any,
  docIndex: number,
  lado: 'frente' | 'verso'
): void {

  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

    this.documentos
      .at(docIndex)
      .get(lado)
      ?.setValue(reader.result);

  };

  reader.readAsDataURL(file);
}

  salvar(): void {
    console.log('Documentos atualizados:', this.form.value);
  }
}