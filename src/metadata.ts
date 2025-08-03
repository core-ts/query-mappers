export interface StringMap {
  [key: string]: string;
}
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface Model {
  name?: string;
  attributes: Attributes;
  source?: string;
  table?: string;
  collection?: string;
  model?: any;
  schema?: any;
}
export interface Attribute {
  column?: string;
  match?: MatchType;
}
export interface Attributes {
  [key: string]: Attribute;
}
