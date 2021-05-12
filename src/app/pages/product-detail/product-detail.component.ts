import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductModel} from '../../data-services/schema/product.model';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductFullModel} from '../../data-services/schema/product-full.model';
import {ProductDetailModel} from '../../data-services/schema/product-detail.model';
import {AUTH_CONSTANT} from '../../constants/auth.constant';
import {CART_CONSTANT} from '../../constants/cart.constant';
import {SellingTransactionModel} from '../../data-services/schema/selling-transaction.model';
import {AppCommonNotificationComponent} from '../../components/notification/common/app-common-notification.component';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
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
  public currentProductDetail: ProductDetailModel = new ProductDetailModel();
  public quantity: number;
  public activeSlideIndex: any;
  public noWrapSlides: boolean;

  public productDetailsInCart: SellingTransactionModel[] = [];

  ngOnInit(): void{
    this.loading.show();
    this.product.id = this.route.snapshot.params.productId;
    this.activeSlideIndex = 0;
    this.noWrapSlides = false;
    this.quantity = 1;
    this.getProductFull();
    this.getProductDetailsInCart();
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

  public changeProductDetail(): void {
    const index = +this.activeSlideIndex.relatedTarget;
    this.currentProductDetail = new ProductDetailModel(this.product.productDetails[index]);
  }

  public addToCart(): void {
    const newItem = new SellingTransactionModel();
    newItem.productDetail = new ProductDetailModel(this.currentProductDetail);
    newItem.quantity = this.quantity;
    if (typeof (this.quantity) !== 'number') {
      this.alert.error('Số lượng phải là số lớn hơn 0');
      return;
    }
    if (this.productDetailsInCart.filter(s => s.productDetail.id === newItem.productDetail.id).length > 0) {
      this.alert.error('Đã tồn tại sản phẩm trong giỏ hàng');
      return;
    }
    this.productDetailsInCart.push(newItem);
    localStorage.setItem(CART_CONSTANT.CART, JSON.stringify(this.productDetailsInCart));
    this.appCommonNotificationComponent.updateBadgeEl();
    this.alert.success('Thêm sản phẩm vào giỏ hàng thành công!');
  }

  private getProductFull(targetLoading?: ElementRef): void {
    this.productService.getFullById(this.product.id).subscribe(res => this.getProductCompleted(res, targetLoading));
  }

  private getProductCompleted(res: ResponseModel<ProductFullModel>, targetLoading: ElementRef): void {
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
