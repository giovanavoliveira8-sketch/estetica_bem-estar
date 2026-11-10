
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-gerenciar-produtos',
  styleUrl: './gerenciar-produtos.css',
  templateUrl: './gerenciar-produtos.html',
})
export class GerenciarProdutos implements OnInit {

  produtos: any[] = [];
  categorias: any[] = [];
  produtoSelecionado: any = null;

  idBusca: string | number = '';
  mensagem = '';
  carregando = false;
  consultaRealizada = false;
  editando = false;
  idEdicao = 0;

  produtoForm = {
    idcategoria: 0,
    item: '',
    descricaoItem: '',
    preco: 0,
    tipoItem: 'P',
    ativoProdutoServico: 'S',
    codigoPreco: 1,
    precoVenda: 0,
    unidade: 'UN'
  };

  private url = 'http://localhost:5233/api/ProdutoItem';
  private urlCategorias = 'http://localhost:5233/api/Categorium';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarProdutos();
    this.listarCategorias();
  }

  listarProdutos(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.produtos = dados
          .filter(produto => produto.iditemNavigation.tipoItem === 'P')
          .sort((a, b) => a.iditem - b.iditem);

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar produtos:', erro);
        this.mensagem = 'Não foi possível carregar os produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  listarCategorias(): void {
    this.http.get<any[]>(this.urlCategorias).subscribe({
      next: (dados) => {
        this.categorias = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar categorias:', erro);
      }
    });
  }

  ajustarAltura(event: Event): void {
    const campo = event.target as HTMLTextAreaElement;

    campo.style.height = '42px';
    campo.style.height = campo.scrollHeight + 'px';
  }

  consultarProduto(): void {
    const textoId = String(this.idBusca).trim();

    if (textoId === '') {
      this.mensagem = 'Informe o ID do produto.';
      return;
    }

    const id = Number(textoId);

    if (isNaN(id) || id <= 0) {
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.mensagem = '';
    this.produtoSelecionado = null;
    this.consultaRealizada = true;

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {
        if (dados.iditemNavigation.tipoItem !== 'P') {
          this.mensagem = 'O ID informado não pertence a um produto.';
          this.produtoSelecionado = null;
        } else {
          this.produtoSelecionado = dados;
        }

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao consultar produto:', erro);
        this.mensagem = 'Produto não encontrado.';
        this.cdr.detectChanges();
      }
    });
  }

  consultarProdutoPelaLista(id: number): void {
    this.idBusca = id;
    this.consultarProduto();
  }

  limparConsulta(): void {
    this.idBusca = '';
    this.produtoSelecionado = null;
    this.mensagem = '';
    this.consultaRealizada = false;
  }

  novoProduto(): void {
    this.editando = false;
    this.idEdicao = 0;

    this.produtoForm = {
      idcategoria: 0,
      item: '',
      descricaoItem: '',
      preco: 0,
      tipoItem: 'P',
      ativoProdutoServico: 'S',
      codigoPreco: 1,
      precoVenda: 0,
      unidade: 'UN'
    };
  }

  cadastrarProduto(): void {
    if (
      this.produtoForm.idcategoria <= 0 ||
      this.produtoForm.item.trim() === '' ||
      this.produtoForm.descricaoItem.trim() === '' ||
      this.produtoForm.preco <= 0 ||
      this.produtoForm.precoVenda <= 0
    ) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.produtoForm.tipoItem = 'P';
    this.produtoForm.ativoProdutoServico = 'S';

    this.http.post(this.url, this.produtoForm).subscribe({
      next: () => {
        this.mensagem = 'Produto cadastrado com sucesso!';
        this.novoProduto();
        this.listarProdutos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar produto:', erro);
        this.mensagem = 'Não foi possível cadastrar o produto.';
        this.cdr.detectChanges();
      }
    });
  }

  selecionarEdicao(produto: any): void {
    this.editando = true;
    this.idEdicao = produto.iditem;

    this.produtoForm = {
      idcategoria: produto.iditemNavigation.idcategoria,
      item: produto.iditemNavigation.item1,
      descricaoItem: produto.iditemNavigation.descricaoItem,
      preco: produto.iditemNavigation.preco,
      tipoItem: 'P',
      ativoProdutoServico: produto.iditemNavigation.ativoProdutoServico,
      codigoPreco: produto.codigoPreco,
      precoVenda: produto.precoVenda,
      unidade: produto.unidade
    };

    this.mensagem = '';
  }

  editarProduto(): void {
    if (
      this.produtoForm.idcategoria <= 0 ||
      this.produtoForm.item.trim() === '' ||
      this.produtoForm.descricaoItem.trim() === '' ||
      this.produtoForm.preco <= 0 ||
      this.produtoForm.precoVenda <= 0
    ) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.produtoForm.tipoItem = 'P';

    this.http.put(this.url + '/' + this.idEdicao, this.produtoForm).subscribe({
      next: () => {
        this.mensagem = 'Produto atualizado com sucesso!';
        this.novoProduto();
        this.listarProdutos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao editar produto:', erro);
        this.mensagem = 'Não foi possível atualizar o produto.';
        this.cdr.detectChanges();
      }
    });
  }

  desativarProduto(produto: any): void {

    this.http.delete(this.url + '/' + produto.iditem).subscribe({
      next: () => {
        this.mensagem = 'Produto desativado com sucesso!';
        this.produtoSelecionado = null;
        this.listarProdutos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao desativar produto:', erro);
        this.mensagem = 'Não foi possível desativar o produto.';
        this.cdr.detectChanges();
      }
    });
  }

  reativarProduto(produto: any): void {

    const dados = {
      idcategoria: produto.iditemNavigation.idcategoria,
      item: produto.iditemNavigation.item1,
      descricaoItem: produto.iditemNavigation.descricaoItem,
      preco: produto.iditemNavigation.preco,
      tipoItem: 'P',
      ativoProdutoServico: 'S',
      codigoPreco: produto.codigoPreco,
      precoVenda: produto.precoVenda,
      unidade: produto.unidade
    };
  
    this.http.put(this.url + '/' + produto.iditem, dados).subscribe({
      next: () => {
        this.mensagem = 'Produto reativado com sucesso!';
        this.produtoSelecionado = null;
        this.listarProdutos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao reativar produto:', erro);
        this.mensagem = 'Não foi possível reativar o produto.';
        this.cdr.detectChanges();
      }
    });
  }
}
