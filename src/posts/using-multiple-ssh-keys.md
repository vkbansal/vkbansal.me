---
layout: 'layouts/Blog.astro'
title: Using multiple SSH keys.
date: 2016-01-04
description: Here we take a look at using multiple ssh keys.
tags:
  - unix
  - ssh
  - server
---

There might be situations where one might want to use different SSH keys for different sites. And here's how to do it.

## SSH keys

I'm assuming that we have already generated different SSH keys for `github.com` and `bitbucket.org` in `~/.ssh/`.

```bash
$ cd ~/.ssh
$ ls
id_rsa  id_rsa.pub  github_rsa  github_rsa.pub bitbucket_rsa  bitbucket_rsa.pub
```

## Config

Now create a `config` file in `~/.ssh`.

```bash
$ cd ~/.ssh
$ touch config
```

And add the following lines to the file using your favorite editor.

```bash
host github.com
  IdentityFile ~/.ssh/github_rsa
host bitbucket.org
  IdentityFile ~/.ssh/bitbucket_rsa
```

Reload the SSH service (depends on your system) and your are all set.

## Wrap Up

I hope you find this tip useful. Let me know using comments down below or tweet me [@\_vkbansal](https://twitter.com/_vkbansal).
