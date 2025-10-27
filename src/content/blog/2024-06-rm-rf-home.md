---
title: I ran "rm -rf ~" in production
description:
  How I accidentally nuked my home directory (and why I still don't regret DIY)
publishedDate: 2024-06
---

Earlier today, I was explaining to my dad why I don't pay for managed cloud
database services. "Why pay for infrastructure and backups when I can handle
that myself for free?" Famous last words.

So naturally, I decided to set up a backup script for a NoSQL database I've been
running. Using `rclone` seemed perfect for the job, and I quickly threw together
this script over my sluggish SSH connection:

```bash
#!/bin/bash

# Set up some variables
BACKUP_PATH="~/backups"
DATE=$(date +%Y-%m-%d-%H-%M)
BACKUP_NAME="backup-$DATE"
REMOTE_NAME="your-rclone-remote-name"
REMOTE_PATH="your-remote-path"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_PATH

# Dump the database to the backup directory
mongodump --out $BACKUP_PATH/$BACKUP_NAME

# Copy it over
rclone copy $BACKUP_PATH/$BACKUP_NAME $REMOTE_NAME:$REMOTE_PATH/$BACKUP_NAME
```

Here's where things went sideways. I forgot a crucial detail about bash:
`~/backups` doesn't expand to `/home/username/backups` when it's in quotes.
Instead, it creates a literal folder named `~` in the current directory.

When I ran the script to test it, sure enough:

```bash
$ ls
job.sh  ~
```

Without thinking, muscle memory kicked in. I saw that weird `~` folder and
instinctively typed:

```bash
rm -rf ~
```

The moment I hit enter, my stomach dropped. Even my dad noticed the look of
horror that crossed my face.

The damage was swift and thorough. My entire home directory -- gone. Thankfully,
the MongoDB data lives elsewhere on the system, so the database survived. But
everything else? Toast.

The immediate crisis: all my SSH keys in `~/.ssh` were wiped, and password
authentication was disabled on this server. I scrambled to generate new keys
using my still-active SSH session before getting locked out entirely.

Once I regained access, the cleanup began:

- Reconfigure all my dotfiles (`.bashrc`, etc.)
- Reinstall my web server (thankfully just a `git pull`)
- Reinstall Node.js since my setup lived in `~/.nvm`
- Verify my `systemd` services still worked
- Rewrite that backup script properly

The Node.js situation was particularly annoying. The `npm` and `node` commands
defaulted to Ubuntu's ancient system versions, but only when running through
systemd. I patched it with symlinks and PATH fixes—not elegant, but functional.

So was my dad right about using managed services? Maybe. But honestly, I'm glad
I went the DIY route and lived through this little adventure.

The real lesson here isn't about cloud vs. self-hosted—it's about being more
careful with destructive commands and maybe implementing proper system backups.
Also, it's probably time to move critical code out of the home directory and
into `/usr/local` where it belongs.

At least I've got a good story now.
