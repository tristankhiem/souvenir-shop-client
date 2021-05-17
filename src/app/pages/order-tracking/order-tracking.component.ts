import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading} from '../../utils';
import {SellingTransactionModel} from '../../data-services/schema/selling-transaction.model';
import {SellingOrderService} from '../../services/store/selling-order.service';
import {ResponseModel} from '../../data-services/response.model';
import {SellingOrderModel} from '../../data-services/schema/selling-order.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {UserModel} from '../../data-services/schema/user.model';
import {SellingOrderFullModel} from '../../data-services/schema/selling-order-full.model';

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

    public orderList: SellingOrderFullModel[] = [];
    public collection: SellingOrderFullModel[] = [];
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

    public getSellingOrdersCompleted(res: ResponseModel<SellingOrderFullModel[]>): void {
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
        $('#toConfirm').removeClass('order-tab-item-active');
        $('#confirmed').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');
        $('#finished').removeClass('order-tab-item-active');
        $('#canceled').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          this.collection.push(item);
        }
      }
      if (priority === 1){
        $('#toConfirm').addClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#confirmed').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');
        $('#finished').removeClass('order-tab-item-active');
        $('#canceled').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Chờ xác nhận'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 2){
        $('#confirmed').addClass('order-tab-item-active');
        $('#toConfirm').removeClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');
        $('#finished').removeClass('order-tab-item-active');
        $('#canceled').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Đã xác nhận'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 3){
        $('#delivering').addClass('order-tab-item-active');
        $('#toConfirm').removeClass('order-tab-item-active');
        $('#confirmed').removeClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#finished').removeClass('order-tab-item-active');
        $('#canceled').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Đang giao'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 4){
        $('#finished').addClass('order-tab-item-active');
        $('#toConfirm').removeClass('order-tab-item-active');
        $('#confirmed').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');
        $('#canceled').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Đã hoàn thành'){
            this.collection.push(item);
          }
        }
      }
      if (priority === 5){
        $('#canceled').addClass('order-tab-item-active');
        $('#toConfirm').removeClass('order-tab-item-active');
        $('#confirmed').removeClass('order-tab-item-active');
        $('#delivering').removeClass('order-tab-item-active');
        $('#finished').removeClass('order-tab-item-active');
        $('#all').removeClass('order-tab-item-active');

        for (const item of this.orderList){
          if (item.status === 'Đã huỷ'){
            this.collection.push(item);
          }
        }
      }
    }
}
