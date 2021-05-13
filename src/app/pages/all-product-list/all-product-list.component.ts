import {Component, ElementRef, OnInit} from '@angular/core';
import {AppAlert, AppLoading} from '../../utils';
import {ProductService} from '../../services/store/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductModel} from '../../data-services/schema/product.model';
import {Options} from '@angular-slider/ngx-slider';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';
import {ResponseModel} from '../../data-services/response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';

@Component({
  selector: 'app-all-product-list',
  templateUrl: './all-product-list.component.html',
})

export class AllProductListComponent implements  OnInit{
    constructor(
      private root: ElementRef,
      private alert: AppAlert,
      private loading: AppLoading,
      private productService: ProductService,
      private router: Router,
      private route: ActivatedRoute
    ) {
      route.params.subscribe(val => {
        this.onInit();
      });
    }

    public filter = '';
    public productList: ProductModel[] = [];
    public p = 1; // current page for pagination
    public collection = [];
    public minValue = 0;
    public maxValue = 500000;
    public options: Options = {
      floor: 0,
      ceil: 500000,
      translate: (value: number): string => {
        return value + 'đ';
      },
      combineLabels: (minValue: string, maxValue: string): string => {
        return 'from ' + minValue + ' to ' + maxValue;
      }
    };

    ngOnInit(): void {
      this.onInit();
    }

    public onInit(): void {
      this.filter = this.route.snapshot.params.regex;
      this.alert.info(this.filter);
      if (this.filter === '' || this.filter === '%20' || this.filter === ' '){
        this.getProductList();
      }else{
        this.search();
      }

    }

    private getProductList(): void{
      this.loading.show();
      // this.search.recordOfPage = 8;
      this.productService.getAll().subscribe(res => this.getProductListCompleted(res));
    }

    private getProductListCompleted(res: ResponseModel<ProductModel[]>): void{
      this.collection = [];
      this.loading.hide();
      if (res.status !== HTTP_CODE_CONSTANT.OK) {
        this.alert.errorMessages(res.message);
      }

      this.productList = res.result;

      for ( const e of this.productList){
        // const Obj = {name: e.name, imageUrl: e.imageUrl, sellingPrice: e.sellingPrice};
        this.collection.push(e);
      }
    }

    // public openDetail(event: Event): void{
    //
    // }

    public priceFilter(min: number, max: number): void {
      this.collection = [];
      for ( const e of this.productList){
        if (e.sellingPrice >= min && e.sellingPrice <= max){
          this.collection.push(e);
        }
      }
    }

    private search(): void {
      this.productService.getLikeName(this.filter).subscribe(res => this.searchCompleted(res));
    }

    private searchCompleted(res: ResponseModel<ProductModel[]>): void {
      this.collection = [];
      this.loading.hide();
      if (res.status !== HTTP_CODE_CONSTANT.OK) {
        this.alert.errorMessages(res.message);
      }

      this.productList = res.result;

      for ( const e of this.productList){
        // const Obj = {name: e.name, imageUrl: e.imageUrl, sellingPrice: e.sellingPrice};
        this.collection.push(e);
      }
    }
}
