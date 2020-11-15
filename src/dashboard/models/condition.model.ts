export interface Condition<T> {
  condition: (value: T) => boolean;
}