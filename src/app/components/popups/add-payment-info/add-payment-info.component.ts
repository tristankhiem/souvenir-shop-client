import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {AppCommon} from '../../../utils/app-common';
import {ModalWrapperComponent} from '../../commons/modal-wrapper/modal-wrapper.component';
import {NgForm, NgModel} from '@angular/forms';
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
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

declare var $: any;
declare var Stripe;

@Component({
  selector: 'app-add-payment-info',
  templateUrl: './add-payment-info.component.html'
})
export class AddPaymentInfoComponent implements AfterViewInit {
  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private common: AppCommon,
    private router: Router,
    private sellingOrderService: SellingOrderService,
  ) {
  }

  @Output() saveCompleted = new EventEmitter<any>();
  @ViewChild('addPaymentInfoModalWrapper', {static: true}) addPaymentInfoModalWrapper: ModalWrapperComponent;
  @ViewChild('addPaymentInfoForm', {static: true}) addPaymentInfoForm: NgForm;

  @ViewChild('cardNumber') cardNumberElement: ElementRef;
  @ViewChild('cardExpiry') cardExpiryElement: ElementRef;
  @ViewChild('cardCvc') cardCvcElement: ElementRef;
  public sellingOrder: SellingOrderFullModel = new SellingOrderFullModel();
  public cardName: string;
  private targetModalLoading: ElementRef;

  cardError: any;
  public processing = false;
  private stripe: any;
  private cardNumber: any;
  private cardHandler = this.onChange.bind(this);

  private numberCompleted = false;
  private expiryCompleted = false;
  private cvcCompleted = false;

  ngAfterViewInit(): void {
    this.targetModalLoading = $(`#${this.addPaymentInfoModalWrapper.id} .modal-dialog`);
    this.stripe = Stripe(environment.publishableKey);

    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    const cardExpiry = elements.create('cardExpiry');
    cardExpiry.mount(this.cardExpiryElement.nativeElement);
    cardExpiry.addEventListener('change', this.cardHandler);

    const cardCvc = elements.create('cardCvc');
    cardCvc.mount(this.cardCvcElement.nativeElement);
    cardCvc.addEventListener('change', this.cardHandler);
  }

  // tslint:disable-next-line:typedef
  onChange(event) {
    this.cardError = event.error?.message;

    switch (event.elementType) {
      case 'cardNumber':
        this.numberCompleted = event.complete;
        break;
      case 'cardExpiry':
        this.expiryCompleted = event.complete;
        break;
      case 'cardCvc':
        this.cvcCompleted = event.complete;
        break;
    }
  }

  // tslint:disable-next-line:typedef
  get cardInfoInvalid() {
    return !(this.numberCompleted && this.expiryCompleted && this.cvcCompleted);
  }

  public show(sellingOrderId: number, event: Event): void {
    event.preventDefault();
    this.sellingOrder.id = sellingOrderId;
    this.addPaymentInfoModalWrapper.show();

  }

  public hide(): void {
    this.addPaymentInfoForm.onReset();
    this.addPaymentInfoModalWrapper.hide();
  }

  public onHideEvent(): void {
    this.sellingOrder = new SellingOrderFullModel();
    this.addPaymentInfoForm.onReset();
  }

  public isValid(): boolean{
    if (this.addPaymentInfoForm.invalid){
      return false;
    }

    return true;
  }

  // tslint:disable-next-line:typedef
  async onSubmit() {
    try {
      this.loading.show();
      this.processing = true;
      const paymentIntent = await this.createPaymentIntent();
      const paymentResult = await this.confirmPaymentWithStripe(paymentIntent.result);
      if (paymentResult.paymentIntent) {
        this.loading.hide();
        this.alert.success('Thanh toán thành công');
        this.hide();
        this.router.navigateByUrl('/trang-chu');
      } else {
        this.alert.error('Thanh toán thất bại');
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // tslint:disable-next-line:typedef
  private async createPaymentIntent() {
    const paymentInput = {
      orderId: this.sellingOrder.id
    };
    return this.sellingOrderService.payment(paymentInput).toPromise();
  }

  // tslint:disable-next-line:typedef
  private async confirmPaymentWithStripe(paymentIntent)
  {
    return this.stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.cardName
        }
      }
    });
  }
}
