using MoneyForwardViewer.DataBase.Tables;

namespace Database.Tables {
	public class LockableMfAsset : MfAsset {
		public bool IsLocked {
			get;
			set;
		}
	}
}
