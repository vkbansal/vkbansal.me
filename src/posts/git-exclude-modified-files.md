---
layout: 'layouts/Blog.astro'
title: Exclude modified files in git
date: 2021-08-30
description: How to exclude modified files from showing up in changed files in git
tags:
  - git
  - tricks
---

There might be times when you want to change some files, but don't want them to show up under changed files, when you do `git status` or in your Git GUI client.

You can use the following command to tell git to ignore any changes to the file:

```bash
git update-index --assume-unchanged <file>
```

To undo the ignore, just run the following command:

```bash
git update-index --no-assume-unchanged <file>
```

You can also alias the command by adding the following lines in your `~/.gitconfig`:

```ini
[alias]
  ignore = update-index --assume-unchanged
  noignore = update-index --no-assume-unchanged
```

Now you can just use `git ignore <file>` and `git noignore <file>` to ignore and undo ignore respectively.
