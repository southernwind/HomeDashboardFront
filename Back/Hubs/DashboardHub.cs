
using System;

using Microsoft.AspNetCore.SignalR;

namespace Back.Hubs {
	public class DashboardHub : Hub {
		public enum Method {
			AquaStateChanged
		}

		public static string GetMethodName(Method method) {
			return method switch
			{
				Method.AquaStateChanged => "aqua-state-changed",
				_ => throw new ArgumentOutOfRangeException(nameof(method), method, null)
			};
		}
	}
}