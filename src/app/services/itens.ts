
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItensService {

  private url = 'https://localhost:7218/api/Item';

  constructor(private http: HttpClient) { }

  listarItens(): Observable<any[]> {
    return this.http.get<any[]>(this.url);
  }
}
