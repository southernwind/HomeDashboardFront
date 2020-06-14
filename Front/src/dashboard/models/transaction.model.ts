
export interface Transaction {
  /** ID */
  transactionId: string;

  /** 計算対象 */
  isCalculateTarget: boolean;

  /** 日付 */
  date: string;

  /** 内容 */
  content: string;

  /** 金額(円) */
  amount: number;

  /** 金融機関 */
  institution: string;

  /** 大項目 */
  largeCategory: string;

  /** 中項目 */
  middleCategory: string;

  /** メモ */
  memo: string;
}
