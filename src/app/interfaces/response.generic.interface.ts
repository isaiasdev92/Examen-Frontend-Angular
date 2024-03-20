export interface ResponseGeneric<T> {
  data?:    T;
  message: string;
  errors:  string[];
}

