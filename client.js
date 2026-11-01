/**
 * Chrome DevTools, browser half: the sidebar entry and the main-area page it
 * opens. The page explains the connected chrome-devtools-mcp server and offers
 * copyable example prompts; the MCP connection itself is the sibling Host row
 * `chrome-devtools-mcp` declared by this bundle's patch.
 */
window.__ModuleLoader__.load({
  id: '@local/chrome-devtools',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'chromeDevTools';
    /** The id shared by the sidebar entry and the main panel it opens. */
    const PANEL_ID = 'chrome-devtools';

    const en = {
      panel: 'Chrome DevTools',
      title: 'Chrome DevTools',
      subtitle: 'Control and inspect a live Chrome browser from your sessions, through chrome-devtools-mcp.',
      examplesTitle: 'Try it in a session',
      examplesHint: 'Click a prompt to copy it, then paste it into any session.',
      copied: 'Copied',
      copyFailed: 'Copy failed',
      toolsTitle: 'What the agent can do',
      toolPerf: 'Record performance traces and extract actionable insights',
      toolDebug: 'Take screenshots, read console messages, and inspect network requests',
      toolAuto: 'Automate pages reliably — navigation, clicks, typing — with automatic waiting',
      connectionTitle: 'Connection',
      connServer: 'Server',
      connTransport: 'Transport',
      connPrefix: 'Tool prefix',
      connProxy: 'npm downloads use proxy',
      note: 'Chrome starts automatically the first time a tool needs it; the agent exposes full browser content, so avoid sensitive pages.',
      examplePerf: 'Check the performance of https://developers.chrome.com',
      exampleShot: 'Open https://example.com and take a screenshot',
      exampleConsole: 'Open https://example.com and list any console errors',
      exampleAuto: 'Open https://example.com, click the "More information..." link and report where it goes',
    };
    const zh = {
      panel: 'Chrome DevTools',
      title: 'Chrome DevTools',
      subtitle: '通过 chrome-devtools-mcp，在会话中控制并检查一个实时 Chrome 浏览器。',
      examplesTitle: '在会话中试试',
      examplesHint: '点击提示词即可复制，然后粘贴到任意会话。',
      copied: '已复制',
      copyFailed: '复制失败',
      toolsTitle: '智能体可以做什么',
      toolPerf: '录制性能 trace 并给出可执行的优化建议',
      toolDebug: '截图、读取控制台消息、检查网络请求',
      toolAuto: '可靠地自动化页面——导航、点击、输入，并自动等待结果',
      connectionTitle: '连接',
      connServer: '服务器',
      connTransport: '传输',
      connPrefix: '工具前缀',
      connProxy: 'npm 下载代理',
      note: 'Chrome 会在工具第一次需要时自动启动；MCP 会暴露浏览器的全部内容，请避免打开敏感页面。',
      examplePerf: '检查 https://developers.chrome.com 的性能',
      exampleShot: '打开 https://example.com 并截图',
      exampleConsole: '打开 https://example.com 并列出控制台报错',
      exampleAuto: '打开 https://example.com，点击 "More information..." 链接并告诉我它指向哪里',
    };

    /** Sidebar glyph: an original browser-window mark with a devtools bracket. */
    function PanelIcon({ size }) {
      const edge = size ?? 18;
      return h('svg', {
        viewBox: '0 0 24 24', width: edge, height: edge,
        'aria-hidden': true, fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
        style: { display: 'block' },
      },
      h('rect', { x: 2.5, y: 4, width: 19, height: 16, rx: 3 }),
      h('path', { d: 'M2.5 8.5h19' }),
      h('circle', { cx: 5.6, cy: 6.25, r: 0.55, fill: 'currentColor', stroke: 'none' }),
      h('circle', { cx: 7.6, cy: 6.25, r: 0.55, fill: 'currentColor', stroke: 'none' }),
      h('path', { d: 'M10 12.5 7.5 15l2.5 2.5' }),
      h('path', { d: 'm14 12.5 2.5 2.5-2.5 2.5' }));
    }

    /** Component-local stylesheet; unmounting the page removes it. */
    function Styles() {
      return h('style', null, `
        .cdt-page { box-sizing: border-box; height: 100%; overflow-y: auto; padding: 32px 28px 48px; background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); }
        .cdt-inner { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
        .cdt-header { display: flex; align-items: center; gap: 14px; }
        .cdt-badge { flex: none; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); color: var(--dsw-alias-brand-primary); }
        .cdt-title { margin: 0; font-size: 20px; font-weight: 600; line-height: 1.3; }
        .cdt-subtitle { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
        .cdt-section { background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; padding: 16px 18px; }
        .cdt-sectionTitle { margin: 0 0 4px; font-size: 13px; font-weight: 600; }
        .cdt-hint { margin: 0 0 12px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
        .cdt-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .cdt-listItem { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.5; }
        .cdt-dot { flex: none; margin-top: 7px; width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-brand-primary); }
        .cdt-examples { display: flex; flex-direction: column; gap: 8px; }
        .cdt-example { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; text-align: left; font: inherit; font-size: 13px; line-height: 1.5; color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l1); border-radius: 8px; padding: 10px 12px; cursor: pointer; }
        .cdt-example:hover { border-color: var(--dsw-alias-border-l2); }
        .cdt-example:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
        .cdt-copyState { flex: none; font-size: 11px; color: var(--dsw-alias-state-success-primary); }
        .cdt-facts { display: grid; grid-template-columns: max-content 1fr; gap: 6px 16px; margin: 0; font-size: 13px; line-height: 1.5; }
        .cdt-facts dt { color: var(--dsw-alias-label-secondary); }
        .cdt-facts dd { margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
        .cdt-note { margin: 12px 0 0; font-size: 12px; line-height: 1.5; color: var(--dsw-alias-label-secondary); }
      `);
    }

    /** One copyable example prompt. */
    function ExampleRow({ t, prompt }) {
      const [state, setState] = React.useState(null);
      const timer = React.useRef(null);
      React.useEffect(() => () => window.clearTimeout(timer.current), []);
      const copy = async () => {
        let ok = false;
        try {
          await navigator.clipboard.writeText(prompt);
          ok = true;
        } catch {
          // Restricted clipboard: fall back to a transient textarea selection.
          try {
            const area = document.createElement('textarea');
            area.value = prompt;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            ok = document.execCommand('copy');
            area.remove();
          } catch { ok = false; }
        }
        setState(ok ? 'copied' : 'failed');
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => { setState(null); }, 1600);
      };
      return h('button', { type: 'button', className: 'cdt-example', onClick: copy },
        h('span', null, prompt),
        state !== null && h('span', { className: 'cdt-copyState', role: 'status' },
          state === 'copied' ? t('copied') : t('copyFailed')));
    }

    /** Main-area page: capability overview, copyable prompts, and connection facts. */
    function ChromeDevToolsPage({ t }) {
      return h('div', { className: 'cdt-page' },
        h(Styles),
        h('div', { className: 'cdt-inner' },
          h('div', { className: 'cdt-header' },
            h('span', { className: 'cdt-badge', 'aria-hidden': true }, h(PanelIcon, { size: 24 })),
            h('div', null,
              h('h1', { className: 'cdt-title' }, t('title')),
              h('p', { className: 'cdt-subtitle' }, t('subtitle')))),
          h('section', { className: 'cdt-section' },
            h('h2', { className: 'cdt-sectionTitle' }, t('examplesTitle')),
            h('p', { className: 'cdt-hint' }, t('examplesHint')),
            h('div', { className: 'cdt-examples' },
              h(ExampleRow, { t, prompt: t('examplePerf') }),
              h(ExampleRow, { t, prompt: t('exampleShot') }),
              h(ExampleRow, { t, prompt: t('exampleConsole') }),
              h(ExampleRow, { t, prompt: t('exampleAuto') }))),
          h('section', { className: 'cdt-section' },
            h('h2', { className: 'cdt-sectionTitle' }, t('toolsTitle')),
            h('ul', { className: 'cdt-list' },
              [t('toolPerf'), t('toolDebug'), t('toolAuto')].map(text =>
                h('li', { className: 'cdt-listItem', key: text },
                  h('span', { className: 'cdt-dot', 'aria-hidden': true }),
                  h('span', null, text))))),
          h('section', { className: 'cdt-section' },
            h('h2', { className: 'cdt-sectionTitle' }, t('connectionTitle')),
            h('dl', { className: 'cdt-facts' },
              h('dt', null, t('connServer')), h('dd', null, 'chrome-devtools'),
              h('dt', null, t('connTransport')), h('dd', null, 'stdio · npx chrome-devtools-mcp'),
              h('dt', null, t('connPrefix')), h('dd', null, 'mcp__chrome-devtools__*'),
              h('dt', null, t('connProxy')), h('dd', null, 'http://192.168.10.248:7897')),
            h('p', { className: 'cdt-note' }, t('note')))));
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'chrome-devtools: dictionaries');
        const t = ctx.locale.bind(NS);
        ctx.effect(() => ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 20,
          locale: NS,
          label: () => t('panel'),
        }, PanelIcon)), 'chrome-devtools: panellist entry');
        ctx.effect(() => ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main',
          key: PANEL_ID,
          locale: NS,
        }, ChromeDevToolsPage)), 'chrome-devtools: main page');
      },
    };
  },
});
