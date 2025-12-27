export interface StringMap {
  [key: string]: string;
}
export type Operator = "=" | "like" | "!=" | "<>" | ">" | ">=" | "<" | "<="

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
  operator?: Operator;
}
export interface Attributes {
  [key: string]: Attribute;
}
