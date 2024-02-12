import { Component } from '@angular/core';
import { DashboardParentComponent } from 'src/dashboard/components/parent/dashboard-parent.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvestmentProduct, InvestmentProductAmount } from 'src/dashboard/models/investment-product.model';
import { FinancialApiService } from 'src/dashboard/services/financial-api.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as moment from 'moment';
import { firstValueFrom, last, lastValueFrom } from 'rxjs';
import { InvestmentCurrencyUnit } from 'src/dashboard/models/investment-currency-unit.model';
import Enumerable from 'linq';
import { jpyCurrencyId } from 'src/constants/constants';
import { TradingAccount } from 'src/dashboard/models/trading-account.model';
import { TradingAccountDetail } from 'src/dashboard/models/trading-account-detail.model';

@UntilDestroy()
@Component({
  templateUrl: "./investment.component.html",
  styleUrls: ["./investment.component.scss"]
})
export class InvestmentComponent extends DashboardParentComponent {
  /** 詳細表示中の投資商品 */
  public viewingInvestmentProductDetail: {
    investmentProduct: InvestmentProduct,
    investmentProductAmountList: InvestmentProductAmount[]
  } | null = null;
  public addInvestmentProductModalVisibility: boolean = false;
  public addInvestmentProductForm: FormGroup;
  public investmentProductList: InvestmentProduct[] = [];
  /** 評価額 */
  public totalValuation: number | null = null;
  /** 収益率 */
  public rateOfReturn: number | null = null;
  /** 収益額 */
  public totalProfit: number | null = null;
  /** 日本円単位 */
  public yenCurrency: InvestmentCurrencyUnit | undefined = undefined;
  /** 投資商品タイプリスト */
  public investmentProductTypeList: string[] = [];
  /** 投資商品カテゴリーリスト */
  public investmentProductCategoryList: string[] = [];
  /** 口座リスト */
  public tradingAccountList: TradingAccount[] = [];
  public investmentCurrencyUnitList: InvestmentCurrencyUnit[] = [];
  public addInvestmentProductAmountModalProduct: InvestmentProduct | null = null;
  public addInvestmentProductAmountForm: FormGroup;
  /** 表示タイプ */
  public viewType: "account" | "product" = "product"

  /** 表示アカウントID */
  public selectedAccountId: number | null = null;
  /** 表示アカウント */
  public selectedAccount: TradingAccountDetail | undefined = undefined;

  constructor(
    private financialApiService: FinancialApiService,
    private message: NzMessageService,
    formBuilder: FormBuilder) {
    super();
    this.addInvestmentProductForm = formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      currencyUnit: new FormControl(null, [Validators.required]),
      key: new FormControl(null, [Validators.required])
    });
    this.addInvestmentProductAmountForm = formBuilder.group({
      tradingAccount: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      amount: new FormControl(null, [Validators.required, Validators.pattern(/\d+/)]),
      price: new FormControl(null, [Validators.required, Validators.pattern(/\d+/)])
    });
    this.onInit
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        this.investmentCurrencyUnitList = await lastValueFrom(this.financialApiService.GetInvestmentCurrencyUnitList().pipe(untilDestroyed(this)));
        this.yenCurrency = Enumerable.from(this.investmentCurrencyUnitList).first(x => x.id === jpyCurrencyId);
        await this.getInvestmentProductList();
        this.investmentProductTypeList = (await this.financialApiService.GetInvestmentProductTypeList().toPromise()) ?? [];
        this.investmentProductCategoryList = (await this.financialApiService.GetInvestmentProductCategoryList().toPromise()) ?? [];
        this.tradingAccountList = (await firstValueFrom(this.financialApiService.GetTradingAccountListAsync())) ?? [];
      });
  }
  /**
   * 商品情報登録キャンセル
   *
   * @memberof InvestmentComponent
   */
  public cancelAddInvestmentProduct(): void {
    this.addInvestmentProductForm.setValue({
      name: null,
      type: null,
      category: null,
      currencyUnit: null,
      key: null
    });
    this.addInvestmentProductModalVisibility = false;
  }

  /**
   * 投資商品情報登録
   *
   * @returns {Promise<void>}
   * @memberof InvestmentComponent
   */
  public async addInvestmentProduct(): Promise<void> {
    try {
      await this.financialApiService.PostRegisterInvestmentProduct(
        this.addInvestmentProductForm.value.name,
        this.addInvestmentProductForm.value.type,
        this.addInvestmentProductForm.value.category,
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
      category: null,
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
   * @memberof InvestmentComponent
   */
  public async getInvestmentProductList(): Promise<void> {
    this.investmentProductList = await lastValueFrom(this.financialApiService.GetInvestmentProductList().pipe(untilDestroyed(this)));
    var list =
      Enumerable
        .from(this.investmentProductList);
    this.totalValuation =
      list
        .select(x => x.latestRate * x.amount * Enumerable.from(this.investmentCurrencyUnitList).first(icu => icu.id == x.currencyUnitId).latestRate)
        .sum();
    this.totalProfit =
      list
        .select(x => (x.latestRate - x.averageRate) * x.amount * Enumerable.from(this.investmentCurrencyUnitList).first(icu => icu.id == x.currencyUnitId).latestRate)
        .sum();
    this.rateOfReturn = this.totalProfit / (this.totalValuation - this.totalProfit) * 100;
  }


  /**
   * 口座情報取得取得
   *
   * @returns {Promise<void>}
   * @memberof InvestmentComponent
   */
  public async getTradingAccountDetail(selectedAccount: number): Promise<void> {
    this.selectedAccount = await firstValueFrom(this.financialApiService.getTradingAccountDetail(selectedAccount).pipe(untilDestroyed(this)));
  }

  /**
   * 投資商品詳細表示
   *
   * @returns {void}
   * @memberof InvestmentComponent
   */
  public async openInvestmentProductDetailModal(investmentProduct: InvestmentProduct): Promise<void> {
    const investmentProductAmountList = await lastValueFrom(
      this.financialApiService
        .getInvestmentProductAmountList(investmentProduct.investmentProductId)
        .pipe(untilDestroyed(this)))
    this.viewingInvestmentProductDetail = {
      investmentProduct: investmentProduct,
      investmentProductAmountList: investmentProductAmountList
    };
  }

  /**
   * 投資商品詳細クローズ
   *
   * @returns {void}
   * @memberof InvestmentComponent
   */
  public closeInvestmentProductDetail(): void {
    this.viewingInvestmentProductDetail = null;
  }

  /**
   * 投資商品取得量登録キャンセル
   *
   * @memberof InvestmentComponent
   */
  public cancelAddInvestmentProductAmount(): void {
    this.addInvestmentProductAmountForm.setValue({
      tradingAccount: null,
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
   * @memberof InvestmentComponent
   */
  public async addInvestmentProductAmount(): Promise<void> {
    if (this.addInvestmentProductAmountModalProduct === null) {
      return;
    }
    try {
      await this.financialApiService.PostRegisterInvestmentProductAmount(
        this.addInvestmentProductAmountModalProduct.investmentProductId,
        this.addInvestmentProductAmountForm.value.tradingAccount.tradingAccountId,
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
      tradingAccount: this.addInvestmentProductAmountForm.value.tradingAccount,
      date: this.addInvestmentProductAmountForm.value.date,
      amount: null,
      price: null
    });
    this.addInvestmentProductAmountModalProduct = null;
  }
}
