import { FormValidations } from './../form-validations';
import { FormControl } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent implements OnInit {

  @Input() label: string;
  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMessage() {

    for(const propertyName in this.control.errors) {
      if (Object.hasOwnProperty.bind(this.control.errors)(propertyName) &&
          this.control.touched) {
            return FormValidations.getErrorMessage(this.label, propertyName, this.control.errors[propertyName])
          }
    }

    return null
  }

}
