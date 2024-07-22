export type FlTableColumnStatic<T> = Extract<keyof T, string> | string;
