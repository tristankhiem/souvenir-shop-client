import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm} from '@angular/forms';
import {ResponseModel} from '../../../data-services/response.model';

import {HTTP_CODE_CONSTANT} from '../../../constants/http-code.constant';
import {CategoryModel} from '../../../data-services/schema/category.model';
import {SellingOrderService} from '../../../services/store/selling-order.service';
import {SellingOrderFullModel} from '../../../data-services/schema/selling-order-full.model';
import {SellingOrderModel} from '../../../data-services/schema/selling-order.model';
import {CustomerModel} from '../../../data-services/schema/customer.model';
import {CustomerService} from '../../../services/store/customer.service';
import {UserModel} from '../../../data-services/schema/user.model';
import {CART_CONSTANT} from '../../../constants/cart.constant';
import {AUTH_CONSTANT} from '../../../constants/auth.constant';
import {SellingTransactionModel} from '../../../data-services/schema/selling-transaction.model';

declare var $: any;

@Component({
  selector: 'app-add-order-info',
  templateUrl: './add-order-info.component.html'
})
export class AddOrderInfoComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private sellingOrderService: SellingOrderService,
    private customerService: CustomerService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addOrderInfoModalWrapper', {static: true}) updateSellingOrderModalWrapper: ModalWrapperComponent;
  @ViewChild('updateSellingOrderForm', {static: true}) updateSellingOrderForm: NgForm;

  public sellingOrder: SellingOrderFullModel = new SellingOrderFullModel();
  public customer: CustomerModel = new CustomerModel();
  public userModel: UserModel = new UserModel();
  private targetModalLoading: ElementRef;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.updateSellingOrderModalWrapper.id} .modal-dialog`);
  }

  public show(transactions: SellingTransactionModel[], event: Event): void {
    event.preventDefault();
    this.sellingOrder.sellingTransactions = transactions;
    this.getCustomer();
    this.updateSellingOrderModalWrapper.show();

  }

  public hide(): void {
    this.updateSellingOrderForm.onReset();
    this.updateSellingOrderModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.sellingOrder = new SellingOrderFullModel();
    this.updateSellingOrderForm.onReset();
  }

  public getTotal(): number {
    let total = 0;
    for (const i of this.sellingOrder.sellingTransactions) {
      total += +i.quantity * +i.price;
    }
    return total;
  }

  private getSellingOrder(id: number): void{
    this.loading.show();
    this.sellingOrderService.getById(id).subscribe(res => this.getSellingOrderCompleted(res));
  }

  private getSellingOrderCompleted(res: ResponseModel<SellingOrderFullModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.sellingOrder = res.result;
  }

  private setData(): void {
    this.sellingOrder.customer = new CustomerModel(this.customer);
    this.sellingOrder.status = 'Chờ xác nhận';
    this.sellingOrder.address = this.customer.address;
    this.sellingOrder.receivePerson = this.customer.name;
    this.sellingOrder.total = +this.getTotal();
    const currentDate = new Date();
    this.sellingOrder.invoiceDate = new Date(currentDate.getTime()).toDateString();
    this.sellingOrder.deliveryDate = null;
  }

  private getCustomer(): void{
    this.loading.show();
    this.userModel = JSON.parse(localStorage.getItem(AUTH_CONSTANT.USER_DATA));
    this.customerService.getById(this.userModel.id).subscribe(res => this.getCustomerCompleted(res));
  }

  private getCustomerCompleted(res: ResponseModel<CustomerModel>): void {
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }
    this.customer = res.result;
    this.setData();
    this.loading.hide();
  }

  public isValid(): boolean{
    if (this.updateSellingOrderForm.invalid){
      return false;
    }

    return true;
  }

  public onSave(): void {
    if (!this.isValid()){
      return;
    }
    this.saveSellingOrder();
  }

  public saveSellingOrder(): void {
    this.loading.show(this.targetModalLoading);
    this.sellingOrderService.save(this.sellingOrder).subscribe(res => this.saveSellingOrderCompleted(res));
  }

  private saveSellingOrderCompleted(res: ResponseModel<SellingOrderFullModel>): void {
    this.loading.hide(this.targetModalLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
      return;
    }

    this.alert.successMessages(res.message);
    this.saveCompleted.emit();
    this.hide();
  }
}
