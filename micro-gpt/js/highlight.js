// Minimal Java/Python syntax highlighter — runs offline, no dependencies
(function() {
  const JAVA_KW = /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|var|void|volatile|while|true|false|null)\b/g;
  const JAVA_TYPES = /\b(String|Integer|Double|Float|Boolean|List|ArrayList|Map|HashMap|Set|HashSet|Object|System|Math|Arrays|Collections|Value|Optional)\b/g;
  const JAVA_ANNOTATIONS = /(@\w+)/g;
  const NUMBERS = /\b(\d+\.?\d*[fFdDlL]?)\b/g;
  const STRINGS = /(\"[^\"]*\")/g;
  const SINGLE_COMMENT = /(\/\/.*)/g;
  const MULTI_COMMENT = /(\/\*[\s\S]*?\*\/)/g;
  const FUNCTIONS = /\b([a-zA-Z_]\w*)\s*\(/g;

  function highlight(code, lang) {
    // Escape HTML first
    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Protect strings and comments first (store, replace with placeholders)
    const tokens = [];
    function stash(match, cls) {
      const id = '\x00' + tokens.length + '\x00';
      tokens.push(`<span class="${cls}">${match}</span>`);
      return id;
    }

    code = code.replace(MULTI_COMMENT, m => stash(m, 'cm'));
    code = code.replace(SINGLE_COMMENT, m => stash(m, 'cm'));
    code = code.replace(STRINGS, m => stash(m, 'st'));

    if (lang === 'python') {
      const PY_COMMENT = /(#.*)/g;
      code = code.replace(PY_COMMENT, m => stash(m, 'cm'));
      const PY_KW = /\b(and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None|self)\b/g;
      code = code.replace(PY_KW, '<span class="kw">$1</span>');
    }

    code = code.replace(JAVA_ANNOTATIONS, '<span class="an">$1</span>');
    code = code.replace(JAVA_KW, '<span class="kw">$1</span>');
    code = code.replace(JAVA_TYPES, '<span class="ty">$1</span>');
    code = code.replace(NUMBERS, '<span class="nu">$1</span>');
    code = code.replace(FUNCTIONS, '<span class="fn">$1</span>(');

    // Restore stashed tokens
    tokens.forEach((t, i) => {
      code = code.replace('\x00' + i + '\x00', t);
    });

    return code;
  }

  // Auto-highlight all <pre><code> blocks on page load
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(block => {
      const lang = block.className.replace('language-', '') || 'java';
      block.innerHTML = highlight(block.textContent, lang);
    });
  });
})();
