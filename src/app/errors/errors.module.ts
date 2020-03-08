import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from '../material.module';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from './errors.component';


@NgModule({
  declarations: [ErrorsComponent],
  imports: [
    CommonModule,
    ErrorsRoutingModule,
    MaterialModule
  ]
})
export class ErrorsModule { }
