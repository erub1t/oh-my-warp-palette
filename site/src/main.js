import yaml from 'js-yaml';

const themeGrid = document.getElementById('themeGrid');
const themeCount = document.getElementById('themeCount');
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const themeIcon = document.getElementById('themeIcon');

const THEME_FILES = [
  'april.yaml',
  'atom-one-dark.yaml',
  'atom-one-light.yaml',
  'ayu.yaml',
  'ayu-light.yaml',
  'cocoa-cream.yaml',
  'github-dark.yaml',
  'github-dark-dimmed.yaml',
  'github-light.yaml',
  'milk-tea.yaml',
  'muted-forest.yaml',
  'pastel-dawn.yaml',
  'twilight-slate.yaml'
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }[c]));
}

async function loadThemes() {
  const themes = [];
  for (const file of THEME_FILES) {
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}themes/${file}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const data = yaml.load(text) || {};
      data.id = file.replace(/\.yaml$/, '');
      if (!data.name) {
        data.name = data.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
      themes.push(data);
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }
  return themes;
}

function renderTerminal(theme) {
  const t = theme.terminal_colors || {};
  const n = t.normal || {};
  const b = t.bright || {};
  const fg = theme.foreground || '#c9d1d9';
  const bg = theme.background || '#0d1117';
  const accent = theme.accent || '#58a6ff';
  const cmd = `npx --registry=https://registry.npmjs.org omwpcli install ${theme.id}`;

  return `
    <div class="terminal" style="background:${bg};color:${fg}">
      <div class="terminal-bar">
        <span class="terminal-dot" style="background:${n.red || '#ff7b72'}"></span>
        <span class="terminal-dot" style="background:${n.yellow || '#e3b341'}"></span>
        <span class="terminal-dot" style="background:${n.green || '#7ee787'}"></span>
        <button class="copy-btn" data-cmd="${escapeHtml(cmd)}" aria-label="复制命令" title="复制命令" style="margin-left:auto;background:${accent};color:${bg};border:2px solid ${fg};box-shadow:2px 2px 0 ${fg}">COPY</button>
      </div>
      <div class="terminal-line"><span style="color:${accent}">$</span> <span class="terminal-cmd" style="color:${fg}">${cmd}</span></div>
      <div class="terminal-line" style="color:${n.green || '#7ee787'}">Installed ${theme.name}</div>
      <div class="terminal-line"></div>
      <div class="terminal-line"><span style="color:${n.red || '#ff7b72'}">ERROR</span> <span style="color:${n.yellow || '#e3b341'}">WARN</span> <span style="color:${n.blue || '#79c0ff'}">INFO</span> <span style="color:${n.magenta || '#d2a8ff'}">DEBUG</span></div>
      <div class="terminal-line"><span style="color:${b.cyan || '#56d4dd'}">function</span> <span style="color:${b.green || '#7ee787'}">hello</span>() { <span style="color:${b.magenta || '#d2a8ff'}">return</span> <span style="color:${n.yellow || '#e3b341'}">"world"</span>; }</div>
      <div class="terminal-line"><span style="color:${n.black || '#484f58'}">blk</span> <span style="color:${n.white || '#b1bac4'}">wht</span> <span style="color:${b.black || '#8b949e'}">B-K</span> <span style="color:${b.white || '#ffffff'}">B-W</span></div>
      <div class="terminal-line" style="color:${accent}">█▓▒░ ${accent.toUpperCase()}</div>
    </div>
  `;
}

function renderSwatches(title, colors) {
  if (!colors) return '';
  const items = Object.entries(colors).map(([key, color]) =>
    `<div class="color-swatch" style="background:${color}" data-color="${key}: ${color.toUpperCase()}" title="${key}: ${color.toUpperCase()}"></div>`
  ).join('');
  return `<div><div class="config-group-title pixel">${title}</div><div class="color-row">${items}</div></div>`;
}

function renderMeta(theme) {
  const detailFg = theme.details === 'darker' ? '#f4f1ea' : '#1a1a1a';
  const detailBg = theme.details === 'darker' ? '#1a1a1a' : '#f4f1ea';
  return `
    <div class="config-meta">
      <div class="meta-chip"><span class="dot" style="background:${theme.accent}"></span>accent</div>
      <div class="meta-chip"><span class="dot" style="background:${theme.background}"></span>bg</div>
      <div class="meta-chip"><span class="dot" style="background:${theme.foreground}"></span>fg</div>
      <div class="meta-chip"><span class="dot" style="background:${theme.cursor}"></span>cursor</div>
      <div class="meta-chip" style="grid-column: span 2;"><span class="dot" style="background:${detailBg};border-color:${detailFg}"></span>details: ${theme.details}</div>
    </div>
  `;
}

function renderThemes(themes) {
  if (themes.length === 0) {
    themeGrid.innerHTML = `<div class="error-box">未加载到主题，请确认 themes/ 目录存在且可访问。</div>`;
    themeCount.textContent = '0 THEMES';
    return;
  }

  themeGrid.innerHTML = themes.map(theme => `
    <article class="theme-card">
      <div class="theme-card-header">
        <h3 class="theme-name">${escapeHtml(theme.name)}</h3>
        <code class="theme-id">${theme.id}.yaml</code>
      </div>
      ${renderTerminal(theme)}
      <div class="theme-config">
        ${renderMeta(theme)}
        ${renderSwatches('NORMAL', theme.terminal_colors?.normal)}
        ${renderSwatches('BRIGHT', theme.terminal_colors?.bright)}
      </div>
    </article>
  `).join('');

  themeCount.textContent = `${themes.length} THEMES`;

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.cmd);
        const original = btn.textContent;
        btn.textContent = 'OK!';
        setTimeout(() => btn.textContent = original, 1200);
      } catch (err) {
        btn.textContent = 'FAIL';
        setTimeout(() => btn.textContent = 'COPY', 1200);
      }
    });
  });
}

function setPageTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('omwp-theme', mode);
  themeLabel.textContent = mode === 'dark' ? 'DARK MODE' : 'LIGHT MODE';
  themeIcon.innerHTML = mode === 'dark'
    ? '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
    : '<path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 13h2a1 1 0 100-2H2a1 1 0 100 2zm18 0h2a1 1 0 100-2h-2a1 1 0 100 2zM11 2v2a1 1 0 102 0V2a1 1 0 10-2 0zm0 18v2a1 1 0 102 0v-2a1 1 0 10-2 0zM5.99 4.58a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41L5.99 4.58zm12.37 12.37a1 1 0 10-1.41 1.41l1.41 1.41a1 1 0 101.41-1.41l-1.41-1.41zm1.41-10.96a1 1 0 10-1.41-1.41l-1.41 1.41a1 1 0 101.41 1.41l1.41-1.41zM7.4 18.02a1 1 0 10-1.41-1.41l-1.41 1.41a1 1 0 101.41 1.41l1.41-1.41z"/>';
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setPageTheme(current === 'dark' ? 'light' : 'dark');
});

const saved = localStorage.getItem('omwp-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
setPageTheme(saved || (prefersDark ? 'dark' : 'light'));

loadThemes()
  .then(renderThemes)
  .catch(err => {
    console.error(err);
    themeGrid.innerHTML = `<div class="error-box">加载主题失败：${escapeHtml(err.message)}</div>`;
    themeCount.textContent = 'ERROR';
  });
