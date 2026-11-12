
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-gerenciar-categorias',
  styleUrl: '../gerenciar-servicos/gerenciar-servicos.css',
  templateUrl: './gerenciar-categorias.html',
})
export class GerenciarCategorias implements OnInit {

  categorias: any[] = [];
  categoriaSelecionada: any = null;

  idBusca: string | number = '';
  mensagem = '';
  carregando = false;
  editando = false;
  idEdicao = 0;

  categoriaForm = {
    categoria: ''
  };

  private url = 'http://localhost:5233/api/Categorium';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.categorias = dados.sort(
          (a, b) => a.idcategoria - b.idcategoria
        );

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar categorias:', erro);
        this.mensagem = 'Não foi possível carregar as categorias.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  consultarCategoria(): void {
    const textoId = String(this.idBusca).trim();

    if (textoId === '') {
      this.mensagem = 'Informe o ID da categoria.';
      return;
    }

    const id = Number(textoId);

    if (isNaN(id) || id <= 0) {
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.mensagem = '';
    this.categoriaSelecionada = null;

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {
        this.categoriaSelecionada = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao consultar categoria:', erro);
        this.mensagem = 'Categoria não encontrada.';
        this.cdr.detectChanges();
      }
    });
  }

  consultarCategoriaPelaLista(id: number): void {
    this.idBusca = id;
    this.consultarCategoria();
  }

  limparConsulta(): void {
    this.idBusca = '';
    this.categoriaSelecionada = null;
    this.mensagem = '';
  }

  novaCategoria(): void {
    this.editando = false;
    this.idEdicao = 0;

    this.categoriaForm = {
      categoria: ''
    };
  }

  cadastrarCategoria(): void {
    if (this.categoriaForm.categoria.trim() === '') {
      this.mensagem = 'Informe o nome da categoria.';
      return;
    }

    const dados = {
      categoria: this.categoriaForm.categoria.trim()
    };

    this.http.post(this.url, dados).subscribe({
      next: () => {
        this.mensagem = 'Categoria cadastrada com sucesso!';
        this.novaCategoria();
        this.listarCategorias();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar categoria:', erro);
        this.mensagem = 'Não foi possível cadastrar a categoria.';
        this.cdr.detectChanges();
      }
    });
  }

  selecionarEdicao(categoria: any): void {
    this.editando = true;
    this.idEdicao = categoria.idcategoria;

    this.categoriaForm = {
      categoria: categoria.categoria
    };

    this.mensagem = '';

    document.getElementById('formulario')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  editarCategoria(): void {
    if (this.categoriaForm.categoria.trim() === '') {
      this.mensagem = 'Informe o nome da categoria.';
      return;
    }

    const dados = {
      idcategoria: this.idEdicao,
      categoria: this.categoriaForm.categoria.trim()
    };

    this.http.put(this.url + '/' + this.idEdicao, dados).subscribe({
      next: () => {
        this.mensagem = 'Categoria atualizada com sucesso!';
        this.novaCategoria();
        this.listarCategorias();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao editar categoria:', erro);
        this.mensagem = 'Não foi possível atualizar a categoria.';
        this.cdr.detectChanges();
      }
    });
  }

  excluirCategoria(categoria: any): void {
    this.http.delete(this.url + '/' + categoria.idcategoria).subscribe({
      next: () => {
        this.mensagem = 'Categoria excluída com sucesso!';
        this.categoriaSelecionada = null;
        this.listarCategorias();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao excluir categoria:', erro);

        if (erro.status === 409) {
          this.mensagem = 'Não é possível excluir esta categoria porque existem produtos ou serviços vinculados a ela.';
        } else {
          this.mensagem = 'Não foi possível excluir a categoria.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}
