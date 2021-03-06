import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {CartComponent} from './cart/cart.component';
import {SignupComponent} from './signup/signup.component';
import {SubcategoryProductListComponent} from './subcateogry-product-list/subcategory-product-list.component';
import {CategoryProductListComponent} from './category-product-list/category-product-list.component';
import {AllProductListComponent} from './all-product-list/all-product-list.component';
import {PaymentComponent} from './payment/payment.component';
import {OrderTrackingComponent} from "./order-tracking/order-tracking.component";

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
    path: 'chi-tiet-san-pham/:productId',
    component: ProductDetailComponent,
  },
  {
    path: 'gio-hang',
    component: CartComponent,
  },
  {
    path: 'thanh-toan/:orderId',
    component: PaymentComponent,
  },
  {
    path: 'san-pham/:subCategoryId',
    component: SubcategoryProductListComponent,
  },
  {
    path: 'san-pham/tat-ca/:categoryId',
    component: CategoryProductListComponent,
  },
  {
    path: 'tat-ca/:regex',
    component: AllProductListComponent,
  },
  {
    path: 'xem-hoa-don',
    component: OrderTrackingComponent,
  }
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
  ProductDetailComponent,
  CartComponent,
  PaymentComponent,
  SubcategoryProductListComponent,
  CategoryProductListComponent,
  AllProductListComponent,
  OrderTrackingComponent,
];
