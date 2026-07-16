# oh-my-warp-palette

[Warp](https://www.warp.dev/) 终端自定义主题仓库。

## 主题列表

- **GitHub Light** — 基于 GitHub 官方浅色配色。
- **GitHub Dark** — 基于 GitHub 官方深色配色。
- **GitHub Dark Dimmed** — GitHub 深色主题的柔和版本。

## 安装

在终端执行以下命令即可一键安装所有主题：

```bash
curl -fsSL https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh | bash
```

安装完成后，打开 **Warp** → **设置** → **外观** → **主题**，选择已安装的主题。

## 安装指定主题

只安装某个主题时，需要在命令末尾加上主题名：

```bash
curl -fsSL https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
```

> `bash -s -- github-dark` 是因为脚本通过管道传入 bash 执行，`-s` 表示从标准输入读取脚本，`--` 后面的参数会传给脚本。

## 卸载主题

如需卸载某个主题，可先用 `curl` 下载脚本，再执行卸载：

```bash
curl -fsSL -o /tmp/oh-my-warp-palette-install.sh https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.sh
bash /tmp/oh-my-warp-palette-install.sh --uninstall github-light
```

## 添加新主题

1. 在 `themes/` 目录下新建一个 `.yaml` 主题文件。
2. 将主题名称添加到 `install.sh` 中的 `BUILTIN_THEMES` 数组。
3. 参考 [Warp 主题规范](https://docs.warp.dev/appearance/custom-themes) 编写配置。
4. 提交 pull request。

## 许可证

MIT
