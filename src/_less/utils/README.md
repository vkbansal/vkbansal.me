# Utils Folder
The `utils/` folder gathers all Sass tools and helpers used across the project.
Every global variable, function, mixin and placeholder should be put in here.

The rule of thumb for this folder is that it should not output a single line
of CSS when compiled on its own. These are nothing but Sass helpers.

 - `_variables.less`
 - `_mixins.less`
 - `_functions.less`
 - `_placeholders.less`

When working on a very large project with a lot of utilities, it might be
interesting to group them by topic rather than type, for instance
typography (`_typography.less`), theming (`_theming.less`), etc.
Each file contains all the related helpers: variables, functions, mixins and
placeholders. Doing so can make the code easier to browse and maintain,
especially when files are getting very long.
