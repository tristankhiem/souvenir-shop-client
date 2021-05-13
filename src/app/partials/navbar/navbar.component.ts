import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {CategoryService} from '../../services/store/category.service';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ResponseModel} from '../../data-services/response.model';
import {CategoryFullModel} from '../../data-services/schema/category-full.model';
import { Router } from '@angular/router';
import {AUTH_CONSTANT} from '../../constants/auth.constant';

declare var $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  constructor(
    private root: ElementRef,
    private loading: AppLoading,
    private alert: AppAlert,
    private modal: AppModals,
    private categoryService: CategoryService,
    private router: Router
  ) {
  }

  private subscription: any;
  public isLogin = false;
  public categoryList: CategoryFullModel[] = [];
  public filter = '';

  ngOnInit(): void{
    const auth = localStorage.getItem('USER_DATA');
    const notAuth = !auth || auth === 'undefined';
    if (!notAuth){
      this.isLogin = true;
    }
    this.getCategory();
  }

  public getCategory(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.categoryService.getAll().subscribe(res => this.getCategoryCompleted(res, targetLoading));
  }

  private getCategoryCompleted(res: ResponseModel<CategoryFullModel[]>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.categoryList = res.result;
  }

  public login(): void{
    this.router.navigateByUrl('/dang-nhap');
  }

  public signup(): void{
    this.router.navigateByUrl('/dang-ky');
  }

  public logout(): void{
    localStorage.clear();
    this.isLogin = false;
    this.router.navigateByUrl('/trang-chu');
  }

  public openProductListPage(id: number, e: Event): void{
    e.preventDefault();
    // const path = '/product/' + id;
    // this.router.navigateByUrl(path, {skipLocationChange: false}).then(r => );
    this.router.navigate(['/san-pham/' + id], {skipLocationChange: false});
  }

  public search(regex: string): void {
    this.router.navigate(['/tat-ca/' + regex], {skipLocationChange: false});
  }

}
