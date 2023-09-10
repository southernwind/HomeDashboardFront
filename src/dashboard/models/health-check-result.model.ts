export interface HealthCheckResult {
  healthCheckTargetId: number;
  name: string;
  host: string;
  isEnable: boolean;
  checkType: number;
  healthCheckResultId: number;
  dateTime: Date;
  state: boolean;
  reason: string;
}