
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule],
  selector: 'app-gerenciar-estoque',
  styleUrl: './gerenciar-estoque.css',
  templateUrl: './gerenciar-estoque.html',
})
export class GerenciarEstoque implements OnInit {

  estoques: any[] = [];
  produtos: any[] = [];

  mensagem = '';
  carregando = false;

  private urlEstoque = 'http://localhost:5233/api/Estoque';
  private urlProdutos = 'http://localhost:5233/api/ProdutoItem';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarProdutos();
    this.listarEstoque();
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.urlProdutos).subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar produtos:', erro);
      }
    });
  }

  listarEstoque(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<any[]>(this.urlEstoque).subscribe({
      next: (dados) => {
        this.estoques = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao consultar estoque:', erro);
        this.mensagem = 'Não foi possível carregar o estoque.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obterNomeProduto(iditem: number): string {
    const produto = this.produtos.find(p =>
      p.iditem === iditem
    );

    if (produto && produto.iditemNavigation) {
      return produto.iditemNavigation.item1;
    }

    return 'Produto ID ' + iditem;
  }
}
