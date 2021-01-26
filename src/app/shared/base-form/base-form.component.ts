import { FormGroup, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-form',
  template: '<div></div>',
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit();

  onSubmit() {
    if (this.formulario.valid) {
      this.submit();
    } else {
      console.log('Formulario invalido');
      this.verificaValidacoesFormulario(this.formulario)
    }
  }

  verificaValidacoesFormulario(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup || controle instanceof FormArray){
        this.verificaValidacoesFormulario(controle)
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: string) {
    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched;
  }

  verificaEmailInvalido(){
    let campoEmail = this.formulario.get('email');
    if (campoEmail.errors){
      return campoEmail.errors['email'];
    }
  }

  aplicaCssErro(campo: string){
    return{
      'is-invalid': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo)
    }
  }

}
