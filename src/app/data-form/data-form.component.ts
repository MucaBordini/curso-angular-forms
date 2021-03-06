import { BaseFormComponent } from './../shared/base-form/base-form.component';
import { VerificaEmailService } from './services/verifica-email.service';
import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadosBr } from './../shared/models/estados-br';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { DropdownService } from '../shared/services/dropdown.service';
import { empty, Observable } from 'rxjs';
import { FormValidations } from '../shared/form-validations';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  estados: Observable<EstadosBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsletters: any[];
  frameworks = ['Angular', 'Spring', 'React', 'Vue'];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService,
    private cepService: ConsultaCepService,
    private verificaEmailService: VerificaEmailService
    ) {
      super();
     }

  ngOnInit(): void {

    //this.verificaEmailService.verificarEmail('').subscribe()

    this.estados = this.dropDownService.getEstadosBr();

    this.cargos = this.dropDownService.getCargos();

    this.tecnologias = this.dropDownService.getTecnologias();
    //this.dropDownService.getEstadosBr()
    //  .subscribe(dados => this.estados = dados);

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [Validators.required, Validators.email, FormValidations.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [],
        rua: [],
        bairro: [],
        cidade: [],
        estado: []
      }),
      cargo: [null],
      tecnologia: [null],
      newsletter: ['s'],
      termos: [false, Validators.pattern('true')],
      frameworks: this.buildFrameworks()
    });

    this.formulario.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      tap(status => console.log('valor Cep: ', status)),
      switchMap(status => status === 'VALID' ? this.cepService.consultaCep(this.formulario.get('endereco.cep').value)
      : empty())
    )
      .subscribe(dados => dados ? /*dados => { */this.populaDadosForm(dados)/*; }*/ : {});
  }

  buildFrameworks(){

    const values = this.frameworks.map(v => new FormControl(false));

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));

  }

  submit() {
    console.log(this.formulario.value);

    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
      .map((v, i) => v ? this.frameworks[i] : null)
      .filter(v => v!== null)
    });

    console.log(valueSubmit);

    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map(dados =>  dados))
      .subscribe(dados => {
        console.log(dados);
        this.resetar();
      },
        (error: any) => alert('Erro!'));

  }

  consultaCep(){

    let cep = this.formulario.get('endereco.cep').value;

    if(cep != null && cep !== ''){
      this.cepService.consultaCep(cep)
      .subscribe(data => { this.populaDadosForm(data); });
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

  compararCargo(obj1, obj2){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  compararTecnologia(obj1, obj2){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2;
  }

  getFrameworksControls() {
    return this.formulario.get('frameworks') ? (<FormArray>this.formulario.get('frameworks')).controls : null;
  }

  validarEmail(formControl: FormControl){
    return this.verificaEmailService.verificarEmail(formControl.value)
      .pipe(map(emailExiste => emailExiste ? { emailInvalido: true} : null))
  }

}
