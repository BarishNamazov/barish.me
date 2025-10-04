---
title: "Linguistics of Package Managers (Part 1): CLI"
description:
  Package managers use different words for identical operations, or the same
  words for different operations, revealing competing philosophies about whether
  commands should prioritize discoverability or composition. These syntactic
  choices encode deeper assumptions about users, workflows, trust, and what
  operations deserve their own vocabulary.
date: 2025-10-04
---

I was recently teaching a middle schooler how to use Linux when I got struck by
a question I'd never asked myself: why do package managers all speak different
languages?

On Arch, I type `pacman -S` to install software. In Python, it's `pip install`.
For JavaScript, `npm install` or `bun add`. They all fetch software and resolve
dependencies, but they also usually provide ways to remove software, update it,
search for packages. Each expresses these operations in its own dialect.

This fragmentation isn't unique to command-line tools. iPhones have an App Store
with a "Get" button. Android uses Google Play with "Install". Windows has
shifted from downloading .exe files where you clicked "Next" through
installation wizards to a Microsoft Store with "Get" or "Install" buttons. macOS
went from drag-and-drop DMG files to the Mac App Store's "Get" button. Even the
old "Next, Next, Finish" installers were a kind of language, one that asked
users to make decisions about installation paths and desktop shortcuts before
the software would run (it is a topic of another blog post whether getting rid
of those configuration options was a good idea).

While the command-line and graphical interfaces share a common goal, their
interaction patterns shape the linguistics: verbs become buttons, status
messages become animations, and flags and arguments turn into menus and
checkboxes. That is why I decided to separate this exploration into multiple
parts, and in this first part, I will share about command-line package managers.

## The core linguistic split: verbs versus flags

Package managers divide fundamentally between explicit verb commands and
composable flags. This split shapes everything else.

**apt, dnf, and zypper use explicit verbs**. `apt install`, `apt remove`,
`apt search`, `apt update`, `apt upgrade`. Each command self-documents. There
are no shorthands: `apt i` does not work. New users guess functionality without
consulting manuals.

