# dsh-chrome-devtools

[English](#english) · 简体中文

把 **Chrome DevTools for agents**（[`chrome-devtools-mcp`](https://github.com/ChromeDevTools/chrome-devtools-mcp)）集成进 **DeepSeek Harness (dsh)** 的插件包：一条 MCP 连接让智能体获得完整的 Chrome 调试与自动化工具，一个左侧栏入口提供带使用示例的面板页。

## 功能

- **MCP 连接（Host 侧）**：通过 `@deepseek-ai/dsh-mcp-client` 以 stdio 方式启动 `npx -y chrome-devtools-mcp@latest`，智能体获得全套 `mcp__chrome-devtools__*` 工具：
  - 性能：录制 trace、提取可执行的优化建议
  - 调试：截图、控制台消息（含 source map 堆栈）、网络请求检查
  - 自动化：导航、点击、输入，自动等待操作结果
  - 还有 Lighthouse 审计、设备模拟、Cookie 调试等完整 DevTools 能力
- **左侧栏入口（Client 侧）**：向 `sidebar.panellist` 注册 Chrome DevTools 图标，点击后在主区打开同 id 的面板页（`main` keyed slot），包含：
  - 4 条可点击复制的示例提示词（性能分析 / 截图 / 控制台 / 自动化）
  - 能力清单与连接信息（serverName、transport、工具前缀、代理地址）
  - 中英双语（跟随 dsh 的界面语言），样式全部使用宿主主题 token（`--dsw-alias-*`），自动适配明暗主题
- **代理支持**：MCP 子进程可注入 `HTTP_PROXY`/`HTTPS_PROXY`（npx 拉包用），并设置 `NO_PROXY=localhost,127.0.0.1` 保证本机 Chrome 的 CDP 连接不走代理。

## 安装

### 要求

- Node.js LTS（含 `npx`）
- Chrome 稳定版或更新版本
- dsh Web（Harness）运行中

### 方式一：克隆后本地安装（推荐）

```bash
git clone https://github.com/lihe6666/dsh-chrome-devtools.git
```

然后在 dsh Web 界面中打开 **Settings → Plugins**（设置 → 插件），选择从目录安装，指向克隆下来的 `dsh-chrome-devtools` 目录；或使用 `plugin_manager` 的 `install_bundle` 安装该目录。安装完成后插件立即生效（无需重启）。

### 方式二：直接使用 zip

下载仓库中的 [`dsh-chrome-devtools-v1.0.0.zip`](./dsh-chrome-devtools-v1.0.0.zip)，解压到任意目录，再按方式一从目录安装。

安装后：
- 智能体工具列表中出现 `mcp__chrome-devtools__navigate_page`、`take_screenshot`、`performance_start_trace` 等全套工具；
- 左侧栏出现 **Chrome DevTools** 入口。

> 首次调用浏览器工具时，`chrome-devtools-mcp` 会自动启动 Chrome（连接本身不会启动浏览器）。

## 使用

在任意会话中直接下达浏览器任务，例如：

```
检查 https://developers.chrome.com 的性能
```

```
打开 https://example.com 并截图
```

```
打开 https://example.com 并列出控制台报错
```

也可以点击左侧栏的 Chrome DevTools 入口，在面板页里点击示例提示词一键复制。

## 配置

插件的 MCP 行在 `cordis.patch.yml` 中，常见调整：

```yaml
- id: chrome-devtools-mcp
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: chrome-devtools          # 工具前缀 mcp__<serverName>__*
    transport: stdio
    command: npx
    args: ['-y', 'chrome-devtools-mcp@latest', '--no-usage-statistics']
    env:
      HTTP_PROXY: http://192.168.10.248:7897    # 换成你的代理，或删掉这两行
      HTTPS_PROXY: http://192.168.10.248:7897
      NO_PROXY: localhost,127.0.0.1,::1         # 本机 CDP 连接绝不能走代理
      CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS: '1'
    toolCallTimeoutMs: 180000            # 性能 trace 需要较长时间
    failOnStartupError: false            # Chrome 缺失时不阻塞 profile 启动
```

更多服务器参数（`--headless`、`--isolated`、连接已运行的 Chrome 等）见 [chrome-devtools-mcp 配置指南](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md)。

### 无代理环境

把 `env` 里的 `HTTP_PROXY`/`HTTPS_PROXY` 两行删除即可；`npx` 会直连 npm registry。

## 文件结构

```
dsh-chrome-devtools/
├── package.json        # bundle 清单：dsh.bundle.patch + dsh.client（web 平台 Client 模块）
├── cordis.patch.yml    # 插入两条 plugin 行：MCP 连接 + UI 插件
├── index.js            # Host 半部（空 apply；渲染全部在 Client 模块）
├── client.js           # Client 模块：sidebar.panellist 入口 + main 面板页（纯 JS，无需构建）
├── icon.svg            # 插件图标（浏览器窗口 + 代码括号）
└── locale/
    ├── en.json         # Plugin Manager 元数据（en）
    └── zh.json         # Plugin Manager 元数据（zh）
```

Client 内的界面文案字典（en/zh 各 21 键）内置于 `client.js`，随 dsh 的 locale 服务自动切换。

## 卸载

在 **Settings → Plugins** 中移除 `@local/chrome-devtools` bundle 即可；左侧栏入口、面板页与 MCP 工具会一并消失。

## 注意事项

- `chrome-devtools-mcp` 会把浏览器中的全部内容暴露给 MCP 客户端，请避免在其中打开敏感页面。
- 官方仅支持 Google Chrome 与 Chrome for Testing。
- 使用统计默认开启；本插件已在启动参数中传入 `--no-usage-statistics` 并关闭更新检查。

## License

MIT

---

# English

A **DeepSeek Harness (dsh)** bundle that integrates [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp): an MCP connection that gives the agent the full Chrome DevTools toolset, plus a left-sidebar entry opening a panel page with copyable example prompts.

## Features

- **MCP connection (Host)**: spawns `npx -y chrome-devtools-mcp@latest` over stdio via `@deepseek-ai/dsh-mcp-client`; the agent gets every `mcp__chrome-devtools__*` tool — performance traces, screenshots, console & network inspection, reliable page automation, Lighthouse audits, and more.
- **Sidebar entry (Client)**: registers a Chrome DevTools icon into `sidebar.panellist`; clicking it opens a matching `main` panel page with 4 copyable example prompts, a capability list, and connection facts. Bilingual (en/zh), themed with host tokens (`--dsw-alias-*`), light/dark aware.
- **Proxy support**: the MCP child process can carry `HTTP_PROXY`/`HTTPS_PROXY` for package download while `NO_PROXY=localhost,127.0.0.1` keeps the local CDP connection direct.

## Install

Requirements: Node.js LTS (with `npx`), current stable Chrome, a running dsh Web.

```bash
git clone https://github.com/lihe6666/dsh-chrome-devtools.git
```

Then install the cloned directory as a bundle from **Settings → Plugins** in dsh Web (or via `plugin_manager` `install_bundle`). Takes effect immediately. Alternatively download [`dsh-chrome-devtools-v1.0.0.zip`](./dsh-chrome-devtools-v1.0.0.zip), unzip, and install the directory.

## Usage

Just ask in any session:

```
Check the performance of https://developers.chrome.com
```

Chrome starts automatically on the first browser-tool call. The sidebar panel offers more copyable prompts.

## Configuration

Edit `cordis.patch.yml` to change the proxy, add server flags (`--headless`, `--isolated`, connect to a running Chrome, … — see the [configuration guide](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md)), or adjust `toolCallTimeoutMs`. Remove the `HTTP_PROXY`/`HTTPS_PROXY` lines for direct npm access.

## Uninstall

Remove the `@local/chrome-devtools` bundle from **Settings → Plugins**; the sidebar entry, panel page, and MCP tools all disappear with it.

## Note

`chrome-devtools-mcp` exposes the browser's full content to MCP clients — avoid sensitive pages. Only Google Chrome and Chrome for Testing are officially supported.

## License

MIT
