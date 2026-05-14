import { Component } from '@angular/core';
import { Footer } from '../../components/layout/footer/footer';
import { Header } from '../../components/layout/header/header';

interface Categoria {
  nome: string;
  ativa: boolean;
}

interface Instrutor {
  nome: string;
  nota: number;
  categoria: string;
  descricao: string;
  foto: string;
  avatar: string;
}

@Component({
  selector: 'app-ver-instrutores',
  imports: [
    Header,
    Footer,
  ],
  templateUrl: './ver-instrutores.html',
  styleUrl: './ver-instrutores.scss',
})
export class VerInstrutores {

  pesquisa = 'Quietude';

  categorias: Categoria[] = [
    { nome: 'Categoria A', ativa: false },
    { nome: 'Categoria B', ativa: true },
    { nome: 'Ar-condicionado', ativa: true },
    { nome: 'Duplo comando', ativa: false },
    { nome: 'Direção elétrica', ativa: false },
    { nome: 'Direção hidráulica', ativa: false },
    { nome: 'Travas elétricas', ativa: false }
  ];

  instrutores: Instrutor[] = [
    {
      nome: 'João',
      nota: 4.9,
      categoria: 'Categoria B',
      descricao: 'Chevrolet Onix Branco 2023 • Bom para iniciantes',
      foto: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=11'
    },

    {
      nome: 'Mário',
      nota: 4.9,
      categoria: 'Categoria B',
      descricao: 'Toyota Corolla Branco 1991 • Duplo comando',
      foto: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=12'
    },

    {
      nome: 'Neusa',
      nota: 4.9,
      categoria: 'Categoria B',
      descricao: 'Chevrolet Onix Vermelho 2023',
      foto: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=13'
    },

    {
      nome: 'Cleber',
      nota: 4.9,
      categoria: 'Categoria B',
      descricao: 'Volkswagen T-Cross Cinza 2025 • Ar-condicionado',
      foto: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=14'
    },

    {
      nome: 'Francisco',
      nota: 4.8,
      categoria: 'Categoria B',
      descricao: 'Hyundai HB20 Azul 2025 • Ar-condicionado',
      foto: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=15'
    },

    {
      nome: 'Renato',
      nota: 4.8,
      categoria: 'Categoria B',
      descricao: 'Jeep Compass Verde 2026 • Duplo comando',
      foto: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      avatar: 'https://i.pravatar.cc/100?img=16'
    }
  ];

  toggleCategoria(categoria: Categoria): void {
    categoria.ativa = !categoria.ativa;
  }

}
