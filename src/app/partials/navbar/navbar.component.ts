import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading, AppModals} from '../../utils';
import {CategoryService} from '../../services/store/category.service';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {ResponseModel} from '../../data-services/response.model';
import {CategoryModel} from '../../data-services/schema/category.model';

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
    private categoryService: CategoryService
  ) {
  }

  public categoryList: CategoryModel[] = [];

  ngOnInit(): void{
    this.getCategory();
  }

  public getCategory(targetLoading?: ElementRef): void {
    this.loading.show(targetLoading);
    this.categoryService.getAll().subscribe(res => this.getCategoryCompleted(res, targetLoading));
  }

  private getCategoryCompleted(res: ResponseModel<CategoryModel[]>, targetLoading: ElementRef): void {
    this.loading.hide(targetLoading);
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      this.alert.errorMessages(res.message);
    }

    this.categoryList = res.result;
  }
}
