
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItensService } from '../services/itens';

@Component({
  imports: [CommonModule],
  selector: 'app-servicos',
  styleUrl: './servicos.css',
  templateUrl: './servicos.html',
})
export class Servicos implements OnInit {

  servicos: any[] = [];

  categoriaSelecionada = 'Todas';

  mensagem = '';

  constructor(private itensService: ItensService) { }

  ngOnInit(): void {
    this.listarServicos();
  }

  listarServicos(): void {
    this.itensService.listarItens().subscribe({
      next: (dados) => {
        this.servicos = dados.filter(item =>
          item.tipoItem === 'S' &&
          item.ativoProdutoServico === 'S'
        );
      },
      error: (erro) => {
        console.log('Erro ao buscar serviços:', erro);
        this.mensagem = 'Não foi possível carregar os serviços.';
      }
    });
  }

  filtrarCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
  }

  get servicosFiltrados(): any[] {
    if (this.categoriaSelecionada === 'Todas') {
      return this.servicos;
    }

    return this.servicos.filter(item =>
      item.idcategoriaNavigation?.categoria === this.categoriaSelecionada
    );
  }

  get categorias(): string[] {
    return [
      'Todas',
      ...new Set(
        this.servicos.map(item => item.idcategoriaNavigation?.categoria)
          .filter(categoria => categoria)
      )
    ];
  }
}
