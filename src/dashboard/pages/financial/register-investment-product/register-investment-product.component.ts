import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvestmentProduct } from 'src/dashboard/models/investment-product.model';
import { FinancialApiService } from 'src/dashboard/services/financial-api.service';
import { NzMessageService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { InvestmentCurrencyUnit } from 'src/dashboard/models/investment-currency-unit.model';

@UntilDestroy()
@Component({
  templateUrl: "./register-investment-product.component.html",
})
export class RegisterInvestmentProductComponent extends DashboardParentComponent {
  public addInvestmentProductModalVisibility: boolean;
  public addInvestmentProductForm: FormGroup;
  public investmentProductList: InvestmentProduct[];
  public investmentCurrencyUnitList: InvestmentCurrencyUnit[];
  public addInvestmentProductAmountModalProduct: InvestmentProduct;
  public addInvestmentProductAmountForm: FormGroup;
  constructor(
    private financialApiService: FinancialApiService,
    private message: NzMessageService,
    formBuilder: FormBuilder) {
    super();
    this.addInvestmentProductForm = formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      currencyUnit: new FormControl(null, [Validators.required]),
      key: new FormControl(null, [Validators.required])
    });
    this.addInvestmentProductAmountForm = formBuilder.group({
      date: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/\d+/)]),
      price: new FormControl(null, [Validators.required, Validators.pattern(/\d+/)])
    });
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        this.investmentCurrencyUnitList = (await this.financialApiService.GetInvestmentCurrencyUnitList().pipe(untilDestroyed(this)).toPromise());
        await this.getInvestmentProductList();
      });
  }
  /**
   * 商品情報登録キャンセル
   *
   * @memberof RegisterInvestmentProductComponent
   */
  public cancelAddInvestmentProduct(): void {
    this.addInvestmentProductForm.setValue({
      name: null,
      type: null,
      currencyUnit: null,
      key: null
    });
    this.addInvestmentProductModalVisibility = false;
  }

  /**
   * 投資商品情報登録
   *
   * @returns {Promise<void>}
   * @memberof RegisterInvestmentProductComponent
   */
  public async addInvestmentProduct(): Promise<void> {
    try {
      await this.financialApiService.PostRegisterInvestmentProduct(
        this.addInvestmentProductForm.value.name,
        this.addInvestmentProductForm.value.type,
        this.addInvestmentProductForm.value.currencyUnit,
        this.addInvestmentProductForm.value.key
      ).pipe(untilDestroyed(this))
        .toPromise();
    } catch {
      this.message.warning("登録失敗");
      return;
    }
    this.message.success("登録成功");
    this.addInvestmentProductForm.setValue({
      name: null,
      type: null,
      currencyUnit: null,
      key: null
    });
    this.addInvestmentProductModalVisibility = false;
    await this.getInvestmentProductList();
  }

  /**
   * 投資商品情報一覧取得
   *
   * @returns {Promise<void>}
   * @memberof RegisterInvestmentProductComponent
   */
  public async getInvestmentProductList(): Promise<void> {
    this.investmentProductList = await this.financialApiService.GetInvestmentProductList().pipe(untilDestroyed(this)).toPromise();
  }

  /**
   * 投資商品取得量登録キャンセル
   *
   * @memberof RegisterInvestmentProductComponent
   */
  public cancelAddInvestmentProductAmount(): void {
    this.addInvestmentProductAmountForm.setValue({
      date: null,
      amount: null,
      price: null
    });
    this.addInvestmentProductAmountModalProduct = null;
  }

  /**
   * 投資商品取得量登録
   *
   * @returns {Promise<void>}
   * @memberof RegisterInvestmentProductComponent
   */
  public async addInvestmentProductAmount(): Promise<void> {
    try {
      await this.financialApiService.PostRegisterInvestmentProductAmount(
        this.addInvestmentProductAmountModalProduct.investmentProductId,
        moment(this.addInvestmentProductAmountForm.value.date),
        Number(this.addInvestmentProductAmountForm.value.amount),
        Number(this.addInvestmentProductAmountForm.value.price),
      ).pipe(untilDestroyed(this)).toPromise();
    } catch {
      this.message.warning("登録失敗");
      return;
    }
    this.message.success("登録成功");
    this.addInvestmentProductAmountForm.setValue({
      date: null,
      amount: null,
      price: null
    });
    this.addInvestmentProductAmountModalProduct = null;
  }
}
