
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuncionariosService } from '../services/funcionarios';

@Component({
  selector: 'app-funcionarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css'
})
export class Funcionarios implements OnInit {

  funcionarios: any[] = [];

  nome = '';
  cpf = '';
  dataNascimento = '';
  sexo = '';
  email = '';
  telefone = '';
  ativoPessoa = 'S';

  cargo = '';
  dataAdmissao = '';

  cep = '';
  numero = '';
  complemento = '';

  idPessoaEdicao: number | null = null;
  mensagem = '';

  constructor(private funcionariosService: FuncionariosService) { }

  ngOnInit(): void {
    this.listarFuncionarios();
  }

  listarFuncionarios(): void {
    this.funcionariosService.listarFuncionarios().subscribe({
      next: (dados) => {
        this.funcionarios = dados;
      },
      error: (erro) => {
        console.log('Erro ao buscar funcionários:', erro);
        this.mensagem = 'Não foi possível carregar os funcionários.';
      }
    });
  }

  cadastrarFuncionario(): void {
    const funcionario = {
      nome: this.nome,
      cpf: Number(this.cpf),
      dataNascimento: this.dataNascimento,
      sexo: this.sexo,
      email: this.email,
      telefone: Number(this.telefone),
      ativoPessoa: this.ativoPessoa,
      cargo: this.cargo,
      dataAdmissao: this.dataAdmissao,
      enderecos: [
        {
          cep: this.cep,
          numero: this.numero,
          complemento: this.complemento
        }
      ]
    };

    if (this.idPessoaEdicao === null) {
      this.funcionariosService.cadastrarFuncionario(funcionario).subscribe({
        next: () => {
          this.mensagem = 'Funcionário cadastrado com sucesso!';
          this.limparFormulario();
          this.listarFuncionarios();
        },
        error: (erro) => {
          console.log('Erro ao cadastrar funcionário:', erro);
          this.mensagem = 'Erro ao cadastrar funcionário.';
        }
      });
    } else {
      this.funcionariosService.atualizarFuncionario(
        this.idPessoaEdicao,
        funcionario
      ).subscribe({
        next: () => {
          this.mensagem = 'Funcionário atualizado com sucesso!';
          this.limparFormulario();
          this.listarFuncionarios();
        },
        error: (erro) => {
          console.log('Erro ao atualizar funcionário:', erro);
          this.mensagem = 'Erro ao atualizar funcionário.';
        }
      });
    }
  }

  editarFuncionario(funcionario: any): void {
    this.idPessoaEdicao = funcionario.idPessoa;

    this.nome = funcionario.nome;
    this.cpf = String(funcionario.cpf);
    this.dataNascimento = funcionario.dataNascimento;
    this.sexo = funcionario.sexo;
    this.email = funcionario.email;
    this.telefone = String(funcionario.telefone);
    this.ativoPessoa = funcionario.ativoPessoa;

    this.cargo = funcionario.cargo;
    this.dataAdmissao = funcionario.dataAdmissao;

    if (funcionario.enderecos && funcionario.enderecos.length > 0) {
      this.cep = funcionario.enderecos[0].cep;
      this.numero = funcionario.enderecos[0].numero;
      this.complemento = funcionario.enderecos[0].complemento || '';
    }

    this.mensagem = 'Editando funcionário.';
  }

  excluirFuncionario(id: number): void {
    if (confirm('Deseja realmente excluir este funcionário?')) {
      this.funcionariosService.excluirFuncionario(id).subscribe({
        next: () => {
          this.mensagem = 'Funcionário excluído com sucesso!';
          this.listarFuncionarios();
        },
        error: (erro) => {
          console.log('Erro ao excluir funcionário:', erro);
          this.mensagem = 'Erro ao excluir funcionário.';
        }
      });
    }
  }

  limparFormulario(): void {
    this.nome = '';
    this.cpf = '';
    this.dataNascimento = '';
    this.sexo = '';
    this.email = '';
    this.telefone = '';
    this.ativoPessoa = 'S';

    this.cargo = '';
    this.dataAdmissao = '';

    this.cep = '';
    this.numero = '';
    this.complemento = '';

    this.idPessoaEdicao = null;
  }
}
