export interface DhcpLease {
  timeOfLeaseExpiry: string;
  macAddress: string;
  ipAddress: string;
  hostName: string;
  clientId: string;
  vendor: {
    registry: string;
    assignment: string;
    organizationName: string;
    organizationAddress: string;
  }
}