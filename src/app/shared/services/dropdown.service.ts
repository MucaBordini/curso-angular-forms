import { EstadosBr } from './../models/estados-br';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){
    return this.http.get<EstadosBr[]>('assets/dados/estadosbr.json');
  }

  getCargos(){
    return[
      { nome: 'Dev', nivel: 'Junior', descricao: 'Dev Jr' },
      { nome: 'Dev', nivel: 'Pleno', descricao: 'Dev Pl' },
      { nome: 'Dev', nivel: 'Senior', descricao: 'Dev Sr' },
    ];
  }

  getTecnologias(){
    return [
      { nome: 'Java', descricao: 'Linguagem orientada a obj' },
      { nome: 'C', descricao: 'Linguagem estruturada' },
      { nome: 'Delphi', descricao: 'Linguagem orientada a procedure' }
    ]
  }

}
