import {AppPagesRoutingModule, routedComponents} from './app-pages-routing.module';
import {CommonModule} from '@angular/common';
import {AppComponentsModule} from '../components/app-components.module';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CarouselModule, WavesModule} from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    ...routedComponents,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppPagesRoutingModule,
    AppComponentsModule,
    CarouselModule,
    WavesModule,
    ReactiveFormsModule,
  ],
  providers: [
    ...AppComponentsModule.forRoot().providers
  ]
})
export class AppPagesModule {
}
