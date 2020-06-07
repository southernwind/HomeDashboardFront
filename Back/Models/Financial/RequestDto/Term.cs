using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Back.Models.Financial.Parameters {
	public class Term {
		public string From {
			get;
			set;
		}

		public string To {
			get;
			set;
		}

		public DateTime GetFrom() {
			return DateTime.Parse(this.From);
		}

		public DateTime GetTo() {
			return DateTime.Parse(this.To);
		}
	}
}
