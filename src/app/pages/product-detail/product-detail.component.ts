import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductModel} from '../../data-services/schema/product.model';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductFullModel} from '../../data-services/schema/product-full.model';

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

  public product: ProductFullModel = new ProductFullModel();

  ngOnInit(): void{
    this.product.id = this.route.snapshot.params.productId;
    this.getProductFull();
  }

  private getProductFull(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.productService.getFullById(this.product.id).subscribe(res => this.getProductCompleted(res, targetLoading));
  }

  private getProductCompleted(res: ResponseModel<ProductFullModel>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.product = res.result;
    console.log(this.product);
  }
}
