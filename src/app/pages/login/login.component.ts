import {AppAlert, AppLoading} from '../../utils';
import {Router} from '@angular/router';
import {AfterViewInit, Component} from '@angular/core';
import {AUTH_CONSTANT} from '../../constants/auth.constant';
import {LoginModel} from '../../data-services/login.model';
import {ResponseModel} from '../../data-services/response.model';
import {JwtResponseModel} from '../../data-services/jwt-response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {EmployeeAuthService} from '../../services/store/employee-auth.service';
import {CurrentUserService} from '../../services/store/current-user.service';
import { CustomerService } from 'src/app/services/store/customer.service';
import { CustomerModel } from 'src/app/data-services/schema/customer.model';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  // public loginModel: LoginModel = new LoginModel();
  public customer: CustomerModel = new CustomerModel();

  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private customerService: CustomerService,
    private router: Router,
  ) {
    $('body').addClass('login-page adi-background-guest');
  }

  ngAfterViewInit(): void {
  }

  public enterEvent($keyBoard: KeyboardEvent = null): void {
    if ($keyBoard != null && $keyBoard.key === 'Enter') {
      this.login();
    }
  }

  public login(): void {
    this.loading.show();
    this.customerService.login(this.customer).subscribe(res => this.loginCompleted(res));
  }

  // private loginCompleted(res: ResponseModel<JwtResponseModel>): void {
  //   this.loading.hide();
  //   if (res.status !== HTTP_CODE_CONSTANT.OK) {
  //     res.message.forEach(value => {
  //       this.alert.error(value);
  //     });
  //     return;
  //   }

  //   const user = res.result.user;
  //   this.currentUserService.setUser(user);
  //   localStorage.setItem(AUTH_CONSTANT.USER_DATA, JSON.stringify(user));

  //   this.router.navigateByUrl('/trang-chu');
  // }

  private loginCompleted(res: ResponseModel<CustomerModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK){
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }
    this.router.navigateByUrl('/trang-chu');
  }

  public signup(): void {
    this.loading.show();
    this.router.navigateByUrl('/dang-ky');
  }
}
