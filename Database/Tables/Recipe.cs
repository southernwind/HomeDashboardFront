using System.ComponentModel.DataAnnotations;

namespace Database.Tables {
	public class Recipe {
		public long? Id {
			get;
			set;
		}

		[MaxLength(1024)]
		public string? Url {
			get;
			set;
		}

		[MaxLength(1024)]
		public string? Title {
			get;
			set;
		}

		[MaxLength(1024)]
		public string? ImageUrl {
			get;
			set;
		}
	}
}
