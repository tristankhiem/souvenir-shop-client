import {AfterViewInit, ChangeDetectorRef, Component, ElementRef} from '@angular/core';
import {AppAlert, AppLoading} from '../../../utils';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {SellingTransactionModel} from '../../../data-services/schema/selling-transaction.model';
import {CART_CONSTANT} from '../../../constants/cart.constant';

declare var $: any;

@Component({
  selector: 'app-common-notification',
  templateUrl: './app-common-notification.component.html'
})
export class AppCommonNotificationComponent implements AfterViewInit {
  private badgeEl: any;

  constructor(
    private root: ElementRef,
    private alert: AppAlert,
    private loading: AppLoading,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) {
  }

  public productDetailsInCart: SellingTransactionModel[] = [];

  ngAfterViewInit(): void {
    this.updateBadgeEl();
    // bind event
    this.cdref.detectChanges();
  }

  public updateBadgeEl(): void {
    this.badgeEl = $(this.root.nativeElement.querySelector('#app_common_notification .badge-warning'));
    this.getProductDetailsInCart();
  }

  private getProductDetailsInCart(): void {
    this.productDetailsInCart = JSON.parse(localStorage.getItem(CART_CONSTANT.CART));
    if (this.productDetailsInCart != null) {
      document.getElementById('cart-notify').innerHTML = String(this.productDetailsInCart.length);
    } else {
      document.getElementById('cart-notify').innerHTML = String(0);
    }
    this.loading.hide();
  }
}
