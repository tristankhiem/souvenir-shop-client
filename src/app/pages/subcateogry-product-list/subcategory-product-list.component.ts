import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HTTP_CODE_CONSTANT } from 'src/app/constants/http-code.constant';
import { ResponseModel } from 'src/app/data-services/response.model';
import { ProductModel } from 'src/app/data-services/schema/product.model';
import { ProductService } from 'src/app/services/store/product.service';
import { AppAlert, AppLoading } from 'src/app/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import {Options} from '@angular-slider/ngx-slider';
import {SubCategoryModel} from '../../data-services/schema/sub-category.model';
import {CategoryService} from '../../services/store/category.service';

@Component({
    selector: 'app-subcategory-product-list',
    templateUrl: './subcategory-product-list.component.html',
})

export class SubcategoryProductListComponent implements OnInit{


    constructor(
        private root: ElementRef,
        private loading: AppLoading,
        private alert: AppAlert,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private categoryService: CategoryService
    ){
        route.params.subscribe(val => {
          this.onInit();
        });
    }

    public title = '';
    public productList: ProductModel[] = [];
    public subcategoryId: string;
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
    public subCategoryList: SubCategoryModel[] = [];

    public ngOnInit(): void {
        this.onInit();
    }

    public onInit(): void{
        // this.subcategoryId = Number(this.route.snapshot.paramMap.get('subCategoryId'));
        this.subcategoryId = this.route.snapshot.params.subCategoryId;
        this.getProductList();
        this.getSubcategories();
        // this.getName(this.subcategoryId);
    }

    private getProductList(): void{
        this.loading.show();
        // this.search.recordOfPage = 8;
        this.productService.getList(this.subcategoryId).subscribe(res => this.getProductListCompleted(res));
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
            e.imageUrl = 'data:image/jpeg;base64,' + e.imageByte;
            this.collection.push(e);
        }
    }

    public openDetail(event: Event): void{

    }

    public priceFilter(min: number, max: number): void {
        this.collection = [];
        for ( const e of this.productList){
          if (e.sellingPrice >= min && e.sellingPrice <= max){
              this.collection.push(e);
          }
        }
    }

    public getSubcategories(): void{
        this.categoryService.getSubcategories(this.subcategoryId).subscribe(res => this.getSubcategoriesCompleted(res));
    }

    private getSubcategoriesCompleted(res: ResponseModel<SubCategoryModel[]>): void {
      if (res.status !== HTTP_CODE_CONSTANT.OK) {
        this.alert.errorMessages(res.message);
      }

      this.subCategoryList = res.result;

      for (let e of this.subCategoryList){
        if (e.id === this.subcategoryId){
          this.title = e.name;
        }
      }
    }

    // private getName(subCategoryId: number): void {
    //   for (const e of this.subCategoryList){
    //       if (e.id === subCategoryId){
    //         this.name = e.name;
    //       }
    //   }
    // }
}
