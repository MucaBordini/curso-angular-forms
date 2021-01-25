import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  onSubmit(formulario){
    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value))
    .pipe(map(dados =>  dados))
    .subscribe(dados => {
      console.log(dados)
      formulario.form.reset();
    })
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  consultaCep(cep, form){
    cep = cep.replace(/\D/g, '');

    if (cep != "") {
      var validaCep = /^[0-9]{8}$/;
      
      if (validaCep.test(cep)) {
        this.resetaDadosForm(form); 
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
        .subscribe(data => { this.populaDadosForm(data, form); });
      }
    }
  }

  populaDadosForm(dados, formulario){
    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm(formulario) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

}
