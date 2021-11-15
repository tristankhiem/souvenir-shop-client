import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HTTP_CODE_CONSTANT } from 'src/app/constants/http-code.constant';
import { INPUT_PATTERN_CONSTANT } from 'src/app/constants/input-pattern.constant';
import { ResponseModel } from 'src/app/data-services/response.model';
import { CustomerModel } from 'src/app/data-services/schema/customer.model';
import { CustomerService } from 'src/app/services/store/customer.service';
import { AppLoading, AppAlert } from 'src/app/utils';

declare var $: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})

export class SignupComponent implements OnInit {
    // public loginModel: LoginModel = new LoginModel();
    public customer: CustomerModel = new CustomerModel();
    public retypePassword: string;
    private message: Array<string> = ['Mật khẩu nhập lại không khớp'];

    public cardIdPattern = INPUT_PATTERN_CONSTANT.cardIdPattern;
    public passwordPattern = INPUT_PATTERN_CONSTANT.passwordPattern;
    public emailPattern = INPUT_PATTERN_CONSTANT.emailPattern;
    public phonePattern  = INPUT_PATTERN_CONSTANT.phonePattern;

    @ViewChild('signUpForm', {static: true}) signUpForm: NgForm;
    // @Output() saveCompleted = new EventEmitter<any>();

    constructor(
      private loading: AppLoading,
      private alert: AppAlert,
      private customerService: CustomerService,
      private router: Router,
    ) {
      $('body').addClass('login-page adi-background-guest');
    }

    ngOnInit(): void{
      this.customer.birthDate = new Date().toDateString();
      this.retypePassword = '';
    }

    public enterEvent($keyBoard: KeyboardEvent = null): void {
      if ($keyBoard != null && $keyBoard.key === 'Enter') {
        this.signup();
      }
    }

    public isValid(): boolean{

      if (this.retypePassword !== this.customer.password){
        this.alert.errorMessages(this.message);
        return false;
      }

      if (this.signUpForm.invalid){
        return false;
      }
      return true;
    }

    public onSave(): void{
      if (!this.isValid()){
        return;
      }
      //const currentDate = new Date(this.customer.birthDate);
      //this.customer.birthDate = new Date(currentDate.getTime()).toDateString();
      this.customer.isValid=true;
      this.signup();
    }

    public signup(): void {
      this.loading.show();
      this.customerService.save(this.customer).subscribe(res => this.signupCompleted(res));
    }

    private signupCompleted(res: ResponseModel<CustomerModel>): void {
      this.loading.hide();
      if (res.status !== HTTP_CODE_CONSTANT.OK){
        res.message.forEach(value => {
          this.alert.error(value);
        });
        return;
      }

      this.alert.successMessages(res.message);
      // this.saveCompleted.emit();
      this.router.navigateByUrl('/dang-nhap');
    }

    public cancel(): void{
      this.router.navigateByUrl('/trang-chu');
    }
  }
