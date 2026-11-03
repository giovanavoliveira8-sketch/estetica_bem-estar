
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FuncionariosService {

  private url = 'https://localhost:7218/api/Funcionario';

  constructor(private http: HttpClient) { }

  listarFuncionarios(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscarFuncionario(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + id);
  }

  cadastrarFuncionario(funcionario: any): Observable<any> {
    return this.http.post<any>(this.url + '/id', funcionario);
  }

  atualizarFuncionario(id: number, funcionario: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + id, funcionario);
  }

  excluirFuncionario(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id);
  }
}
