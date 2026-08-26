/**
 * List of supported languages for code editor component
 */
export type FlCodeEditorLanguage = 'python' | 'json' | 'shell' | 'r' | 'yaml' | 'julia' | 'perl';

/**
 * Check if the given language is supported by the code editor component
 * If not, return 'python' as default
 * @param language
 */
export function flCheckLanguage(language: string): FlCodeEditorLanguage {
  const supportedLanguages: FlCodeEditorLanguage[] = [
    'python',
    'json',
    'shell',
    'r',
    'yaml',
    'julia',
    'perl',
  ];
  if (supportedLanguages.includes(language as FlCodeEditorLanguage)) {
    return language as FlCodeEditorLanguage;
  }
  return 'python';
}

// Python-specific keywords
const PYTHON_KEYWORDS = [
  'def ',
  'class ',
  'import ',
  'from ',
  'elif ',
  'lambda ',
  '__name__',
  'try:',
  'except',
  'finally:',
  'with ',
  'as ',
  'print(',
];

// Shell-specific patterns
const SHELL_PATTERNS = [
  /^\s*(cd|ls|mkdir|cp|mv|rm|grep|sed|awk|echo|cat|chmod|chown)\s/m,
  /\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/, // Variable usage: $VAR or ${VAR}
  /\|/, // Pipe
  />>|2>&1/, // Redirection
];

const SHELL_SHEBANGS = ['/bash', '/sh', '/zsh', '/ksh'];

/**
 * Detect the language from the shebang of the first line, null if there is none
 * or if it is not recognized.
 */
function detectLanguageFromShebang(firstLine: string): 'python' | 'shell' | null {
  if (!firstLine.startsWith('#!')) {
    return null;
  }
  if (SHELL_SHEBANGS.some((shebang) => firstLine.includes(shebang))) {
    return 'shell';
  }
  // If shebang contains python, return python
  if (firstLine.includes('python')) {
    return 'python';
  }
  return null;
}

function countPythonScore(code: string, lines: string[]): number {
  const codeContent = code.toLowerCase();
  let score = PYTHON_KEYWORDS.filter((keyword) => codeContent.includes(keyword.toLowerCase())).length;

  // Check for Python indentation (4 spaces or tab at line start)
  const hasIndentation = lines.some((line) => /^(\s{4}|\t)/.test(line) && line.trim().length > 0);
  if (hasIndentation) {
    score += 2;
  }

  return score;
}

function countShellScore(code: string): number {
  return SHELL_PATTERNS.filter((pattern) => pattern.test(code)).length;
}

/**
 * Detect language from code content (Python vs Shell)
 * @param code - The code content to analyze
 * @returns 'python' or 'shell' based on simple heuristics
 */
export function flDetectLanguage(code: string): 'python' | 'shell' {
  if (!code || code.trim().length === 0) {
    return 'python';
  }

  const lines = code.split('\n').filter((line) => line.trim().length > 0);

  // Check for shell shebang at the start
  const shebangLanguage = detectLanguageFromShebang(lines[0]?.trim() || '');
  if (shebangLanguage != null) {
    return shebangLanguage;
  }

  const pythonScore = countPythonScore(code, lines);
  const shellScore = countShellScore(code);

  // Return based on scores
  return shellScore >= pythonScore ? 'shell' : 'python';
}
