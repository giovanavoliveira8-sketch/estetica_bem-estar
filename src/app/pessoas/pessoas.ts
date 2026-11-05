
import { Component, OnInit } from '@angular/core';
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

  mensagem = '';

  constructor(private pessoasService: PessoasService) { }

  ngOnInit(): void {
    this.listarPessoas();
  }

  listarPessoas(): void {
    this.pessoasService.listarPessoas().subscribe({
      next: (dados) => {
        this.pessoas = dados;
      },
      error: (erro) => {
        console.log('Erro ao buscar pessoas:', erro);
        this.mensagem = 'Não foi possível carregar os clientes.';
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

    const pessoa = {
      nome: this.nome.trim(),
      cpf: Number(this.cpf),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email.trim(),
      telefone: Number(this.telefone),
      ativoPessoa: this.ativoPessoa
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

        this.listarPessoas();
      },
      error: (erro) => {
        console.log('Erro ao cadastrar cliente:', erro);
        this.mensagem = 'Erro ao cadastrar cliente. Verifique os dados informados.';
      }
    });
  }
}