**pacman uses single-letter flags**. Upper-case letters are commands. `-S` syncs
from repositories, `-R` removes packages, `-Q` queries the local database, `-U`
upgrades from local files. Lower-case letters define options, `-y` refreshes the
databases, `-u` upgrades packages. These flags combine: `-Syu` means "sync
database, refresh, upgrade system" atomically. pacman does support long-form
input like `--sync --refresh --sysupgrade`. It is hard to guess commands without
[help](https://wiki.archlinux.org/title/Pacman).

**PowerShell takes verb-noun explicitness to the extreme**. `Install-Package`,
`Update-Package`, `Find-Package`, `Uninstall-Package`. The cmdlet structure
requires full words separated by hyphens.

**Homebrew bridges both approaches**. Basic operations use verbs:
`brew install`, `brew uninstall`, `brew search`. But flags add functionality:
`brew install --cask` for GUI applications, `brew list --versions` for version
tracking.

**Language-specific managers mostly follow the verb pattern**. `npm install`,
`pip install`, `cargo install`, `gem install` all use explicit verbs. The
consistency reduces cognitive load when developers switch between ecosystems.
Some differ: `go get` in Go, `composer require` in PHP.

> ### Summary
>
> Package managers split into two design philosophies: verb-first commands and
> flag-driven syntax. Verb-first tools (apt, dnf, zypper, npm, pip) prioritize
> discoverability. Commands read like natural language and new users can guess
> functionality without documentation. Flag-driven tools like pacman optimize
> for composition and efficiency. Terse, scriptable commands that combine into
> atomic operations. PowerShell takes verb-noun structure to its logical
> extreme, achieving formalism without necessarily improving comprehension.
> Homebrew combines both approaches, using verbs for core operations while
> adding flags for extended functionality.
>
> This linguistic divide reflects fundamental assumptions about users and
> workflows. Verb-first design assumes commands should be self-documenting and
> readable. Flag-driven design assumes users will learn the grammar once, then
> benefit from its compactness indefinitely.

## update versus upgrade: enforced awareness

Package managers perform three related operations: refreshing metadata about
available packages, checking what needs upgrading, and actually performing
upgrades. Different managers combine or separate these with confusing
terminology.

The behaviors here slightly diverge between the OS package managers and
language-specific ones given slightly different requirements. In OS package
managers, as long as dependencies are satisfied, the latest version of a package
is usually desired. In language-specific managers, version constraints in
project files (e.g., `package.json`, `requirements.txt`, or `Cargo.toml`) must
be respected, so "latest" is not always the goal. The developers usually pin
versions explicitly, and the package manager must adhere to those constraints.

### OS Package Managers

**apt separates metadata refresh from upgrades**:

- `apt update` refreshes the package database. Updates apt's knowledge of
  available versions, but changes nothing on your system.
- `apt list --upgradable` shows which packages have newer versions available.
- `apt upgrade` installs the newer versions.

Users must run `apt update` before `apt upgrade` sees new versions. The two-step
process enforces explicit acknowledgment of available updates.

**pacman uses composable flags**:

- `pacman -Sy` refreshes package databases (equivalent to `apt update`).
- `pacman -Qu` lists upgradable packages (equivalent to
  `apt list --upgradable`).
- `pacman -Su` performs the upgrade (equivalent to `apt upgrade`).
- `pacman -Syu` does all three atomically: refresh, check, and upgrade in one
  command.

**DNF combines operations automatically**:

- `dnf check-update` refreshes metadata and lists available updates.
- `dnf upgrade` (or `dnf update`) refreshes metadata and installs updates in one
  command.

DNF has no separate command to only refresh metadata. Both operations refresh
automatically, eliminating the two-step pattern.

**Homebrew uses three distinct verbs**:

- `brew update` refreshes available formulae (equivalent to `apt update` or
  `pacman -Sy`).
- `brew outdated` shows packages with available updates (equivalent to
  `apt list --upgradable` or `pacman -Qu`).
- `brew upgrade` installs updates (equivalent to `apt upgrade` or `pacman -Su`).

### Language-specific Package Managers

Language-specific managers avoid "upgrade" terminology as "update" or "install"
automatically refresh metadata and install updates within version constraints.
In addition, they also provide the "outdated" command, similar to brew.

**npm (Node.js)**

- `npm outdated` lists packages with newer versions available.
- `npm update` installs the latest versions **within existing semver ranges**;
  updates lockfile and node_modules.
- To go beyond ranges: `npm install <pkg>@latest` (or rewrite ranges with
  `npx npm-check-updates -u`, then `npm install`).

**pip (Python)**

- `pip list --outdated` shows available upgrades for the current environment.
- `pip install -U <package>` upgrades a specific package.
- No built-in "upgrade all." Pin with `requirements.txt`; refresh pins via
  `pip-compile --upgrade` then `pip-sync` (pip-tools). Use a virtualenv.

**cargo (Rust)**

- `cargo outdated` (plugin) lists newer dependency versions.
- `cargo update` updates `Cargo.lock` **within constraints** in `Cargo.toml`; it
  does not edit `Cargo.toml`.
- To raise versions: edit `Cargo.toml` (or `cargo add <crate>@latest`), then run
  `cargo update`.

**gem / Bundler (Ruby)**

- `gem outdated` lists newer gems.
- `gem update` upgrades installed gems (or `gem update <gem>`).
- For projects, prefer Bundler: `bundle update` updates `Gemfile.lock` within
  `Gemfile` constraints; `bundle install` applies the lockfile.

All of these implicitly refresh registry metadata. The key difference is _what
changes_: installed artifacts, the lockfile, and/or the declared version
constraints.

> ### Summary
>
> The linguistic problem: "update" means "refresh metadata" in apt and Homebrew,
> but in common English sounds like it should mean "install updates." Users
> frequently type `apt upgrade` without first running `apt update`, expecting to
> see new versions that apt doesn't know about yet. DNF avoids this by making
> `upgrade` do both operations.
>
> Language-specific managers, on the other hand, don't use "upgrade" at all.
> They use "update" or "install" to refresh metadata and install new versions.
> However, they have to respect version constraints, so "update" often means
> "update within constraints" rather than "install the latest version." While
> some languages allow you to change versions via commands, some require manual
> edits to the version specification files.
>
> All managers have the same architectural requirement: databases must refresh
> before the system knows which packages need upgrading. apt and Homebrew expose
> this as separate commands. pacman exposes them as flags users typically
> combine. DNF and language-specific managers hide it entirely.

## remove versus purge: degrees of deletion

Package removal involves several distinct operations: removing binaries and
libraries, handling configuration files, dealing with user data, removing
orphaned dependencies, and cleaning up caches. The complexity of removal
naturally varies between system package managers and language-specific ones.

System packages often install configuration files (in `/etc/` or `~/.config` or
`/Library`) that users might want to preserve across reinstalls. They may have
been automatically installed as dependencies. Language-specific packages
typically store configuration in visible project files (`package.json`,
`requirements.txt`, `Cargo.toml`) that live in version control, eliminating the
need for system-wide configuration preservation.

Dependencies fall into two categories: those explicitly installed by the user,
and those automatically installed to satisfy requirements. Cached package files
accumulate in various locations depending on the package manager.

**apt distinguishes between partial and complete removal**:

- `apt remove` deletes the package but preserves configuration files in `/etc`.
  Reinstalling later restores previous settings.
- `apt purge` deletes both package and configuration files. Complete removal.
- `apt autoremove` removes packages that were installed as dependencies but are
  no longer needed.

The word "purge" carries connotations of thorough cleansing beyond mere
deletion.

**pacman provides granular control through composable flags**:

- `pacman -R` removes the package but saves configuration backups as `.pacsave`
  files.
- `pacman -Rn` removes package without saving configuration backups. The `n`
  flag is `--nosave`.
- `pacman -Rs` removes package and its unneeded dependencies.
- `pacman -Rc` removes package and packages that depend on it (cascade removal).
- `pacman -Rns` combines multiple operations: remove package, don't save
  configs, remove unneeded dependencies.
- `pacman -Rcns` combines all: cascade removal, don't save configs, remove
  unneeded dependencies. A common pattern for complete cleanup.

**DNF and zypper follow apt's pattern**, but provide no purging option.
Configuration files remain after removal and need to be manually deleted.

**Homebrew has minimal removal semantics**:

- `brew uninstall` removes the package.
- `brew autoremove` removes orphaned dependencies.
- Configuration files in `/usr/local/etc/` or `~/Library/` persist. No tracking
  or automatic removal.

**Language-specific managers typically lack this distinction**:

- `npm uninstall` removes packages from `node_modules` and `package.json`, and
  updates `package-lock.json`.
- `pip uninstall` removes packages from the Python environment.
- `cargo uninstall` removes installed binaries.

These tools don't need purge commands. Configuration lives in project files
(`package.json`, `requirements.txt`, `Cargo.toml`, `Gemfile`) that developers
manage explicitly through version control. There are no hidden system-wide
configuration files to preserve or purge.

**Cache cleanup keeps itself separate from removal**. Most package managers
cache downloaded packages for faster reinstallation or rollbacks. Cleanup
commands handle these caches:

- `apt clean` removes all cached package files from `/var/cache/apt/archives/`.
- `apt autoclean` removes only obsolete cached packages (newer versions exist).
- `pacman -Sc` removes cached packages for uninstalled software.
- `pacman -Scc` removes all cached packages. Aggressive cleanup.
- `dnf clean all` removes all cached data (packages, metadata, everything).
- `brew cleanup` removes old versions of installed packages and clears cache.
- `npm cache clean --force` clears the npm cache (rarely needed; npm manages
  this automatically).
- `pip cache purge` removes all pip cache files.
- `cargo clean` removes build artifacts from the current project (not a global
  cache operation).

> ### Summary
>
> System package managers need removal distinctions because they manage
> system-wide configuration. apt's `remove` versus `purge` creates a two-tier
> deletion model. pacman's composable flags (`-Rns`, `-Rcns`) provide granular
> control over what gets deleted. Language-specific managers skip these
> distinctions entirely because configuration lives in version-controlled
> project files.
>
> The "purge" terminology appears only in system package managers where hidden
> configuration files justify a stronger deletion verb. The word choice reflects
> the architectural reality: system packages scatter files across `/etc` and
> other directories, while language packages keep everything visible in the
> project tree.

## search: least used functionality?

Package managers provide mechanisms to discover what's available before you can
install it. Searching covers finding packages by name, filtering by description
or tags, and browsing available options. Some managers return rich metadata,
others minimal output.

Search, however, is likely the least used functionality of package managers.
Most times the user already knows what they want to install. They might search
occasionally to check for versions or different builds, but the web search is
usually the primary package discovery tool.

**apt provides basic search with minimal formatting**:

- `apt search <term>` searches package names and descriptions.
- `apt show <package>` displays detailed metadata for a specific package.

The search is substring-based and case-insensitive. Results can be overwhelming
on broad terms.

**pacman offers both local and remote searches**:

- `pacman -Ss <term>` searches remote repositories (`--sync --search`).
- `pacman -Qs <term>` searches locally installed packages (`--query --search`).
- `pacman -Si <package>` shows detailed information about a remote package
  (`--sync --info`).

**DNF differentiates search depth**:

- `dnf search <term>` searches names and summaries.
- `dnf search all <term>` searches names, summaries, descriptions, and URLs.
  More comprehensive but slower.

**Homebrew and language-specific managers converge on simple verbs**:
`brew search`, `npm search`, `cargo search`, `gem search` all work similarly.
They search package names and descriptions, returning lists with brief metadata.

**pip removed `pip search` entirely in 2021** due to infrastructure overload and
allowing users to find popular names to create exploit packages with similar
names. PyPI's web interface became the only discovery method.

> ### Summary
>
> Unlike update/upgrade or remove/purge, search shows better linguistic
> uniformity. Nearly every package manager settled on "search" as the verb. But
> the real divergence isn't in naming but in usage patterns.
>
> Python's choice acknowledged what was already true across ecosystems:
> developers prefer web-based package discovery. npmjs.com, crates.io,
> rubygems.org, and repology.org provide richer search experiences than terminal
> output allows. Sorting by popularity, filtering by tags, examining dependency
> trees, viewing documentation are convenient operations better suited to the
> web.
>
> Personally, I only use CLI search to check for package existence and version
> availability. For anything more complex, I feel more flexible using a web
> interface.

## role of linguistics in security

Package managers differ fundamentally in who can publish packages and how trust
is established. The linguistic choices either reinforce or undermine these
security boundaries.

**OS package managers enforce curation through gatekeeping**. Debian, Fedora,
Arch, and their derivatives require packages go through maintainers who review
code, build processes, and licensing. Adding third-party sources requires
explicit steps: `add-apt-repository` with GPG key imports for apt, `brew tap`
for Homebrew, or manual repository configuration for pacman and dnf. The Arch
User Repository exists separately as explicitly unsupported PKGBUILDs you build
locally. The friction is intentional. The linguistics reinforce this: "adding a
repository" sounds more consequential than "installing a package."

**Language-specific managers default to open publication**. Anyone can publish
to npm, PyPI, or RubyGems after creating an account. No code review, no approval
process. This democratization enabled ecosystem growth but created attack
surface. Historic incidents include npm's `event-stream` (2018) and
`ua-parser-js` (2021). September 2025 brought escalation: a phishing attack
compromised 18 packages including `chalk` (2.6 billion weekly downloads),
followed by **Shai-Hulud**, npm's first self-replicating worm, which spread to
over 180 packages by stealing tokens and credentials.

**The linguistic problem: security operations lack distinct vocabulary**.
Compare `apt purge` (deletion so thorough it needs a special verb) with the
absence of security-specific commands. Most package managers treat security
updates identically to feature updates. `apt upgrade` installs both WordPress
6.8 and critical OpenSSH patches using the same command.

When CVE-2024-6387 ("regreSSHion") required emergency patching in mid-2024,
users ran standard upgrade commands without knowing whether they were applying
security fixes or feature updates. The linguistic uniformity makes security
invisible.

**Alternative registries expose another gap**. npm and pip make registry changes
trivial: `npm config set registry` or `pip install --index-url`. The casual
language gives no indication this is a trust decision. cargo requires editing
`Cargo.toml`, making changes visible but still using neutral terminology. OS
package managers demand multiple manual steps with weightier vocabulary:
"importing keys," "adding repositories," "trusting sources."

Better linguistics alone cannot prevent attacks like Shai-Hulud, which spread
through stolen credentials. But vocabulary shapes how developers perceive risk.
When `npm config set registry` feels as routine as `npm config set loglevel`,
the language fails to signal that one is a trust decision and the other is
cosmetic. Imagine if adding registries required `npm trust registry`, forcing
acknowledgment of modifying the supply chain's trust boundary.

**Audit commands exist but are underused**. `npm audit` runs automatically but
has become background noise. `pip-audit` and `cargo audit` remain niche and
manual. Language-specific managers lack vocabulary to distinguish "this
vulnerability affects your usage" from "this exists in your dependency tree but
poses no actual risk."

> ### Summary
>
> Security linguistics reveals the starkest difference between OS and
> language-specific package managers. OS managers use weighty terminology
> ("trust," "import keys," "add repository") that signals consequential
> decisions. Language-specific managers use neutral configuration vocabulary for
> trust boundaries: "set registry" sounds benign despite being a supply chain
> decision.
>
> Security updates receive no special linguistic treatment. The same commands
> install both features and critical patches, making security work invisible.
> audit commands exist but generate noise without distinguishing real risk from
> theoretical exposure. The vocabulary gap means developers treat trust
> decisions as configuration tweaks and miss security updates in routine
> upgrades.

## Closing thoughts

Language shapes thought, and nowhere is this clearer than in the commands we
type daily without reflection. The choice between `apt remove` and `apt purge`
isn't just about removing configuration files. It's about whether deletion
deserves graduated vocabulary. The choice between `pacman -Syu` and
`apt update && apt upgrade` isn't just about keystroke efficiency. It's about
whether atomic operations should look atomic.

These linguistic decisions compound over years of muscle memory. A developer who
learned `npm install` transfers that verb pattern to `pip install` and
`cargo install`, building an expectation that package management speaks in
verbs. An Arch user who learned `-Syu` expects other operations to compose
through flags. When these expectations break, when `go get` appears instead of
`go install`, or when pip removes `pip search` entirely, the friction isn't just
functional. It's linguistic.

The security implications run deeper than vocabulary. When
`npm config set registry` uses the same casual syntax as
`npm config set loglevel`, the language teaches developers to think of trust
boundaries as configuration options. When `apt upgrade` installs critical
patches alongside WordPress updates using identical commands, security work
becomes invisible. The linguistics don't just reflect design philosophy. They
teach users what to care about.

I started this exploration teaching a middle schooler Linux. The question "why
do package managers all speak different languages?" seemed simple. The answer
turned out to be architectural: verb-first tools optimize for discoverability,
flag-driven tools for composition, and each choice cascades through every
command the tool provides. But architecture alone doesn't explain why
`apt purge` exists while `npm uninstall` doesn't, or why OS managers use "trust"
and "import keys" while language managers use "set" and "config."

The linguistics reveal what each ecosystem values. System package managers
assume configuration matters enough to preserve across reinstalls. Language
managers assume everything important lives in version control. System managers
assume adding sources is dangerous enough to require ceremony. Language managers
assume developers need frictionless access to any registry.

None of these choices are wrong (except, perhaps, Powershell one). They're just
choices, made deliberately or inherited from predecessors, that shape how
millions of developers think about software. Next time you type a package
manager command, consider what its words are teaching you about trust, about
permanence, about what deserves careful thought versus what should be automatic.
