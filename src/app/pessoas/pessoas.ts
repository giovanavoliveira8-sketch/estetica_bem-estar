
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoasService } from '../services/pessoas.service';

@Component({
  selector: 'app-pessoas',
  imports: [CommonModule, FormsModule],
  templateUrl: './pessoas.html',
  styleUrl: './pessoas.css'
})
export class Pessoas implements OnInit {

  pessoas: any[] = [];

  nome = '';
  cpf = '';
  dataNascimento = '';
  sexo = '';
  email = '';
  telefone = '';
  ativoPessoa = '';

  cep = '';
  logradouro = '';
  numero = '';
  complemento = '';
  bairro = '';
  cidade = '';
  uf = '';

  mensagem = '';

  constructor(
    private pessoasService: PessoasService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listarPessoas();
  }

  listarPessoas(): void {
    this.pessoasService.listarPessoas().subscribe({
      next: (dados) => {
        this.pessoas = dados;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.log('Erro ao buscar pessoas:', erro);
        this.mensagem = 'Não foi possível carregar os clientes.';
        this.cdr.detectChanges();
      }
    });
  }

  cadastrarPessoa(): void {

    if (this.nome.trim() === '') {
      this.mensagem = 'Informe o nome do cliente.';
      return;
    }

    if (!/^[0-9]{11}$/.test(this.cpf)) {
      this.mensagem = 'O CPF deve possuir 11 números.';
      return;
    }

    if (this.dataNascimento === '') {
      this.mensagem = 'Informe a data de nascimento.';
      return;
    }

    const dataInformada = new Date(this.dataNascimento + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (isNaN(dataInformada.getTime()) || dataInformada > hoje) {
      this.mensagem = 'Informe uma data de nascimento válida.';
      return;
    }

    if (this.sexo.trim() === '') {
      this.mensagem = 'Informe o sexo.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.mensagem = 'Informe um e-mail válido.';
      return;
    }

    if (!/^[0-9]{10,11}$/.test(this.telefone)) {
      this.mensagem = 'O telefone deve possuir 10 ou 11 números, incluindo o DDD.';
      return;
    }

    if (this.ativoPessoa === '') {
      this.mensagem = 'Selecione o status do cliente.';
      return;
    }

    if (!/^[0-9]{8}$/.test(this.cep)) {
      this.mensagem = 'O CEP deve possuir 8 números.';
      return;
    }

    if (this.logradouro.trim() === '') {
      this.mensagem = 'Informe o logradouro.';
      return;
    }

    if (this.numero.trim() === '') {
      this.mensagem = 'Informe o número do endereço.';
      return;
    }

    if (this.bairro.trim() === '') {
      this.mensagem = 'Informe o bairro.';
      return;
    }

    if (this.cidade.trim() === '') {
      this.mensagem = 'Informe a cidade.';
      return;
    }

    if (!/^[A-Za-z]{2}$/.test(this.uf)) {
      this.mensagem = 'Informe uma UF válida com duas letras.';
      return;
    }

    const pessoa = {
      nome: this.nome.trim(),
      cpf: Number(this.cpf),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email.trim(),
      telefone: Number(this.telefone),
      ativoPessoa: this.ativoPessoa,

      enderecos: [
        {
          cep: this.cep,
          numero: this.numero.trim(),
          complemento: this.complemento.trim(),
          logradouro: this.logradouro.trim(),
          bairro: this.bairro.trim(),
          cidade: this.cidade.trim(),
          uf: this.uf.toUpperCase()
        }
      ]
    };

    this.pessoasService.cadastrarPessoa(pessoa).subscribe({
      next: () => {
        this.mensagem = 'Cliente cadastrado com sucesso!';

        this.nome = '';
        this.cpf = '';
        this.dataNascimento = '';
        this.sexo = '';
        this.email = '';
        this.telefone = '';
        this.ativoPessoa = '';

        this.cep = '';
        this.logradouro = '';
        this.numero = '';
        this.complemento = '';
        this.bairro = '';
        this.cidade = '';
        this.uf = '';

        this.cdr.detectChanges();

        this.listarPessoas();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar cliente:', erro);
        this.mensagem = 'Erro ao cadastrar cliente. Verifique os dados informados.';
        this.cdr.detectChanges();
      }
    });
  }
}
