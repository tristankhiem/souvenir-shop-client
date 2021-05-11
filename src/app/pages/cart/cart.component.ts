import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductFullModel} from '../../data-services/schema/product-full.model';
import {ProductDetailModel} from '../../data-services/schema/product-detail.model';
import {CART_CONSTANT} from '../../constants/cart.constant';
import {SellingTransactionModel} from '../../data-services/schema/selling-transaction.model';

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

  public product: ProductFullModel = new ProductFullModel();
  public currentProductDetail: ProductDetailModel = new ProductDetailModel();
  public quantity: number;

  public productDetailsInCart: SellingTransactionModel[] = [];

  ngOnInit(): void{
    this.loading.show();
    this.quantity = 1;
    this.getProductDetailsInCart();
  }

  public getTotal(): number {
    let total = 0;
    for (const i of this.productDetailsInCart) {
      total += i.quantity * i.productDetail.sellingPrice;
    }
    return total;
  }

  public increaseQuantity(): void {
    this.quantity++;
  }

  public decreaseQuantity(): void {
    if (this.quantity === 1) {
      return;
    }
    this.quantity--;
  }

  public addToCart(): void {
    // this.productDetailsInCart.push(this.currentProductDetail);
    localStorage.setItem(CART_CONSTANT.CART, JSON.stringify(this.productDetailsInCart));
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
    this.currentProductDetail = new ProductDetailModel(this.product.productDetails[0]);
  }

  private getProductDetailsInCart(): void {
    this.productDetailsInCart = JSON.parse(localStorage.getItem(CART_CONSTANT.CART));
    this.loading.hide();
  }
}
