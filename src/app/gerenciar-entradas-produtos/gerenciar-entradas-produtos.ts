
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-gerenciar-entradas-produtos',
  styleUrl: './gerenciar-entradas-produtos.css',
  templateUrl: './gerenciar-entradas-produtos.html',
})
export class GerenciarEntradasProdutos implements OnInit {

  produtos: any[] = [];
  entradas: any[] = [];

  mensagem = '';
  carregando = false;
  cadastrando = false;

  entradaForm = {
    identradaProduto: 0,
    iditem: 0,
    dataEntradaProduto: '',
    quantidadeEntrada: 0,
    unidade: 'UN',
    valorUnitarioEntrada: 0
  };

  private url = 'http://localhost:5233/api/EntradaProduto';
  private urlProdutos = 'http://localhost:5233/api/ProdutoItem';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarProdutos();
    this.listarEntradas();
  }

  listarProdutos(): void {
    this.http.get<any[]>(this.urlProdutos).subscribe({
      next: (dados) => {
        this.produtos = dados.filter(produto =>
          produto.iditemNavigation &&
          produto.iditemNavigation.tipoItem === 'P' &&
          produto.iditemNavigation.ativoProdutoServico === 'S'
        );

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar produtos:', erro);
        this.mensagem = 'Não foi possível carregar os produtos.';
        this.cdr.detectChanges();
      }
    });
  }

  listarEntradas(): void {
    this.carregando = true;

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.entradas = dados.sort((a, b) =>
          b.identradaProduto - a.identradaProduto
        );

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar entradas:', erro);
        this.mensagem = 'Não foi possível carregar as entradas.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  cadastrarEntrada(): void {

    if (
      this.entradaForm.identradaProduto <= 0 ||
      this.entradaForm.iditem <= 0 ||
      this.entradaForm.dataEntradaProduto === '' ||
      this.entradaForm.quantidadeEntrada <= 0 ||
      !Number.isInteger(Number(this.entradaForm.quantidadeEntrada)) ||
      this.entradaForm.unidade.trim() === '' ||
      this.entradaForm.valorUnitarioEntrada <= 0
    ) {
      this.mensagem = 'Preencha todos os campos corretamente. A quantidade deve ser um número inteiro positivo.';
      return;
    }

    this.mensagem = '';
    this.cadastrando = true;

    this.http.post(this.url, this.entradaForm).subscribe({
      next: () => {
        this.mensagem = 'Entrada de produto cadastrada com sucesso! O estoque foi atualizado.';
        this.novaEntrada();
        this.listarEntradas();
        this.cadastrando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar entrada:', erro);

        this.mensagem = 'Não foi possível cadastrar a entrada. Verifique se o ID informado já está cadastrado para esse produto.';

        this.cadastrando = false;
        this.cdr.detectChanges();
      }
    });
  }

  novaEntrada(): void {
    this.entradaForm = {
      identradaProduto: 0,
      iditem: 0,
      dataEntradaProduto: '',
      quantidadeEntrada: 0,
      unidade: 'UN',
      valorUnitarioEntrada: 0
    };
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
