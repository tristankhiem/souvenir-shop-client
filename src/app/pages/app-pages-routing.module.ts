import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {SignupComponent} from './signup/signup.component';
import {SubcategoryProductListComponent} from './subcateogry-product-list/subcategory-product-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'trang-chu',
    pathMatch: 'full',
  },
  {
    path: 'thay-doi-mat-khau',
    component: ChangePasswordComponent
  },
  {
    path: 'trang-chu',
    component: HomeComponent,
  },
  {
    path: 'product/:subCategoryId',
    component: SubcategoryProductListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {
}

export const routedComponents = [
  ChangePasswordComponent,
  HomeComponent,
  SubcategoryProductListComponent,
];
