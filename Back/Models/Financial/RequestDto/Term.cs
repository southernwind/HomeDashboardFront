using System;

namespace Back.Models.Financial.RequestDto {
	/// <summary>
	/// 期間
	/// </summary>
	public class Term {
		/// <summary>
		/// から
		/// </summary>
		public string From {
			get;
			set;
		}

		/// <summary>
		/// まで
		/// </summary>
		public string To {
			get;
			set;
		}

		/// <summary>
		/// FromをDate型で取得
		/// </summary>
		/// <returns>変換後値</returns>
		public DateTime GetFrom() {
			return DateTime.Parse(this.From);
		}

		/// <summary>
		/// ToをDate型で取得
		/// </summary>
		/// <returns>変換後値</returns>
		public DateTime GetTo() {
			return DateTime.Parse(this.To);
		}
	}
}
