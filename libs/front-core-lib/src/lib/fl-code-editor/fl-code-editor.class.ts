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
  const firstLine = lines[0]?.trim() || '';
  if (firstLine.startsWith('#!')) {
    if (
      firstLine.includes('/bash') ||
      firstLine.includes('/sh') ||
      firstLine.includes('/zsh') ||
      firstLine.includes('/ksh')
    ) {
      return 'shell';
    }
    // If shebang contains python, return python
    if (firstLine.includes('python')) {
      return 'python';
    }
  }

  // Python-specific keywords
  const pythonKeywords = [
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
  const shellPatterns = [
    /^\s*(cd|ls|mkdir|cp|mv|rm|grep|sed|awk|echo|cat|chmod|chown)\s/m,
    /\$\{?[A-Za-z_][A-Za-z0-9_]*\}?/, // Variable usage: $VAR or ${VAR}
    /\|/, // Pipe
    />>|2>&1/, // Redirection
  ];

  let pythonScore = 0;
  let shellScore = 0;

  // Count Python keywords
  const codeContent = code.toLowerCase();
  for (const keyword of pythonKeywords) {
    if (codeContent.includes(keyword.toLowerCase())) {
      pythonScore++;
    }
  }

  // Check for Python indentation (4 spaces or tab at line start)
  const hasIndentation = lines.some((line) => /^(\s{4}|\t)/.test(line) && line.trim().length > 0);
  if (hasIndentation) {
    pythonScore += 2;
  }

  // Check for shell patterns
  for (const pattern of shellPatterns) {
    if (pattern.test(code)) {
      shellScore++;
    }
  }

  // Return based on scores
  return shellScore >= pythonScore ? 'shell' : 'python';
}
