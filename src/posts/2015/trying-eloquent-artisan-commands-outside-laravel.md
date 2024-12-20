---
title: Trying Eloquent artisan commands outside laravel.
date: 2015-03-19
description: Here we take a look on using Eloquent artisan commands outside laravel.
tags:
  - eloquent
  - php
---

In my last blog post, we had a look at [using Eloquent outside laravel](/blog/using-eloquent-outside-laravel). One of the great things about Eloquent is Migrations. It's like a version control for your database schema. Laravel comes with this useful command line tool called `artisan`, which makes it easy to make and run migrations. Since I was using Eloquent outside laravel, I had this (crazy) idea of trying to use the migration `artisan` commands along with it (i.e outside laravel).

## Setup

Eloquent suggests installing `illuminate\console` and `illuminate\filesystem` to run the migration commands. So I update my `composer.json` accordingly and installed the required packages.

I made a file called `artsy` and put the following content in it:

```php
<?php
require_once "vendor/autoload.php";
use Symfony\Component\Console\Application;

$app = new Application("Artsy, little brother of Artisan", "1.0");

$app->run();
```

## Including commands

My first aim was to add `migrate:install` and `make:migrate` commands which would insert required migration tables to the database and run migrations respectively. After going through the database component's code, I realized that the components have a crazy dependency on each other and required a lot of bootstrapping (which is obviously handled by Laravel internally). To ease this task a bit, I decided to use `Pimple`.

After a bit struggle, I finally figured out the dependencies and also that I'll need to mock `Illuminate\Foundation\Composer` for `make:migrate` command. So I also included `Mockery`. And after all this my `artsy` file looked like this:

```php
<?php
require_once "vendor/autoload.php";

use Symfony\Component\Console\Application;
use Illuminate\Database\Console\Migrations;
use Pimple\Container;

$container = new Container();

$container['migration-table'] = 'migration';

$container['db-config'] = [
    'driver'    => 'pgsql',
    'host'      => 'localhost',
    'database'  => 'dummy',
    'username'  => 'postgres',
    'password'  => 'postgres',
    'charset'   => 'utf8',
    'prefix'    => '',
    'schema'   => 'public'
];

$container['filesystem'] = function ($c) {
    return new \Illuminate\Filesystem\Filesystem;
};

$container['composer'] = function ($c) {
    $composer = Mockery::mock('Illuminate\Foundation\Composer');
    $composer->shouldReceive('dumpAutoloads');
    return $composer;
};

$container['connection'] = function ($c) {
    $manager = new \Illuminate\Database\Capsule\Manager();
    $manager->addConnection($c['db-config']);
    $manager->setAsGlobal();
    $manager->bootEloquent();
    return $manager->getConnection('default');
};

$container['resolver'] = function ($c) {
    $r = new \Illuminate\Database\ConnectionResolver(['default' => $c['connection']]);
    $r->setDefaultConnection('default');
    return $r;
};

$container['migration-repo'] = function ($c) {
    return new \Illuminate\Database\Migrations\DatabaseMigrationRepository($c['resolver'], $c['migration-table']);
};

$container['migration-creator'] = function ($c) {
    return new \Illuminate\Database\Migrations\MigrationCreator($c['filesystem']);
};

$container['migrator'] = function ($c) {
    return new Illuminate\Database\Migrations\Migrator($c['migration-repo'], $c['resolver'], $c['filesystem']);
};

$container['install-command'] = function ($c) {
    $command = new Migrations\InstallCommand($c['migration-repo']);
    return $command;
};

$container['migrate-make-command'] = function ($c) {
    $command = new Migrations\MigrateMakeCommand($c['migration-creator'], $c['composer']);
    return $command;
};

$app = new Application("Foo", "1.0");
$app->add($container['install-command']);
$app->add($container['migrate-make-command']);

```

Now running on running `php artsy`, showed me:

```bash
Artsy, little brother of Artisan 1.0

Usage:
 [options] command [arguments]

Options:
 --help (-h)           Display this help message
 --quiet (-q)          Do not output any message
 --verbose (-v|vv|vvv) Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug
 --version (-V)        Display this application version
 --ansi                Force ANSI output
 --no-ansi             Disable ANSI output
 --no-interaction (-n) Do not ask any interactive question

Available commands:
 help              Displays help for a command
 list              Lists commands
make
 make:migration    Create a new migration file
migrate
 migrate:install   Create the migration repository
```

Everything looked good till now. But upon running `php artsy migrate:install`, I got the following error.

```bash
PHP Fatal error:  Call to a member function call() on null in E:\demo\vendor\illuminate\console\Command.php on line 115
PHP Stack trace:
PHP 1. {main}() E:\demo\artsy:0
PHP 2. Symfony\Component\Console\Application->run() E:\demo\artsy:48
PHP 3. Symfony\Component\Console\Application->doRun() E:\demo\vendor\symfony\console\Symfony\Component\Console\Application.php:126
PHP 4. Symfony\Component\Console\Application->doRunCommand() E:\demo\vendor\symfony\console\Symfony\Component\Console\Application.php:195
PHP 5. Illuminate\Console\Command->run() E:\demo\vendor\symfony\console\Symfony\Component\Console\Application.php:874
PHP 6. Symfony\Component\Console\Command\Command->run() E:\demo\vendor\illuminate\console\Command.php:101
PHP 7. Illuminate\Console\Command->execute() E:\demo\vendor\symfony\console\Symfony\Component\Console\Command\Command.php:253
```

Upon inspecting `Command.php` in `illuminate\console` package, I found that the following line (L115) was the culprit.

```php
return $this->laravel->call([$this, $method]);
```

As you can see, a whole instance of `laravel` is required even for running a simple console command!!!!

I tried mocking it too but the command did not do anything as expected and I could not think of a way to do it (with my limited knowledge of PHP) without implementing the whole `Illuminate\Contracts\Foundation\Application` interface with 20+ methods.

## Conclusion

Laravel components are not as flexible or should I say loosely couple as that of Symfony's. I wish they had been, but I'm no Taylor Otwell.

This was me just trying out some crazy idea and trying to learn stuff. If any one of you know a better solution, I would really like to discuss it. You can leave a comment below or tweet me [@\_vkbansal](https://twitter.com/_vkbansal)
