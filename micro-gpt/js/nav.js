// Shared navigation for all pages
(function() {
  const chapters = [
    { id: 'index',      file: 'index.html',                   label: 'Welcome' },
    { id: '01',         file: 'chapters/01-what-is-gpt.html',  label: 'What is a GPT?', section: 'Foundations' },
    { id: '02',         file: 'chapters/02-vectors.html',      label: 'Vectors & Linear Algebra' },
    { id: '03',         file: 'chapters/03-embeddings.html',   label: 'Embeddings' },
    { id: '04',         file: 'chapters/04-math-basics.html',  label: 'Probabilities & Softmax' },
    { id: '05',         file: 'chapters/05-autograd.html',     label: 'Automatic Differentiation', section: 'Building Blocks' },
    { id: '06',         file: 'chapters/06-neural-networks.html', label: 'Neural Network Layers' },
    { id: '07',         file: 'chapters/07-attention.html',    label: 'The Attention Mechanism' },
    { id: '08',         file: 'chapters/08-transformer.html',  label: 'The Transformer', section: 'Putting It Together' },
    { id: '09',         file: 'chapters/09-training.html',     label: 'Training & Optimization' },
    { id: '10',         file: 'chapters/10-full-code.html',    label: 'Full Java Code Walkthrough' },
    { id: 'walkthrough', file: 'chapters/walkthrough.html',    label: 'Interactive Walkthrough', section: 'Hands-On' },
    { id: 'glossary',   file: 'glossary.html',                 label: 'Glossary', section: 'Reference' },
  ];

  // Detect if we're in /chapters/ or root
  const inChapters = location.pathname.includes('/chapters/');
  const prefix = inChapters ? '../' : '';

  // Current page
  const currentFile = location.pathname.split('/').pop();

  // Home link goes to from0 root (one level above micro-gpt/)
  const homeHref = inChapters ? '../../' : '../';

  // Build sidebar HTML
  let html = `
    <div class="logo">MicroGPT<br><small>Java Course — Offline Edition</small></div>
    <a href="${homeHref}" class="home-link">&#8962; from0 Home</a>
  `;

  let lastSection = '';
  chapters.forEach(ch => {
    if (ch.section && ch.section !== lastSection) {
      html += `<div class="section-label">${ch.section}</div>`;
      lastSection = ch.section;
    }
    const href = prefix + ch.file;
    const active = currentFile === ch.file.split('/').pop() ? ' active' : '';
    const chNum = ch.id.match(/^\d+$/) ? `<span class="ch">${ch.id}.</span>` : '';
    html += `<a href="${href}" class="${active}">${chNum}${ch.label}</a>`;
  });

  // Inject sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = html;

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close on link click (mobile)
    sidebar.addEventListener('click', e => {
      if (e.target.tagName === 'A') sidebar.classList.remove('open');
    });
  }

  // Reading progress bar
  const progressFill = document.querySelector('.progress-bar .fill');
  if (progressFill) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progressFill.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    });
  }

  // Page navigation (prev/next)
  const navEl = document.querySelector('.page-nav');
  if (navEl) {
    const idx = chapters.findIndex(ch => currentFile === ch.file.split('/').pop());
    let prevHtml = '', nextHtml = '';
    if (idx > 0) {
      const prev = chapters[idx - 1];
      prevHtml = `<a class="prev" href="${prefix}${prev.file}">${prev.label}</a>`;
    }
    if (idx >= 0 && idx < chapters.length - 1) {
      const next = chapters[idx + 1];
      nextHtml = `<a class="next" href="${prefix}${next.file}">${next.label}</a>`;
    }
    navEl.innerHTML = prevHtml + '<span></span>' + nextHtml;
  }
})();
