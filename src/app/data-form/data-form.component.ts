import { EstadosBr } from './../shared/models/estados-br';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;
  estados: EstadosBr[]

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService
    ) { }

  ngOnInit(): void {

    this.estados=[];
    this.dropDownService.getEstadosBr().subscribe((res: EstadosBr)=>{
    this.estados.push(res)
  });

    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [],
        rua: [],
        bairro: [],
        cidade: [],
        estado: []
      })
    });

  }

  onSubmit(){
    console.log(this.formulario.value);
    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map(dados =>  dados))
      .subscribe(dados => {
        console.log(dados);
        this.resetar();
      },
        (error: any) => alert('Erro!'));
    } else {
      console.log('Formulario invalido');
      this.verificaValidacoesFormulario(this.formulario)
    }

  }

  verificaValidacoesFormulario(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if(controle instanceof FormGroup){
        this.verificaValidacoesFormulario(controle)
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  aplicaCssErro(campo: string){
    return{
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if (campoEmail.errors){
      return campoEmail.errors['email'];
    }
  }

  verificaValidTouched(campo: string){

    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched;

  }

  consultaCep(){

    let cep = this.formulario.get('endereco.cep').value;

    cep = cep.replace(/\D/g, '');

    if (cep != "") {
      var validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        this.resetaDadosForm();
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
        .subscribe(data => { this.populaDadosForm(data); });
      }
    }
  }

  resetaDadosForm(){
    {
      this.formulario.patchValue({
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

  populaDadosForm(dados){
    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

}
