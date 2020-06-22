using Database.Tables;

namespace Back.Models.Network.ResponseDto {
	public class DhcpLease {
		public DhcpLease(string timeOfLeaseExpiry, string macAddress, string ipAddress, string hostName, string clientId) {
			this.TimeOfLeaseExpiry = timeOfLeaseExpiry;
			this.MacAddress = macAddress;
			this.IpAddress = ipAddress;
			this.HostName = hostName;
			this.ClientId = clientId;
		}

		public string TimeOfLeaseExpiry {
			get;
			set;
		}

		public string MacAddress {
			get;
			set;
		}

		public string IpAddress {
			get;
			set;
		}

		public string HostName {
			get;
			set;
		}

		public string ClientId {
			get;
			set;
		}

		public MacAddressVendor? Vendor {
			get;
			set;
		}
	}
}
