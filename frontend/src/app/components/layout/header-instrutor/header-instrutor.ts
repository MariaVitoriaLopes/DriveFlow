import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header-instrutor',
  imports: [RouterLink],
  templateUrl: './header-instrutor.html',
  styleUrl: './header-instrutor.scss',
})
export class HeaderInstrutor {
  async compartilhar() {

  const link = window.location.href;

  // Se o celular suporta compartilhamento nativo
  if (navigator.share) {

    try {

      await navigator.share({
        title: 'Meu site',
        text: 'Olha isso aqui',
        url: link
      });

    } catch (erro) {
      console.log('Compartilhamento cancelado');
    }

  } else {

    // FALLBACK para celulares/navegadores antigos

    if (navigator.clipboard) {

      await navigator.clipboard.writeText(link);

    } else {

      const textarea = document.createElement('textarea');

      textarea.value = link;

      document.body.appendChild(textarea);

      textarea.select();

      document.execCommand('copy');

      document.body.removeChild(textarea);
    }

    alert('Seu navegador não suporta compartilhamento. O link foi copiado!');
  }
}
}
