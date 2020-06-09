namespace Database.Tables {
	/// <summary>
	/// ユーザー設定テーブル
	/// </summary>
	public class UserSetting {
		/// <summary>
		/// ID
		/// </summary>
		public string? Id {
			get;
			set;
		}

		/// <summary>
		/// マネーフォワードID
		/// </summary>
		public string? MoneyForwardId {
			get;
			set;
		}

		/// <summary>
		/// マネーフォワードパスワード
		/// </summary>
		public string? MoneyForwardPassword {
			get;
			set;
		}
	}
}
