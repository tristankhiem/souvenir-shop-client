import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading} from '../../utils';
import {SellingTransactionModel} from '../../data-services/schema/selling-transaction.model';
import {SellingOrderService} from '../../services/store/selling-order.service';
import {ResponseModel} from '../../data-services/response.model';
import {SellingOrderModel} from '../../data-services/schema/selling-order.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {UserModel} from '../../data-services/schema/user.model';

declare var $: any;

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html'
})



export class OrderTrackingComponent implements OnInit{
    constructor(
      private root: ElementRef,
      private loading: AppLoading,
      private alert: AppAlert,
      private sellingOrderService: SellingOrderService,
    ) {
    }

    public orderList: SellingOrderModel[] = [];
    public collection = [];
    public customerId: number;
    public userData: UserModel = new UserModel();

    ngOnInit(): void {
      this.onInit();
    }

    public onInit(): void {
      const auth = localStorage.getItem('USER_DATA');
      if ( !auth || auth === 'undefined'){
        this.collection = [];
      } else {
        this.userData = JSON.parse(localStorage.getItem('USER_DATA'));
        this.customerId = this.userData.id;

      }
      this.getSellingOrders();
    }

    public getSellingOrders(): void {
      this.loading.show();
      this.sellingOrderService.getByCustomerId(this.customerId).subscribe(res => this.getSellingOrdersCompleted(res));
    }

    public getSellingOrdersCompleted(res: ResponseModel<SellingOrderModel[]>): void {
      this.loading.hide();
      if (res.status !== HTTP_CODE_CONSTANT.OK) {
        this.alert.errorMessages(res.message);
      }

      this.orderList = res.result;

      this.loadOrders(0);
    }

    public loadOrders(priority: number): void {
      this.collection = [];
      if (priority === 0){
        $('#all').addClass('order-tab-item-active');
        $('#paying').removeClass('order-tab-item-active');
        $('#transporting').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          this.collection.push(item);
        }
      }
      if (priority === 1){
        $('#paying').addClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#transporting').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Chờ thanh toán'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 2){
        $('#transporting').addClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#paying').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Chờ vận chuyển'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 3){
        $('#delivering').addClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#transporting').removeClass('order-tab-item-active');
        $('#paying').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Chờ giao hàng'){
            this.collection.push(item);
          }
        }
      }
    }
}
