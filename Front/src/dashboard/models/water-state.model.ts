export interface WaterState {
  time: string,
  minWaterTemperature: number,
  lowerQuartileWaterTemperature: number,
  medianWaterTemperature: number,
  upperQuartileWaterTemperature: number,
  maxWaterTemperature: number,
  minTemperature: number,
  lowerQuartileTemperature: number,
  medianTemperature: number,
  upperQuartileTemperature: number,
  maxTemperature: number,
  minHumidity: number,
  lowerQuartileHumidity: number,
  medianHumidity: number,
  upperQuartileHumidity: number,
  maxHumidity: number
}

export interface CurrentWaterState {
  time: string,
  waterTemperature: number,
  temperature: number,
  humidity: number
}
