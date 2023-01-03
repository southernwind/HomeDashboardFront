export function getMfTransactionLargeCategoryId(category: string): number {
  return [
    "保険",
    "税・社会保障",
    "特別な支出",
    "日用品",
    "衣服・美容",
    "食費",
    "水道・光熱費",
    "趣味・娯楽",
    "その他",
    "住宅",
    "通信費",
    "交通費",
    "健康・医療",
    "未分類",
    "教養・教育",
    "現金・カード",
    "交際費",
    "自動車",
    "収入"].findIndex(x => x === category);
}