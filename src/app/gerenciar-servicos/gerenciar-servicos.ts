
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-gerenciar-servicos',
  styleUrl: './gerenciar-servicos.css',
  templateUrl: './gerenciar-servicos.html',
})
export class GerenciarServicos implements OnInit {

  servicos: any[] = [];
  categorias: any[] = [];
  servicoSelecionado: any = null;

  idBusca: string | number = '';
  mensagem = '';
  carregando = false;
  editando = false;
  idEdicao = 0;

  servicoForm = {
    idcategoria: 0,
    item1: '',
    descricaoItem: '',
    preco: 0,
    tipoItem: 'S',
    ativoProdutoServico: 'S'
  };

  private url = 'http://localhost:5233/api/Item';
  private urlCategorias = 'http://localhost:5233/api/Categorium';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarServicos();
    this.listarCategorias();
  }

  listarServicos(): void {
    this.carregando = true;
    this.mensagem = '';

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {
        this.servicos = dados
          .filter(servico => servico.tipoItem === 'S')
          .sort((a, b) => a.iditem - b.iditem);

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao listar serviços:', erro);
        this.mensagem = 'Não foi possível carregar os serviços.';
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

  consultarServico(): void {
    const textoId = String(this.idBusca).trim();

    if (textoId === '') {
      this.mensagem = 'Informe o ID do serviço.';
      return;
    }

    const id = Number(textoId);

    if (isNaN(id) || id <= 0) {
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.mensagem = '';
    this.servicoSelecionado = null;

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {
        if (dados.tipoItem !== 'S') {
          this.mensagem = 'O ID informado não pertence a um serviço.';
        } else {
          this.servicoSelecionado = dados;
        }

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao consultar serviço:', erro);
        this.mensagem = 'Serviço não encontrado.';
        this.cdr.detectChanges();
      }
    });
  }

  consultarServicoPelaLista(id: number): void {
    this.idBusca = id;
    this.consultarServico();
  }

  limparConsulta(): void {
    this.idBusca = '';
    this.servicoSelecionado = null;
    this.mensagem = '';
  }

  novoServico(): void {
    this.editando = false;
    this.idEdicao = 0;

    this.servicoForm = {
      idcategoria: 0,
      item1: '',
      descricaoItem: '',
      preco: 0,
      tipoItem: 'S',
      ativoProdutoServico: 'S'
    };
  }

  cadastrarServico(): void {
    if (
      this.servicoForm.idcategoria <= 0 ||
      this.servicoForm.item1.trim() === '' ||
      this.servicoForm.descricaoItem.trim() === '' ||
      this.servicoForm.preco <= 0
    ) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    this.servicoForm.tipoItem = 'S';
    this.servicoForm.ativoProdutoServico = 'S';

    this.http.post(this.url, this.servicoForm).subscribe({
      next: () => {
        this.mensagem = 'Serviço cadastrado com sucesso!';
        this.novoServico();
        this.listarServicos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar serviço:', erro);
        this.mensagem = 'Não foi possível cadastrar o serviço.';
        this.cdr.detectChanges();
      }
    });
  }

  selecionarEdicao(servico: any): void {
    this.editando = true;
    this.idEdicao = servico.iditem;

    this.servicoForm = {
      idcategoria: servico.idcategoria,
      item1: servico.item1,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco,
      tipoItem: 'S',
      ativoProdutoServico: servico.ativoProdutoServico
    };

    this.mensagem = '';
  }

  editarServico(): void {
    if (
      this.servicoForm.idcategoria <= 0 ||
      this.servicoForm.item1.trim() === '' ||
      this.servicoForm.descricaoItem.trim() === '' ||
      this.servicoForm.preco <= 0
    ) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const dados = {
      iditem: this.idEdicao,
      idcategoria: this.servicoForm.idcategoria,
      item1: this.servicoForm.item1,
      descricaoItem: this.servicoForm.descricaoItem,
      preco: this.servicoForm.preco,
      tipoItem: 'S',
      ativoProdutoServico: this.servicoForm.ativoProdutoServico
    };

    this.http.put(this.url + '/' + this.idEdicao, dados).subscribe({
      next: () => {
        this.mensagem = 'Serviço atualizado com sucesso!';
        this.novoServico();
        this.listarServicos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao editar serviço:', erro);
        this.mensagem = 'Não foi possível atualizar o serviço.';
        this.cdr.detectChanges();
      }
    });
  }

  desativarServico(servico: any): void {
    this.http.delete(this.url + '/' + servico.iditem).subscribe({
      next: () => {
        this.mensagem = 'Serviço desativado com sucesso!';
        this.servicoSelecionado = null;
        this.listarServicos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao desativar serviço:', erro);
        this.mensagem = 'Não foi possível desativar o serviço.';
        this.cdr.detectChanges();
      }
    });
  }

  reativarServico(servico: any): void {
    const dados = {
      iditem: servico.iditem,
      idcategoria: servico.idcategoria,
      item1: servico.item1,
      descricaoItem: servico.descricaoItem,
      preco: servico.preco,
      tipoItem: 'S',
      ativoProdutoServico: 'S'
    };

    this.http.put(this.url + '/' + servico.iditem, dados).subscribe({
      next: () => {
        this.mensagem = 'Serviço reativado com sucesso!';
        this.servicoSelecionado = null;
        this.listarServicos();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao reativar serviço:', erro);
        this.mensagem = 'Não foi possível reativar o serviço.';
        this.cdr.detectChanges();
      }
    });
  }
}
