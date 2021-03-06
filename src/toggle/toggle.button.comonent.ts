/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Author - Pratik Kelwalkar
 *
 */

import {
  Input, OnInit, forwardRef, Component, AfterViewInit, Output, EventEmitter,
  ViewEncapsulation
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FormInputBase} from "../baseclass/form.base.class";
const noop = () => {
};

export const CUSTOM_TOGGLE_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AmexioToggleComponent),
  multi: true
};

export const BASE_IMPL_TOGGLE_INPUT: any = {
  provide : FormInputBase,
  useExisting: forwardRef(() => AmexioToggleComponent)
};
@Component({
  selector: 'amexio-toggle',
  template : `    
    <label>{{fieldLabel}}</label>
    <label class="amexio-toggle">
      <input type="checkbox" checked
             name="value"
             #rangeHndl
             (blur)="onBlur()"
             [(ngModel)]="value"
             (change)="onToggle()">
      <span class="amexio-slider {{shape}}"></span>
    </label>
  `,
   styles : [`
    .amexio-toggle {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  vertical-align: middle
}

.amexio-toggle input {display:none;}

.amexio-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.amexio-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .amexio-slider {
  background-color: #2196F3;
}

input:focus + .amexio-slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .amexio-slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.round {
  border-radius: 34px;
}

.round:before {
  border-radius: 50%;
}


   `],
  providers : [BASE_IMPL_TOGGLE_INPUT,CUSTOM_TOGGLE_INPUT_CONTROL_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None
 })

export class AmexioToggleComponent extends FormInputBase implements OnInit {

  @Input()    shape : string;

  @Output()   onChange  : EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.shape == '' || this.shape == null ? this.shape = 'round' : 0;
  }

  onToggle(){
    this.onChange.emit(this.value);
  }

  //The internal dataviews model
  private innerValue: any = '';

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //get accessor
  get value(): any {
    return this.innerValue;
  };

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  //Set touched on blur
  onBlur() {
    this.onTouchedCallback();
  }

  //From ControlValueAccessor interface
  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

}
