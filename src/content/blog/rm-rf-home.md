---
title: I ran "rm -rf ~" in production
description: How I accidentally deleted the home directory in production.
date: 2024-06-21
---

Earlier today I was telling my dad how I am not paying for cloud database services
that handle all the infrastructure and backup for you because I can just do those
things myself for free.
Then I proceeded to set up a script to do backups for a NoSQL database
I have been maintaining for a while now. `rclone` is a great tool for this,
so I quickly wrote up the following script with my lagging SSH connection
(comments added for folks without UNIX experience).

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

Now, mind me, I forgot about an important fact — "`~/backups`", while intended to stand for
"`/home/username/backups`", it just stands for a _relative_ "`~/backups`", which means a folder named "`~`"
will be created in the current directory. Indeed, as soon as I ran this script to test,
the following was the output for `ls`:

```bash
job.sh `~`
```

Out of reflex, I typed it in and pressed enter:

```bash
rm -rf ~
```

Oh, shit. It took me less than a second to realize what I did, but it was too late by then.

Even my dad sitting across the table noticed the look of surprise in my face.
Now, luckily, I just backed up my database, so even if it was deleted, I would have the data.
But MongoDB doesn't store the data in the home directory anyway. Shortly, I realized another
problem: all my SSH keys (located in "`~/.ssh`") are gone, and password-login is disabled for this server.
I quickly set up another set of keys using the existing connection.
Fortunately, it was not too much of a disaster otherwise:
- Configure my dotfiles ("`.bashrc`", etc.)
- Reinstall my web server that uses the database (a git pull)
- Reinstall NodeJS as my installation was in "`~/.nvm`"
- Make sure my `systemd` service is still good
- Rewrite the backup script without messing it all over again

The third step proved a bit tricky since my `npm` and `node` commands started to
refer to very old, default Ubuntu versions, but only when I used it in systemd,
so I hotfixed by adding softlinks and fixing PATH, but that should do the work for now.

So, should one use the services that make sure things don't go wrong? Maybe.
But I am glad I set things up myself to experience this little manevour.

The only way to prevent destruction like this is full system backups,
but being more cautious with deleting stuff helps too. Also, it's probably
around time I move some code off the home directory to put them in "`/usr/local`"
or something.