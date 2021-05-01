import {ModuleWithProviders, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AppUserProfileComponent} from './user-profile/app-user-profile.component';
import {DropdownMenuComponent} from './commons/dropdown-menu/dropdown-menu.component';
import {DataTableComponent} from './commons/data-table/data-table.component';
import {ModalWrapperComponent} from './commons/modal-wrapper/modal-wrapper.component';
import {DatePickerComponent} from './commons/date-picker/date-picker.component';
import {AutoCompleteModule} from 'primeng';
import {AppCommonNotificationComponent} from './notification/common/app-common-notification.component';

const COMPONENTS = [
  AppUserProfileComponent,
  AppCommonNotificationComponent,
  DataTableComponent,
  DropdownMenuComponent,
  ModalWrapperComponent,
  DatePickerComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: []
})
export class AppComponentsModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: AppComponentsModule,
      providers: []
    } as ModuleWithProviders<any>;
  }
}
