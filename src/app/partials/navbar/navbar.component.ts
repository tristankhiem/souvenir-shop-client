import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {CategoryService} from '../../services/store/category.service';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ResponseModel} from '../../data-services/response.model';
import {CategoryFullModel} from '../../data-services/schema/category-full.model';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {
  }

  public categoryList: CategoryFullModel[] = [];

  ngOnInit(): void{
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
    this.loading.show();
    this.router.navigateByUrl('/dang-nhap');
  }

  public signup(): void{
    this.loading.show();
    this.router.navigateByUrl('/dang-ky');
  }
}
