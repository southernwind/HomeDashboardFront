using System.ComponentModel.DataAnnotations;

using CsvHelper.Configuration.Attributes;

namespace Database.Tables {
	public class MacAddressVendor {
		/// <summary>
		/// レジストリ
		/// </summary>
		public string? Registry {
			get;
			set;
		}

		/// <summary>
		/// ベンダーコード
		/// </summary>
		public string Assignment {
			get;
			set;
		} = null!;

		/// <summary>
		/// ベンダー名
		/// </summary>
		[Name("Organization Name")]
		[MaxLength(1024)]
		public string? OrganizationName {
			get;
			set;
		}

		/// <summary>
		/// ベンダー住所
		/// </summary>
		[Name("Organization Address")]
		[MaxLength(1024)]
		public string? OrganizationAddress {
			get;
			set;
		}
	}
}
