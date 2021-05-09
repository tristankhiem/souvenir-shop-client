import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HTTP_CODE_CONSTANT } from 'src/app/constants/http-code.constant';
import { ResponseModel } from 'src/app/data-services/response.model';
import { ProductModel } from 'src/app/data-services/schema/product.model';
import { BaseSearchModel } from 'src/app/data-services/search/base-search.model';
import { ProductService } from 'src/app/services/store/product.service';
import { AppAlert, AppLoading } from 'src/app/utils';
import { NgxPaginationModule } from 'ngx-pagination';
import {Options} from '@angular-slider/ngx-slider';

@Component({
    selector: 'app-subcategory-product-list',
    templateUrl: './subcategory-product-list.component.html',
})

export class SubcategoryProductListComponent implements OnInit{
    public productList: ProductModel[] = [];
    public subcategoryId: number;
    public p = 1; // current page for pagination
    public collection = [];
    public minValue = 5000;
    public maxValue = 500000;
    // public options: Options = {
    //         floor: 0,
    //         ceil: 500,
    //         translate: (value: number): string => {
    //           return value + 'đ';
    //         },
    //         combineLabels: (minValue: string, maxValue: string): string => {
    //           return 'from ' + minValue + ' up to ' + maxValue;
    //         }
    //       };


    constructor(
        private root: ElementRef,
        private loading: AppLoading,
        private alert: AppAlert,
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router
    ){
        route.params.subscribe(val => {
          this.onInit();
        });
    }

    ngOnInit(): void {
        this.onInit();
    }

    public onInit(): void{
        // this.subcategoryId = Number(this.route.snapshot.paramMap.get('subCategoryId'));
        this.subcategoryId = this.route.snapshot.params.subCategoryId;
        this.getProductList();
    }

    private getProductList(): void{
        this.loading.show();
        // this.search.recordOfPage = 8;
        this.productService.getList(this.subcategoryId).subscribe(res => this.getProductListCompleted(res));
    }

    private getProductListCompleted(res: ResponseModel<ProductModel[]>): void{
        this.loading.hide();
        if (res.status !== HTTP_CODE_CONSTANT.OK) {
            this.alert.errorMessages(res.message);
        }

        this.productList = res.result;

        // for ( const e of this.productList){
        //     const Obj = {name: e.name, imageUrl: e.imageUrl, sellingPrice: e.sellingPrice};
        //     this.collection.push(Obj);
        // }
    }

    public openDetail(event: Event): void{

    }

}
