
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-gerenciar-clientes',
  styleUrl: './gerenciar-clientes.css',
  templateUrl: './gerenciar-clientes.html',
})
export class GerenciarClientes implements OnInit {

  clientes: any[] = [];
  clienteSelecionado: any = null;

  idBusca: string | number = '';
  mensagem = '';
  carregando = false;
  consultaRealizada = false;

  private url = 'http://localhost:5233/api/PessoaEndereco';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {

    this.carregando = true;
    this.mensagem = '';

    this.http.get<any[]>(this.url).subscribe({
      next: (dados) => {

        this.clientes = dados;
        this.carregando = false;

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao listar clientes:', erro);

        this.mensagem = 'Não foi possível carregar os clientes.';
        this.carregando = false;

        this.cdr.detectChanges();
      }
    });
  }

  consultarCliente(): void {

    const textoId = String(this.idBusca).trim();

    if (textoId === '') {
      this.mensagem = 'Informe o ID do cliente.';
      return;
    }

    const id = Number(textoId);

    if (isNaN(id) || id <= 0) {
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.mensagem = '';
    this.clienteSelecionado = null;
    this.consultaRealizada = true;

    this.http.get<any>(this.url + '/' + id).subscribe({
      next: (dados) => {

        this.clienteSelecionado = dados;
        this.mensagem = '';

        this.cdr.detectChanges();
      },
      error: (erro) => {

        console.log('Erro ao consultar cliente:', erro);

        this.mensagem = 'Cliente não encontrado.';
        this.cdr.detectChanges();
      }
    });
  }

  limparConsulta(): void {

    this.idBusca = '';
    this.clienteSelecionado = null;
    this.mensagem = '';
    this.consultaRealizada = false;

  }

}
