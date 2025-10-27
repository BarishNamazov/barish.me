---
layout: ../layouts/BlogLayout.astro
title: How I do my computing
description: My hardware and software setup.
updatedDate: 2025-10-27
---

I am very open to nontraditional ways to approach software and hardware while
focusing on [persistence](https://beyondexpiry.org/), privacy, security, and
transparency. To this end, I am doing my best to be platform-independent and use
open-source software. While some of my friends find my workflow rather
troublesome, I don't see myself adapting to a specific "ecosystem." This page is
a brief summary of my computing process, which is usually a large part of my
day. Some details are intentionally left out. If you are interested in more or
have suggestions, please reach out to me at hello@barish.me.

## Hardware

- **Desktop computer**: custom-built i7 14700F, RTX 4070 SUPER, 32GB DDR5
- **Laptop**: Asus Zenbook 14X (i7 13700H, 16GB LPDDR5, 2.8K OLED Touch), bought
  for $750
- **Phone**: Android with [GrapheneOS](https://grapheneos.org/) and
  [Olauncher](https://f-droid.org/packages/app.olauncher/)
- **Tablet**: Samsung tablet with a pen
- **Gaming console**: PlayStation 5
- **Headphones**: Sony WH-1000XM5
- **Mouse**: Glorious Model O 2 Mini Wireless
- **Keyboard**: Keychron V1 75% wired brown switches
- **Book reader**: Kindle Paperwhite

My first workstation was a HP laptop where I ran Ubuntu 12.04 LTS first.

## Computer Software

These are the software on my computer that I use almost every day. My
[dotfiles](https://github.com/BarishNamazov/dotfiles) are public for my computer
software configuration.

- **OS**: [Arch Linux](https://archlinux.org/)
- **Window Manager**: [Hyprland](https://hyprland.org/) with
  [Waybar](https://github.com/Alexays/Waybar)
- **Terminal**: [kitty](https://sw.kovidgoyal.net/kitty/)
- **Shell**: [bash](https://www.gnu.org/software/bash/)
- **Terminal Multiplexer**: [tmux](https://github.com/tmux/tmux)
- **Editor**: [Neovim](https://neovim.io/)
- **File Manager**: [yazi](https://github.com/sxyazi/yazi)
- **Browser**: [Mozilla Firefox](https://www.mozilla.org/firefox/) +
  [Vimium](https://vimium.github.io/) +
  [uBlock Origin](https://ublockorigin.com/)
- **Email Client**: [Betterbird](https://www.betterbird.eu/)

Frequently used software:

- [lazygit](https://github.com/jesseduffield/lazygit)
- [ripgrep](https://github.com/BurntSushi/ripgrep)
- [zoxide](https://github.com/ajeetdsouza/zoxide)
- [Syncthing](https://syncthing.net/)
- [OBS Studio](https://obsproject.com/)
- [VLC Media Player](https://www.videolan.org/vlc/)
- [Zotero](https://www.zotero.org/)

Less frequently used software:

- [Typst](https://typst.app/)
- [Ungoogled Chromium](https://ungoogled-software.github.io/ungoogled-chromium-binaries/)
- [Fragments](https://gitlab.gnome.org/World/Fragments)
- [Impression](https://gitlab.gnome.org/World/Impression)
- [Switcheroo](https://gitlab.gnome.org/World/Switcheroo)
- [rclone](https://rclone.org/)
- [ollama](https://ollama.com/)

## Emulation

- **PS2**: [AetherSX2](https://www.aethersx2.com/) on mobile and
  [PCSX2](https://pcsx2.net/) on computer. I have my own BIOS file from my
  PlayStation 2, obtained around 2007 as a gift.
- **PSP**: [PPSSPP](https://www.ppsspp.org/)

## Previously Used Software

Software that I don't use anymore, but that were useful in the past:

- [Ubuntu](https://ubuntu.com/) + [GNOME](https://www.gnome.org/)
- [Sublime Text](https://www.sublimetext.com/)
- [Code - OSS (Visual Studio Code)](https://github.com/microsoft/vscode)
- [Obsidian](https://obsidian.md/)
- [fish shell](https://fishshell.com/)

## Programming Languages / Technologies

These aren't a comprehensive list of my experience, but rather the tools I use
currently:

- **C++**: low-level or performance-critical software, competitive programming.
  - Compiler: C++23 with the [clang](https://clang.llvm.org/) compiler.
  - Linter/formatter: [clang-tidy](https://clang.llvm.org/extra/clang-tidy/) and
    [clang-format](https://clang.llvm.org/docs/ClangFormat.html).
  - Build systems: For larger projects, [Bazel](https://bazel.build/); for
    smaller ones, [CMake](https://cmake.org/).
- **Python**: scripting, data analysis, network programming.
  - Package manager: [uv](https://docs.astral.sh/uv/).
  - Linter/formatter: [ruff](https://docs.astral.sh/ruff/).
  - Data libraries: pandas, numpy, seaborn, plotly.
  - Networking libraries: aiohttp, asyncio, websockets.
- **JavaScript/TypeScript**: web development, full-stack applications
  - Runtime: [Bun](https://bun.sh/) where possible, otherwise Node.js.
  - Linter/formatter: [ESLint](https://eslint.org/) and
    [Prettier](https://prettier.io/).
  - Frontend framework: [Nuxt](https://nuxt.com/).
  - Backend framework: [Elysia](https://elysiajs.com/) or Nuxt/Nitro.
  - Database integration: [kysely](https://kysely.dev/).
- **Rust**: compilers, interpreters.
  - Crates: itertools, logos, pest.
