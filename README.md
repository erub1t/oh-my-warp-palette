# oh-my-warp-palette

[Warp](https://www.warp.dev/) 终端自定义主题仓库。

## 主题列表

- **GitHub Light** — 基于 GitHub 官方浅色配色。
- **GitHub Dark** — 基于 GitHub 官方深色配色。
- **GitHub Dark Dimmed** — GitHub 深色主题的柔和版本。

## 快速安装

克隆仓库后执行安装脚本，一键安装所有主题：

```bash
./install.sh
```

然后在 **Warp** → **设置** → **外观** → **主题** 中选择已安装的主题。

## 脚本用法

```bash
# 安装所有主题（默认）
./install.sh

# 只安装指定主题
./install.sh github-dark github-light

# 列出所有可用主题
./install.sh --list

# 卸载指定主题
./install.sh --uninstall github-light

# 查看帮助
./install.sh --help
```

## 远程安装（无需 Git Clone）

将仓库 push 到 GitHub 后，可以在任意机器上直接通过网络安装，不需要克隆仓库。

### 1. 配置脚本

打开 `install.sh`，修改文件顶部的默认仓库地址：

```bash
DEFAULT_REMOTE_REPO="YOUR_USERNAME/oh-my-warp-palette"
```

提交并 push。

### 2. 执行远程安装命令

将 `YOUR_USERNAME` 替换为你的 GitHub 用户名：

```bash
# 安装全部主题
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-warp-palette/main/install.sh | bash

# 只安装指定主题
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
```

> `bash -s -- github-dark` 是因为脚本通过管道传入 bash 执行，`-s` 表示从标准输入读取脚本，`--` 后面的参数会传给脚本。

### 通过环境变量覆盖仓库地址

如果你不想修改 `install.sh`，也可以直接通过环境变量指定：

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/oh-my-warp-palette/main/install.sh | REMOTE_REPO=YOUR_USERNAME/oh-my-warp-palette bash
```

## 手动安装

1. 克隆仓库：

   ```bash
   git clone https://github.com/your-username/oh-my-warp-palette.git
   cd oh-my-warp-palette
   ```

2. 将主题文件复制到 Warp 主题目录：

   ```bash
   mkdir -p ~/.warp/themes
   cp themes/*.yaml ~/.warp/themes/
   ```

3. 打开 **Warp** → **设置** → **外观** → **主题**，选择已安装的主题。

## 添加新主题

1. 在 `themes/` 目录下新建一个 `.yaml` 主题文件。
2. 将主题名称添加到 `install.sh` 中的 `BUILTIN_THEMES` 数组。
3. 参考 [Warp 主题规范](https://docs.warp.dev/appearance/custom-themes) 编写配置。
4. 提交 pull request。

## 许可证

MIT
