import { Component, OnInit } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Recipe } from 'src/dashboard/models/recipe.model';
import { NzMessageService } from 'ng-zorro-antd/message';
import { KitchenApiService } from 'src/dashboard/services/kitchen-api.service';

@UntilDestroy()
@Component({
  templateUrl: "./kitchen-top.component.html"
})
export class KitchenTopComponent extends DashboardParentComponent {
  public addRecipeModalVisibility: boolean | undefined = undefined;
  public addRecipeForm: FormGroup;
  public recipeList: Recipe[] = [];
  constructor(
    private kitchenApiService: KitchenApiService,
    private message: NzMessageService,
    formBuilder: FormBuilder) {
    super();
    this.addRecipeForm = formBuilder.group({
      url: new FormControl("", [
        Validators.required,
        Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")
      ]),
      imageUrl: new FormControl("", Validators.pattern("(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?")),
      title: new FormControl("")
    });
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        await this.getRecipeList();
      });
  }

  public cancelAddRecipe(): void {
    this.addRecipeForm.setValue({
      url: null,
      imageUrl: null,
      title: null
    });
    this.addRecipeModalVisibility = false;
  }

  public async addRecipe(): Promise<void> {
    try {
      await this.kitchenApiService.RegisterRecipe({
        id: null,
        url: this.addRecipeForm.value.url,
        imageUrl: this.addRecipeForm.value.imageUrl,
        title: this.addRecipeForm.value.title
      }).toPromise();
    } catch {
      this.message.warning("登録失敗");
      return;
    }
    this.message.success("登録成功");
    this.addRecipeForm.setValue({
      url: null,
      imageUrl: null,
      title: null
    });
    this.addRecipeModalVisibility = false;
    await this.getRecipeList();
  }

  public async deleteRecipe(Recipe: Recipe): Promise<void> {
    await this.kitchenApiService.DeleteRecipe(Recipe).toPromise();
    await this.getRecipeList();
  }

  public async getRecipeList(): Promise<void> {
    this.recipeList = (await this.kitchenApiService.GetRecipeList().toPromise()) ?? [];
  }
}
