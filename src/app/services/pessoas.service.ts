
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PessoasService {
    
    private url = 'https://localhost:7218/api/Pessoa';

  constructor(private http: HttpClient) { }

  listarPessoas(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }

  buscarPessoa(id: number): Observable<any> {
    return this.http.get<any>(this.url + '/' + id);
  }

  cadastrarPessoa(pessoa: any): Observable<any> {
    return this.http.post<any>(this.url, pessoa);
  }

  atualizarPessoa(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(this.url + '/' + id, pessoa);
  }

  excluirPessoa(id: number): Observable<any> {
    return this.http.delete<any>(this.url + '/' + id);
  }
}
