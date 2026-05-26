import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { HeaderAluno } from '../../../components/layout/header-aluno/header-aluno';
import { Filtro } from '../../../components/layout/filtro/filtro';

interface Instrutor {
  id: string;
  nome: string;
  categoria: string;
  local: string;
  foto?: string;
  carro: string;
  preco?: number | null;
}

@Component({
  selector: 'app-home-aluno',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    HeaderAluno,
    Filtro,
  ],
  templateUrl: './home-aluno.html',
  styleUrls: ['./home-aluno.scss'],
})
export class HomeAluno implements OnInit {

  localizacao: string = 'Obtendo localização...';
  instrutores: Instrutor[] = [];
  exibeModalFiltro: boolean = false;
  usuario: any;

  private apiUrl = 'http://localhost:8081/api/usuarios/instrutores';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');

    if (user) {
      this.usuario = JSON.parse(user);
    }

    this.carregarInstrutores();

    setTimeout(() => {
      this.pegarLocalizacao();
    }, 0);
  }

  carregarInstrutores(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        console.log('Resposta bruta da API:', res);

        const lista = Array.isArray(res)
          ? res
          : res?.content ||
          res?.data ||
          res?.instrutores ||
          res?.usuarios ||
          [];

        console.log('Lista usada no map:', lista);

        if (!lista.length) {
          console.warn('Nenhum instrutor retornado pela API.');
          this.instrutores = [];
          this.cdr.detectChanges();
          return;
        }

        this.instrutores = lista.map((instrutor: any) => ({
          id: instrutor.instrutorId || instrutor.id || instrutor._id || '',

          nome: instrutor.nome || instrutor.usuario?.nome || 'Instrutor',

          foto: instrutor.fotoPerfilUrl || instrutor.foto || instrutor.usuario?.foto || '',

          categoria:
            instrutor.categoriaVeiculo ||
            instrutor.veiculo?.categoria ||
            instrutor.veiculos?.[0]?.categoria ||
            'Não informada',

          carro:
            instrutor.fotoPrincipalVeiculo ||
            instrutor.fotosVeiculo?.[0] ||
            instrutor.veiculo?.fotoPrincipal ||
            instrutor.veiculo?.fotos?.[0] ||
            instrutor.veiculos?.[0]?.fotoPrincipal ||
            instrutor.veiculos?.[0]?.fotos?.[0] ||
            '/images/carro-placeholder.png',

          local:
            instrutor.bairroCidade ||
            instrutor.localidade ||
            this.formatarLocal(instrutor.localAtendimento) ||
            this.formatarLocal(instrutor.locaisAtendimento?.[0]),

          preco: instrutor.valorAula ?? instrutor.agenda?.valorAula ?? null
        }));

        console.log('Cards montados:', this.instrutores);

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Erro ao buscar instrutores:', err);
        this.instrutores = [];
        this.cdr.detectChanges();
      }
    });
  }

  verPerfil(instrutorId: string): void {
    console.log('ID clicado no Ver mais:', instrutorId);

    if (!instrutorId) {
      console.error('Instrutor sem ID');
      return;
    }

    sessionStorage.setItem('instrutorIdSelecionado', instrutorId);

    this.router.navigateByUrl('/aluno/perfil-instrutor', {
      state: { instrutorId }
    });
  }
  formatarLocal(local: any): string {
    if (!local) return '';

    const bairro =
      local.bairro ||
      local.endereco?.bairro ||
      '';

    const cidade =
      local.cidade ||
      local.endereco?.cidade ||
      '';

    if (bairro && cidade) return `${bairro}, ${cidade}`;
    if (bairro) return bairro;
    if (cidade) return cidade;

    return local.logradouro || local.rua || '';
  }

  pegarLocalizacao(): void {
    this.localizacao = 'Buscando localização...';

    if (!('geolocation' in navigator)) {
      this.localizacao = 'Praia Grande, SP';
      this.cdr.detectChanges();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
              headers: {
                Accept: 'application/json'
              }
            }
          );

          const data = await response.json();

          const bairro =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            '';

          const cidade =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            '';

          this.localizacao = bairro
            ? `${bairro}, ${cidade}`
            : cidade || 'Praia Grande, SP';

          this.cdr.detectChanges();
        } catch (erro) {
          console.error('Erro localização:', erro);
          this.localizacao = 'Praia Grande, SP';
          this.cdr.detectChanges();
        }
      },
      (erro) => {
        console.warn('Permissão de localização negada ou erro:', erro);
        this.localizacao = 'Praia Grande, SP';
        this.cdr.detectChanges();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 60000
      }
    );
  }

  toggleModalFiltro(): void {
    this.exibeModalFiltro = !this.exibeModalFiltro;

    document.body.style.overflow = this.exibeModalFiltro
      ? 'hidden'
      : 'auto';
  }
}