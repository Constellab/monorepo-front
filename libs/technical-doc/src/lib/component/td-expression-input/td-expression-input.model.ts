export interface TdExpressionFunction {
  name: string;
  signature: string;
  description: string;
}

export interface TdExpressionFunctionDef {
  name: string;
  signature: string;
  descriptionKey: string;
}

export const TD_EXPRESSION_FUNCTIONS: TdExpressionFunctionDef[] = [
  { name: 'sum', signature: 'sum(...)', descriptionKey: 'td.fn_sum' },
  { name: 'mean', signature: 'mean(...)', descriptionKey: 'td.fn_mean' },
  { name: 'median', signature: 'median(...)', descriptionKey: 'td.fn_median' },
  { name: 'min', signature: 'min(...)', descriptionKey: 'td.fn_min' },
  { name: 'max', signature: 'max(...)', descriptionKey: 'td.fn_max' },
  { name: 'count', signature: 'count(...)', descriptionKey: 'td.fn_count' },
  { name: 'stddev', signature: 'stddev(...)', descriptionKey: 'td.fn_stddev' },
  { name: 'abs', signature: 'abs(x)', descriptionKey: 'td.fn_abs' },
  { name: 'round', signature: 'round(x, n)', descriptionKey: 'td.fn_round' },
  { name: 'sqrt', signature: 'sqrt(x)', descriptionKey: 'td.fn_sqrt' },
  { name: 'pow', signature: 'pow(x, n)', descriptionKey: 'td.fn_pow' },
  { name: 'if', signature: 'if(cond, a, b)', descriptionKey: 'td.fn_if' },
  { name: 'concat', signature: 'concat(...)', descriptionKey: 'td.fn_concat' },
];
