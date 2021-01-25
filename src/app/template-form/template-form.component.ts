import { ConsultaCepService } from './../shared/services/consulta-cep.service';
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

  constructor(private http: HttpClient, private cepService: ConsultaCepService) { }

  ngOnInit(): void {
  }

  consultaCep(cep, form){
    cep = cep.replace(/\D/g, '');

    if(cep != null && cep !== ''){
      this.cepService.consultaCep(cep)
      .subscribe(data => { this.populaDadosForm(data, form); });
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
