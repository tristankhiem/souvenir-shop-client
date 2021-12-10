import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SellingOrderFullModel} from '../../data-services/schema/selling-order-full.model';
import {SellingOrderService} from '../../services/store/selling-order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private sellingOrderService: SellingOrderService,
  ) {
  }

  public sellingOrder: SellingOrderFullModel = new SellingOrderFullModel();

  ngOnInit(): void{
    this.loading.show();
    this.getOrder();
  }

  private getOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');
    this.sellingOrderService.getById(orderId).subscribe(res => this.getOrderCompleted(res));
  }

  private getOrderCompleted(res: ResponseModel<SellingOrderFullModel>): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.sellingOrder = res.result;

    for ( const e of this.sellingOrder.sellingTransactions){
      e.productDetail.imageUrl = 'data:image/jpeg;base64,' + e.productDetail.imageByte;
    }
    this.loading.hide();
  }
}
