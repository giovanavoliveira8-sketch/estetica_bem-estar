
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
      }
    });
  }

  cadastrarPessoa(): void {
    const pessoa = {
      nome: this.nome,
      cpf: Number(this.cpf),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email,
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
        this.mensagem = 'Erro ao cadastrar cliente.';
      }
    });
  }
}
