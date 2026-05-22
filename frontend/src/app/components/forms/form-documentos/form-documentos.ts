import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-documentos',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-documentos.html',
  styleUrl: './form-documentos.scss',
})
export class FormDocumentos {

    form: FormGroup;
  cnhExpanded = true;
  certificadoExpanded = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      documentos: this.fb.array([])
    });

    // Inicializa CNH por padrão
    this.addDocumento('CNH');
  }

  get documentos(): FormArray {
    return this.form.get('documentos') as FormArray;
  }

  toggleAccordion(tipo: string) {
    if (tipo === 'CNH') {
      this.cnhExpanded = !this.cnhExpanded;
    } else {
      this.certificadoExpanded = !this.certificadoExpanded;
    }
  }

  addDocumento(tipo: string) {
    const doc = this.fb.group({
      tipo: [tipo],
      nomeCompleto: [''],
      numero: [''],
      dataEmissao: [''],
      dataValidade: [''],
      categoriaA: [false],
      categoriaB: [false],
      frente: [null],
      verso: [null]
    });

    this.documentos.push(doc);
  }

  removeDocumento(index: number) {
    this.documentos.removeAt(index);
  }

  onFileChange(event: any, docIndex: number, lado: 'frente' | 'verso') {
    const file = event.target.files[0];
    if (file) {
      this.documentos.at(docIndex).get(lado)?.setValue(file);
    }
  }

  salvar() {
    if (this.form.valid) {
      const formData = new FormData();

      this.documentos.controls.forEach((doc, index) => {
        formData.append(`documentos[${index}][tipo]`, doc.get('tipo')?.value);
        formData.append(`documentos[${index}][nomeCompleto]`, doc.get('nomeCompleto')?.value);
        formData.append(`documentos[${index}][numero]`, doc.get('numero')?.value);
        formData.append(`documentos[${index}][dataEmissao]`, doc.get('dataEmissao')?.value);
        formData.append(`documentos[${index}][dataValidade]`, doc.get('dataValidade')?.value);
        formData.append(`documentos[${index}][categoriaA]`, doc.get('categoriaA')?.value);
        formData.append(`documentos[${index}][categoriaB]`, doc.get('categoriaB')?.value);
        if (doc.get('frente')?.value) formData.append(`documentos[${index}][frente]`, doc.get('frente')?.value);
        if (doc.get('verso')?.value) formData.append(`documentos[${index}][verso]`, doc.get('verso')?.value);
      });

      // Aqui você envia o formData para o backend via HttpClient
      console.log('Enviando documentos...', formData);
    }
  }

}
