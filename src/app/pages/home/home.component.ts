import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductModel} from '../../data-services/schema/product.model';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ProductService} from '../../services/store/product.service';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private productService: ProductService
  ) {
  }

  public search: BaseSearchModel<ProductModel[]> = new BaseSearchModel<ProductModel[]>();

  ngOnInit(): void{
    this.getProduct();
  }

  private getProduct(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.search.recordOfPage = 8;
    this.productService.search(this.search).subscribe(res => this.getProductCompleted(res, targetLoading));
  }

  private getProductCompleted(res: ResponseModel<BaseSearchModel<ProductModel[]>>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.search = res.result;
    for (const e of this.search.result) {
      e.imageUrl = 'data:image/jpeg;base64,' + e.imageByte;
    }
  }
}
