---
title: Conditional git config
date: 2021-08-31
description: How to configure git based on folder paths.
tags:
  - git
  - tricks
---

If you are like me and you organize your projects in different folders like `~/Projects/MyCompany` for work-related projects and `~/Projects/Personal` for side projects, and you want to be able to configure git email based on the directory, instead of configuring it for each folder, then it can be achieved using conditional includes in git config.

Add entries in the following format in your `~/.gitconfig`. Customize the paths as per your requirements:

```ini
# ~/.gitconfig
[includeIf "gitdir:~/Projects/MyCompany/"]
  path = ~/Projects/MyCompany/.gitconfig

[includeIf "gitdir:~/Projects/Personal/"]
  path = ~/Projects/Personal/.gitconfig
```

And update the individual configs:

```ini
# ~/Projects/MyCompany/.gitconfig
[user]
  name = John Doe
  email = johndoe@mycompany.com
```

```ini
# ~/Projects/Personal/.gitconfig
[user]
  name = John Doe
  email = johndoe@myblog.com
```

Now if you go into respective folders and run `git config user.email`, you must see
the relevant email.
