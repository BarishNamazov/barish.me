---
title: How I do my computing
description: My hardware and software setup.
date: 2024-07-01
updatedDate: 2024-08-24
star: true
---

I am very open to nontraditional ways to approach software and hardware while focusing on [persistence](https://beyondexpiry.org/), privacy, security, and transparency. To this end, I am doing my best to be platform-independent and use open-source software. While some of my friends find my workflow rather troublesome, I don't see myself adapting to a specific "ecosystem." This page is a brief summary of my computing process, which is a large part of my day. Some details are intentionally left out. If you are interested in more or have suggestions, please reach out to me at hello@barish.me.

## Computer Hardware

My current main workstation is a desktop computer I built in June 2024 with i7 14700F CPU and RTX 4070 SUPER GPU.
I use it for both development and gaming. The GPU also allows me to run a local open-source LLM.

My secondary workstation is a laptop, Asus Zenbook 14X (2.8K OLED Touch 120Hz Display, 16GB LPDDR5 RAM, i7 13700H, no dedicated GPU, 3.5 lbs). While I wish my laptop was upgradable (like [Framework](https://frame.work/), [Tuxedo](https://www.tuxedocomputers.com/), or [System76](https://system76.com/) laptops), it's harder to find those options within budget while maintaining my needs. I bought this laptop from [BestBuy](https://www.bestbuy.com/site/asus-zenbook-14x-14-5-2-8k-oled-touch-laptop-intel-evo-platform-i7-13700h-16gb-memory-512gb-ssd-inkwell-gray/6543526.p?skuId=6543526) for $750, which I think was a decent value for the display and performance on a new laptop. What I generally look in a laptop is, in that order, great display, cpu power, and battery life. However, lately, I have been finding 16GB RAM not enough for some use cases, so it's a pity that RAM is soldered on this machine.

Previously, I owned an Asus Zenbook UX534FTC with 4K Display and a discrete GPU. It was a good laptop, but CPU was not powerful enough and the battery life was terrible. I mostly ran Ubuntu on that machine but had a Windows dual boot for gaming purposes.

Before that, my machine was an older HP laptop for many years. I ran Ubuntu on it.

## Computer Software

These are the software on my computer that I use almost every day.

### Arch Linux

I switched to Arch in late 2023 from Ubuntu. Overall, it's great.
I am not as linux savvy as some of my friends but it's great to have a lot of control over my software.
[ArchWiki](https://wiki.archlinux.org/) is also one of the best wikis I have seen.
Btw, I use arch.

### GNOME

I have not used other display managers much given that I started off with Ubuntu. I find GNOME with GTK 4 clean and very customizable. I have these extensions installed:

- [Blur my Shell](https://github.com/aunetx/blur-my-shell) for nicer view
- [Clipboard Indicator](https://github.com/Tudmotu/gnome-shell-extension-clipboard-indicator) for a nice history for copied text and media
- [Dash to Dock](https://micheleg.github.io/dash-to-dock/) for more real screen estate
- [GSConnect](https://github.com/GSConnect/gnome-shell-extension-gsconnect/wiki) for [KDE Connect](https://userbase.kde.org/KDEConnect) integration with my mobile device

From the [built-in extensions](https://gitlab.gnome.org/GNOME/gnome-shell-extensions), I have Removable Drive Menu and System Monitor enabled. I like seeing how much usage is happening with my CPU, RAM, and network.

I used [Black Box](https://gitlab.gnome.org/raggesilver/blackbox) terminal for better GTK 4 integration for a while, but now that it has stopped development I am back to using GNOME Console app.

### Fish Shell

[Fish Shell](https://fishshell.com/) is great and easy to use even with its defaults. Unfortunately, themes don't work on my machine, which might be due to GTK forced styles.

### Mozilla Firefox

I would not use any other browser as my daily driver for many reasons. I enjoy [Firefox](https://www.mozilla.org/en-US/firefox/new/) but still have a lot of criticism for it. These extensions make my life easier:

- [Sidebery](https://github.com/mbnuqw/sidebery) for vertical tab management
- [Bitwarden](https://bitwarden.com/) for managing passwords
- [uBlock Origin](https://github.com/gorhill/uBlock#ublock-origin) for avoiding ads and trackers
- [Vimium](https://github.com/philc/vimium) for faster navigation
- [Tampermonkey](https://www.tampermonkey.net/) for custom scripting
- [Stylus](https://add0n.com/stylus.html) for custom styling certain websites
- [Video Speed Controller](https://github.com/codebicycle/videospeed) for easily changing video speed
- [Enhancer for Youtube](https://www.mrfdev.com/enhancer-for-youtube) for better and less distracting Youtube experience
- [CanvasBlocker](https://github.com/kkapsner/CanvasBlocker/), [Don't track me Google](https://github.com/Rob--W/dont-track-me-google), and [Facebook Container](https://github.com/mozilla/contain-facebook) for keeping it safer over the web
  While this list is larger than I would hope for, each of these extensions are essential for my specific use cases. The list does not include development extensions like [Vue.js Devtools](https://devtools.vuejs.org/) since I keep them disabled unless I need to debug.

### Betterbird (Thunderbird)

I used [Thunderbird](https://www.thunderbird.net/en-US/) for a while after being fed up with web email clients (Gmail, Outlook, etc.) and their slowness.
Then I switched to [Betterbird](https://www.betterbird.eu/) simply because it allowed me better defaults and settings.

### Code - OSS (Visual Studio Code)

[VSCode](https://wiki.archlinux.org/title/Visual_Studio_Code) is great for most development with its extensions ecosystem. I find it somewhat buggy when I have multiple projects open as it starts lagging extremely. While I haven't found a solution for this bug, I have some small remedies.
I am only going to share use case agnostic extensions I use:

- [Git Graph](https://github.com/mhutchie/vscode-git-graph) for nicely viewing commit history and branches
- [Remote - SSH](https://github.com/Microsoft/vscode-remote-release?tab=readme-ov-file) for opening remote files and directories
- [vscode-pdf](https://github.com/tomoki1207/vscode-pdfviewer) for viewing PDF files
- [Word Counter](https://gitlab.com/LudwigNeste/vscode-word-counter) for having a nice word count
- [Vim](https://github.com/VSCodeVim/Vim) for Vim motions

### NeoVim

As of 2024 August, I have switched good amount of my development into [Neovim](https://neovim.io/). I am planning to deprecate Code OSS (VSCode) soon, as I figure out more configurations for Neovim for specific use cases.

### Obsidian

I started using [Obsidian](https://obsidian.md/) on May 2024 to do journaling and taking notes.
In fact, this page was first written in Obsidian.
It saddens me that such great piece of engineering is not open-source.

### Syncthing

[Syncthing](https://syncthing.net/) is to sync files and directories between devices and they have great focus on security and privacy. I am also using it to set up Obsidian sync between my devices. Previously, I used Dropbox to sync, but I was already not a fan having personal files on the cloud (i.e., someone else's computer).

### z

I jump around using [z](https://github.com/rupa/z). I use the [fish port](https://github.com/jethrokuan/z).

### Discord

I use Discord for non-critical communication with friends.
I wish there was a better alternative, but it works mostly fine.

## Non-daily Computer Software

I don't use these software every day, but they regularly come in very handy.

### Typst

[Typst](https://typst.app/) is a great LaTeX and Overleaf alternative.
It has great syntax and very fast compilation times thanks to Rust.
I have been using LaTeX for over 5 years now and still have no idea how to do certain styling things,
but only a few months of Typst was enough to learn much more.
Unfortunately, most academic conferences still require LaTeX templates.

### Ungoogled Chromium

[Ungoogled Chromium](https://github.com/ungoogled-software/ungoogled-chromium) is bloatless and trackerless chromium browser.
It's useful because some websites only work on chromium-based browsers.
I also like to test my websites on chromium-based browsers before deploying to make sure everything works.

### Fragments

[Fragments](https://apps.gnome.org/Fragments/) is a nice and simple BitTorrent client. For its simplicity, I prefer it over other clients like [qBitTorrent](https://www.qbittorrent.org/).

### Impression

[Impression](https://apps.gnome.org/Impression/) is a simple and effective drive flasher.

### Switcheroo

[Switcheroo](https://apps.gnome.org/Converter/) (formerly Converter) is a beautiful imagemagick GUI to convert between different media types.

### Foliate

[Foliate](https://johnfactotum.github.io/foliate/****) is a very nice book reader that supports most electronic book formats.

### ripgrep

From its description: [ripgrep](https://github.com/BurntSushi/ripgrep) recursively searches directories for a regex pattern while respecting your gitignore.

### VLC Media Player

[VLC](https://www.videolan.org/) will play any kind of video without angry encoding errors and provide nice control for any video elements like audio, subtitles, and aspect ratio.

### Pinta

[Pinta](https://www.pinta-project.com/) is a Microsoft Paint like tool for Linux. It's not great, but it's easier than GIMP.

### OBS Studio

[Open Broadcaster Software](https://obsproject.com/) is the only correct way to record or stream large videos. For screenshots and mini recordings, I use GNOME's built-in screen recorder.

### Rclone

[Rclone](https://rclone.org/) is a great tool to sync files between cloud services.
I use it to sync my files between my cloud storage and my local machine.
I also use it to backup my databases to a cloud service.

### Ollama

[Ollama](https://www.ollama.com/) allows me to run a local LLM very easily.
I use it for various purposes.

## Mobile Hardware

For security purposes, I will not share my current phone model. My phone history is:

- 2020 to 2023: [Xiaomi Mi 9T Pro](https://www.gsmarena.com/xiaomi_mi_9t_pro-9791.php)
- 2013 to 2020: [Samsung Galaxy Note 3](https://www.gsmarena.com/samsung_galaxy_note_3-5665.php)
- 20?? to 2013: [Samsung Galaxy S III](https://www.gsmarena.com/samsung_i9300_galaxy_s_iii-4238.php)
- 20?? to 20??: [Samsung Galaxy Gio](https://www.gsmarena.com/samsung_galaxy_gio_s5660-3741.php)

All my previous phones were "[rooted](https://www.androidauthority.com/what-is-rooted-phone-3338226/)". I do not root my phone anymore since it blocks usage of some banking apps and makes the phone much more vulnerable. I still own my old Galaxy Note 3 somewhere but do not use it. If I remember correctly, it's running Android 12 with [Lineage OS](https://lineageos.org/).

MIT provided me with an Ipad Air in 2020. While I used to use it with Apple Pencil to take notes, I stopped completely using it around 2022. I have not used any other Apple devices other than this tablet. In May 2024, I got my own Android tablet to read books and consume media.

## Mobile Software

For security purposes, I am not going to share what mobile apps I own. However, given a powerful processor on my current phone, I sometimes emulate PlayStation 2 games via [AetherSX2](https://aethersx2.gitlab.io/) and PlayStation Portable games via [PPSSPP](https://www.ppsspp.org/). I use my [own bios file](https://pcsx2.net/docs/setup/gather/) from my PlayStation 2, obtained around 2007 as a gift.

## Gaming

In addition to my desktop computer, I own a PlayStation 5, obtained in Summer 2023.
Before my computer, I had a PS Plus subscription, but I stopped paying for it since I don't play on my console anymore.
In earlier years, I played games on my laptop(s). Additionally, I was an avid PlayStation 2 player from 2007 to 2012. Avid here refers to more than 1,000 physical game CDs over those years. A few games I recently play:

- [Celeste](<https://en.wikipedia.org/wiki/Celeste_(video_game)>)
- [Dave the Diver](https://en.wikipedia.org/wiki/Dave_the_Diver)
- [Super Smash Bros.](https://en.wikipedia.org/wiki/Super_Smash_Bros.) with friends

I sometimes notice videos from [Mind Pulp](https://www.youtube.com/@MindPulp) where PS 2 nostalgia hits home. I am also fan of speedrunning community for their determination and hacking skills, and I enjoy watching [Summoning Salt](https://www.youtube.com/@SummoningSalt) videos.

## "Deprecated" Software

Most of these software probably did not actually get deprecated, but I stopped using them for good reasons. They were useful enough that it's worth mentioning them. It was not easy remembering this list and it probably still is missing some software.

### Dropbox

I used Dropbox to sync files between my computers and mobile devices, in addition to them existing on the cloud if I have no access to these devices. Now I use Syncthing for it, and I'm planning to self-host an encrypted server to store my data and have it open online via authentication for me to access remotely.

### Sublime Text

Sublime Text is a nice editor and it's faster than VSCode when working with large amounts of files. However, it's not open source and my use cases for it has not been extensive.

### Ubuntu

I have used Ubuntu for a long time, but it has never been properly stable. Aptitude, snaps, bad GPU integration, etc has caused me to move on.