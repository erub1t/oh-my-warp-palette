# oh-my-warp-palette

[Warp](https://www.warp.dev/) 终端自定义主题仓库。

> 在线预览：进入 [`site/`](site/) 目录，执行 `npm install && npm run dev`，浏览器访问 Vite 输出的地址即可查看所有主题配色与终端效果。

## 主题列表

| 主题 | 描述 | 背景色 | 前景色 | 强调色 | 配置文件 |
|------|------|--------|--------|--------|----------|
| **April** | 清新的春日配色 | `#ffffff` | `#17703f` | `#5DA802` | [april.yaml](themes/april.yaml) |
| **Atom One Dark** | Atom 编辑器经典深色配色 | `#282c34` | `#abb2bf` | `#528bff` | [atom-one-dark.yaml](themes/atom-one-dark.yaml) |
| **Atom One Light** | Atom 编辑器经典浅色配色 | `#fafafa` | `#383a42` | `#526fff` | [atom-one-light.yaml](themes/atom-one-light.yaml) |
| **Ayu** | 基于 [ayutheme.com](https://ayutheme.com/) 官方配色（Dark 变体） | `#10141c` | `#bfbdb6` | `#e6b450` | [ayu.yaml](themes/ayu.yaml) |
| **Ayu Light** | 基于 [ayutheme.com](https://ayutheme.com/) 官方配色（Light 变体） | `#fcfcfc` | `#5c6166` | `#f29718` | [ayu-light.yaml](themes/ayu-light.yaml) |
| **Cocoa Cream** | 暖棕可可，柔和舒适的深色主题 | `#2b2624` | `#d6cfc8` | `#c8966d` | [cocoa-cream.yaml](themes/cocoa-cream.yaml) |
| **GitHub Dark** | 基于 GitHub 官方深色配色 | `#0d1117` | `#c9d1d9` | `#58a6ff` | [github-dark.yaml](themes/github-dark.yaml) |
| **GitHub Dark Dimmed** | GitHub 深色主题的柔和版本 | `#22272e` | `#adbac7` | `#539bf5` | [github-dark-dimmed.yaml](themes/github-dark-dimmed.yaml) |
| **GitHub Light** | 基于 GitHub 官方浅色配色（Colorblind 版本） | `#ffffff` | `#1f2328` | `#0969da` | [github-light.yaml](themes/github-light.yaml) |
| **Milk Tea** | 奶茶暖调，柔和易读的浅色主题 | `#faf6f0` | `#5c4d42` | `#b07d52` | [milk-tea.yaml](themes/milk-tea.yaml) |
| **Muted Forest** | 低饱和森林绿，护眼的深色主题 | `#232b28` | `#c5cbc4` | `#7da585` | [muted-forest.yaml](themes/muted-forest.yaml) |
| **Pastel Dawn** | 粉紫粉蓝渐变感，清新的浅色主题 | `#f7f4f9` | `#4a4458` | `#8b7ab8` | [pastel-dawn.yaml](themes/pastel-dawn.yaml) |
| **Twilight Slate** | 暮光蓝灰，沉稳柔和的深色主题 | `#252a33` | `#c9cdd4` | `#7a9bc4` | [twilight-slate.yaml](themes/twilight-slate.yaml) |

## npm CLI 安装（推荐跨平台）

如果你已安装 Node.js，可以直接使用 npx 运行，无需下载脚本：

```bash
npx --registry=https://registry.npmjs.org omwpcli install                 # 安装所有主题
npx --registry=https://registry.npmjs.org omwpcli install github-dark     # 仅安装指定主题
npx --registry=https://registry.npmjs.org omwpcli update github-dark      # 更新指定主题
npx --registry=https://registry.npmjs.org omwpcli uninstall github-light  # 卸载指定主题
npx --registry=https://registry.npmjs.org omwpcli list                    # 列出所有可用主题
npx --registry=https://registry.npmjs.org omwpcli help                    # 查看帮助
```

> 重复执行 `install` 或 `update` 会覆盖本地同名文件，因此也用于更新到最新版本。

## 安装

安装时会直接覆盖本地同名的主题文件，因此重复执行即可更新到最新版本。

### macOS / Linux

在终端执行以下命令即可一键安装所有主题：

```bash
curl -fsSL https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.sh | bash
```

只安装某个主题：

```bash
curl -fsSL https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
```

### Windows

在 **PowerShell** 中执行：

```powershell
irm https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.ps1 | iex
```

只安装某个主题：

```powershell
irm https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.ps1 -OutFile install.ps1
.\install.ps1 github-dark
```

> 如果执行策略限制脚本运行，可加上 `-ExecutionPolicy Bypass`：
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\install.ps1 github-dark
> ```

> Windows 下主题安装到 `%APPDATA%\warp\Warp\data\themes`，macOS / Linux 下为 `~/.warp/themes`。

安装完成后，打开 **Warp** → **Settings** → **Appearance** → **Theme**，选择已安装的主题。

## 卸载主题

### macOS / Linux

```bash
curl -fsSL -o /tmp/oh-my-warp-palette-install.sh https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.sh
bash /tmp/oh-my-warp-palette-install.sh --uninstall github-light
```

### Windows

```powershell
irm https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Uninstall github-light
```

## 添加新主题

1. 在 `themes/` 目录下新建一个 `.yaml` 主题文件。
2. 将主题名称添加到 `install.sh` 的 `BUILTIN_THEMES` 数组和 `install.ps1` 的 `$BuiltinThemes` 列表。
3. 参考 [Warp 主题规范](https://docs.warp.dev/appearance/custom-themes) 编写配置。
4. 提交 pull request。

## 许可证

MIT
