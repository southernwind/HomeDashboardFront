
using MoneyForwardViewer.DataBase.Tables;

namespace Database.Tables {
	public class LockableMfTransaction : MfTransaction {
		public LockableMfTransaction() {
		}

		public LockableMfTransaction(MfTransaction mfTransaction) {
			this.TransactionId = mfTransaction.TransactionId;
			this.IsCalculateTarget = mfTransaction.IsCalculateTarget;
			this.Date = mfTransaction.Date;
			this.Content = mfTransaction.Content;
			this.Amount = mfTransaction.Amount;
			this.Institution = mfTransaction.Institution;
			this.LargeCategory = mfTransaction.LargeCategory;
			this.MiddleCategory = mfTransaction.MiddleCategory;
			this.Memo = mfTransaction.Memo;
		}

		public bool IsLocked {
			get;
			set;
		}
	}
}
