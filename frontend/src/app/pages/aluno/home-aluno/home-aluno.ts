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
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('usuario');

    if (user) {
      this.usuario = JSON.parse(user);
    }

    this.pegarLocalizacao();
    this.carregarInstrutores();
  }

  carregarInstrutores(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        this.instrutores = res.map((instrutor) => {
          const veiculo = instrutor.veiculos?.[0] || instrutor.veiculo || null;

          const localFavorito =
            instrutor.locaisAtendimento?.find((l: any) => l.favorito === true) ||
            instrutor.locaisAtendimento?.[0] ||
            instrutor.localAtendimento ||
            null;

          return {
            id:
              instrutor.id ||
              instrutor._id ||
              instrutor.usuario?.id ||
              '',

            nome:
              instrutor.usuario?.nome ||
              instrutor.nome ||
              'Instrutor',

            foto:
              instrutor.usuario?.foto ||
              instrutor.foto ||
              '',

            categoria:
              veiculo?.categoria ||
              'Não informada',

            carro:
              veiculo?.fotoPrincipal ||
              veiculo?.foto ||
              veiculo?.imagem ||
              veiculo?.mainImageUrl ||
              '/images/carro-placeholder.png',

            local: this.formatarLocal(localFavorito),

            preco:
              instrutor.agenda?.valorAula ||
              instrutor.valorAula ||
              null
          };
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar instrutores:', err);
      }
    });
  }

  verPerfil(instrutorId: string): void {
    if (!instrutorId) {
      console.error('Instrutor sem ID');
      return;
    }

    sessionStorage.setItem('instrutorIdSelecionado', instrutorId);

    this.router.navigate(['/aluno/perfil-instrutor'], {
      state: { instrutorId }
    });
  }

  formatarLocal(local: any): string {
    if (!local) return 'Local não informado';

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

    return local.logradouro || 'Local não informado';
  }

  pegarLocalizacao(): void {
    this.localizacao = 'Buscando localização...';

    if ('geolocation' in navigator) {
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
              : cidade || 'Endereço não encontrado';

            this.cdr.detectChanges();

          } catch (erro) {
            console.error('Erro localização:', erro);
            this.localizacao = 'Praia Grande, SP';
            this.cdr.detectChanges();
          }
        },
        () => {
          this.localizacao = 'Praia Grande, SP';
          this.cdr.detectChanges();
        }
      );
    } else {
      this.localizacao = 'Praia Grande, SP';
    }
  }

  toggleModalFiltro(): void {
    this.exibeModalFiltro = !this.exibeModalFiltro;
  }
}