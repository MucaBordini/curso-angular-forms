import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,//'Samuel',
    email: null//'sam@mail.com'
  }

  onSubmit(form){
    console.log(form);
    console.log(this.usuario);
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  consultaCep(cep){
    cep = cep.replace(/\D/g, '');

    if (cep != "") {
      var validaCep = /^[0-9]{8}$/;
      
      if (validaCep.test(cep)) {
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
        .subscribe(data => { console.log(data); });
      }
    }
  }

}
