import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductFullModel} from '../../data-services/schema/product-full.model';
import {CART_CONSTANT} from '../../constants/cart.constant';
import {SellingTransactionModel} from '../../data-services/schema/selling-transaction.model';
import {AppCommonNotificationComponent} from '../../components/notification/common/app-common-notification.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
  }
  @ViewChild('appCommonNotificationComponent', {static: true}) appCommonNotificationComponent: AppCommonNotificationComponent;

  public product: ProductFullModel = new ProductFullModel();
  public isLogin: boolean;

  public productDetailsInCart: SellingTransactionModel[] = [];

  ngOnInit(): void{
    this.loading.show();
    this.getProductDetailsInCart();
  }

  public getTotal(): number {
    let total = 0;
    for (const i of this.productDetailsInCart) {
      total += i.quantity * i.productDetail.sellingPrice;
    }
    return total;
  }

  public increaseQuantity(transIndex: number): void {
    this.productDetailsInCart[transIndex].quantity++;
    this.updateCart();
  }

  public decreaseQuantity(transIndex: number): void {
    if (this.productDetailsInCart[transIndex].quantity === 1) {
      return;
    }
    this.productDetailsInCart[transIndex].quantity--;
    this.updateCart();
  }

  public deleteItem(index: number): void {
    this.productDetailsInCart.splice(index, 1);
    this.updateCart();
  }

  private getProductFull(targetLoading?: ElementRef): void {
    this.productService.getFullById(this.product.id).subscribe(res => this.getProductCompleted(res, targetLoading));
  }

  private getProductCompleted(res: ResponseModel<ProductFullModel>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.product = res.result;
  }

  private getProductDetailsInCart(): void {
    this.productDetailsInCart = JSON.parse(localStorage.getItem(CART_CONSTANT.CART));
    this.loading.hide();
  }

  private updateCart(): void {
    localStorage.setItem(CART_CONSTANT.CART, JSON.stringify(this.productDetailsInCart));
    this.appCommonNotificationComponent.updateBadgeEl();
  }
}
