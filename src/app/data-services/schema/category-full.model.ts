import {SubCategoryModel} from './sub-category.model';

export class CategoryFullModel {
  public id: string;
  public name: string;
  public subCategories: SubCategoryModel[] = [];

  public constructor(
    data?: CategoryFullModel
  ) {
    const category = data == null ? this : data;

    this.id = category.id;
    this.name = category.name;
    const subCategories = category.subCategories || [];
    this.subCategories = [];
    for (const subCategory of subCategories) {
      this.subCategories.push(new SubCategoryModel(subCategory));
    }
  }
}
