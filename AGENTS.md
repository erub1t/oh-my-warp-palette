# oh-my-warp-palette

> 本文件面向 AI 编码助手。如果你从未接触过该项目，请先阅读本文件。

## 项目概览

这是一个 [Warp](https://www.warp.dev/) 终端自定义主题仓库，主要包含主题定义文件、一个 Bash 安装脚本，以及一个可选的 npm CLI。

- **功能**：提供若干基于 GitHub 官方配色的 Warp 终端主题，并通过脚本一键安装到 Warp 的主题目录。
- **技术栈**：纯静态 YAML 文件 + Bash 脚本；同时提供一个可选的 npm CLI（`omwp`），作为 Bash/PowerShell 安装方式的补充，方便已安装 Node.js 的用户跨平台使用。
- **仓库结构**：
  ```
  .
  ├── README.md          # 面向用户的中文说明文档
  ├── install.sh         # 主题安装/卸载/列出的 Bash 脚本
  ├── install.ps1        # Windows PowerShell 安装脚本
  ├── package.json       # npm 包配置
  ├── bin/
  │   └── omwp.js        # npm CLI 入口
  └── themes/
      ├── april.yaml
      ├── github-dark.yaml
      ├── github-dark-dimmed.yaml
      └── github-light.yaml
  ```

### 主题文件

所有主题都存放在 `themes/` 目录下，文件名格式为 `<theme-name>.yaml`。每个文件遵循 [Warp 自定义主题规范](https://docs.warp.dev/appearance/custom-themes)，例如：

```yaml
accent: "#58a6ff"
background: "#0d1117"
details: darker
foreground: "#c9d1d9"
terminal_colors:
  bright:
    black: "#8b949e"
    red: "#ff7b72"
    ...
  normal:
    ...
cursor: "#58a6ff"
```

当前内置主题清单在 `install.sh` 的 `BUILTIN_THEMES` 数组中维护。

## 安装脚本说明

`install.sh` 是唯一的可执行文件，支持本地模式和远程模式。

### 本地模式（默认）

脚本与 `themes/` 目录在同一仓库中时，默认从 `./themes` 复制主题文件到 Warp 主题目录：

```bash
./install.sh                      # 安装全部主题
./install.sh github-dark          # 仅安装指定主题
./install.sh --list               # 列出可用主题
./install.sh --uninstall github-light  # 卸载指定主题
```

### 远程模式

当脚本独立下载执行（例如通过 `curl | bash`）且找不到本地 `themes/` 目录时，会自动从 GitHub 下载主题 YAML。远程仓库地址由 `install.sh` 顶部的 `DEFAULT_REMOTE_REPO` 变量或环境变量 `REMOTE_REPO` 指定。

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-warp-palette/main/install.sh | bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
```

> 远程安装前必须在 `install.sh` 中把 `DEFAULT_REMOTE_REPO` 改为实际的 `用户名/仓库名`，或传入 `REMOTE_REPO` 环境变量。

### 环境变量

- `WARP_THEMES_DIR`：目标主题目录，默认 `~/.warp/themes`。
- `REMOTE_REPO`：覆盖远程仓库地址，格式 `用户名/仓库名`。

## 构建与测试命令

本项目没有构建步骤，也没有自动化测试套件。

- **验证安装脚本语法**：
  ```bash
  bash -n install.sh
  ```
- **手动测试安装脚本**：
  ```bash
  # 使用临时目录测试，避免污染真实 Warp 配置
  WARP_THEMES_DIR=/tmp/warp-themes-test ./install.sh
  ```
- **验证主题文件语法**：
  ```bash
  # 如果已安装 yq
  yq eval themes/github-dark.yaml
  ```
- **ShellCheck 静态检查**（推荐，如果环境中已安装）：
  ```bash
  shellcheck install.sh
  ```

## 代码风格指南

### Bash 脚本

- 使用 `#!/usr/bin/env bash` 并启用严格模式：`set -euo pipefail`。
- 变量引用使用 `"$var"`，避免未引用导致的路径含空格问题。
- 函数内部优先使用 `local` 声明局部变量。
- 使用 `BUILTIN_THEMES` 数组集中维护内置主题清单。
- 新增主题时，除了向 `themes/` 添加 YAML 文件，还要同步更新 `BUILTIN_THEMES` 数组，否则脚本不会识别。

### 主题 YAML

- 文件名使用小写、短横线连接（kebab-case），例如 `github-dark-dimmed.yaml`。
- 颜色值使用双引号包裹的十六进制，例如 `"#0d1117"`。
- `details` 字段取值为 `darker` 或 `lighter`，应与背景色深浅保持一致。
- 保持 `accent`、`background`、`foreground`、`terminal_colors`、`cursor` 等 Warp 规范要求的字段完整。

## 测试说明

由于主题文件本质上是静态配置，测试以人工验证为主：

1. 执行安装脚本，确认 YAML 文件被正确复制到 `~/.warp/themes/`。
2. 打开 Warp → Settings → Appearance → Theme，检查新主题是否出现在列表中。
3. 选中主题，观察终端配色是否正常、对比度是否可接受。

若要对 `install.sh` 做回归检查，可在临时 `WARP_THEMES_DIR` 下运行以下场景：

```bash
WARP_THEMES_DIR=/tmp/warp-test ./install.sh --list
WARP_THEMES_DIR=/tmp/warp-test ./install.sh
WARP_THEMES_DIR=/tmp/warp-test ./install.sh --uninstall github-light
```

## 安全注意事项

- `install.sh` 支持通过 `curl | bash` 远程执行。修改脚本时必须警惕：
  - 不要引入未经验证的网络下载；
  - 不要覆盖 `WARP_THEMES_DIR` 以外的目录；
  - 不要提升权限或修改系统配置。
- 远程模式使用 GitHub raw URL 下载 YAML，下载前请确认 `REMOTE_REPO` 或 `DEFAULT_REMOTE_REPO` 指向可信仓库。
- 主题文件会被复制/下载到用户主目录下的 `~/.warp/themes/`，脚本不会修改 Warp 应用本身或其他敏感路径。
- 不要为主题 YAML 添加除颜色值以外的可执行内容；Warp 仅解析 YAML 字段。

## 贡献新主题

1. 在 `themes/` 下新建 `<theme-name>.yaml`。
2. 参考 [Warp 主题规范](https://docs.warp.dev/appearance/custom-themes) 编写配置。
3. 在 `install.sh` 的 `BUILTIN_THEMES` 数组末尾追加主题名称（与文件名一致，不含 `.yaml` 后缀）。
4. 在 `README.md` 的主题列表中补充新主题说明。
5. 使用临时 `WARP_THEMES_DIR` 运行安装脚本验证新主题可被正确安装。
6. npm CLI 会通过读取 `themes/` 目录自动发现新主题，无需在 `package.json` 或 CLI 代码中额外维护清单。
