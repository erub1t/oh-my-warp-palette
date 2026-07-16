# oh-my-warp-palette

[Warp](https://www.warp.dev/) 终端自定义主题仓库。

## 主题列表

| 主题 | 描述 | 背景色 | 前景色 | 强调色 | 配置文件 |
|------|------|--------|--------|--------|----------|
| **April** | 清新的春日配色 | `#ffffff` | `#17703f` | `#5DA802` | [april.yaml](themes/april.yaml) |
| **GitHub Light** | 基于 GitHub 官方浅色配色 | `#ffffff` | `#1f2328` | `#0969da` | [github-light.yaml](themes/github-light.yaml) |
| **GitHub Dark** | 基于 GitHub 官方深色配色 | `#0d1117` | `#c9d1d9` | `#58a6ff` | [github-dark.yaml](themes/github-dark.yaml) |
| **GitHub Dark Dimmed** | GitHub 深色主题的柔和版本 | `#22272e` | `#adbac7` | `#539bf5` | [github-dark-dimmed.yaml](themes/github-dark-dimmed.yaml) |

## 安装

### macOS / Linux

在终端执行以下命令即可一键安装所有主题：

```bash
curl -fsSL https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh | bash
```

只安装某个主题：

```bash
curl -fsSL https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
```

### Windows

在 **PowerShell** 中执行：

```powershell
irm https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.ps1 | iex
```

只安装某个主题：

```powershell
irm https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.ps1 -OutFile install.ps1
.\install.ps1 github-dark
```

> 如果执行策略限制脚本运行，可加上 `-ExecutionPolicy Bypass`：
> ```powershell
> powershell -ExecutionPolicy Bypass -File .\install.ps1 github-dark
> ```

安装完成后，打开 **Warp** → **Settings** → **Appearance** → **Theme**，选择已安装的主题。

## 卸载主题

### macOS / Linux

```bash
curl -fsSL -o /tmp/oh-my-warp-palette-install.sh https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh
bash /tmp/oh-my-warp-palette-install.sh --uninstall github-light
```

### Windows

```powershell
irm https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.ps1 -OutFile install.ps1
.\install.ps1 -Uninstall github-light
```

## 添加新主题

1. 在 `themes/` 目录下新建一个 `.yaml` 主题文件。
2. 将主题名称添加到 `install.sh` 中的 `BUILTIN_THEMES` 数组。
3. 参考 [Warp 主题规范](https://docs.warp.dev/appearance/custom-themes) 编写配置。
4. 提交 pull request。

## 许可证

MIT
