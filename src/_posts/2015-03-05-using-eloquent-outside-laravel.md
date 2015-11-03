---
title: Using Eloquent outside Laravel
author: 
    name: Vivek Kumar Bansal
    site: http://vkbansal.me
date: 2015-03-05
description: Here we take a look on using Eloquent ORM from Laravel fame outside it
tag:
  - eloquent
  - php
---
I was looking for an ORM to use in a project and that lead to a lot of research. I finalized my list to `Doctrine`, `Propel` and `Eloquent`. I did not like `Doctrine`'s way of using annotations. I tried `Propel` (specifically the upcoming version 2) and really liked it but it wasn't stable enough to be used in production. Then I looked into `Eloquent` of the
[Laravel](http://laravel.com) fame and it instantly blew my mind.

Initially Eloquent was tightly coupled into the framework but as the public demand grew, a package called `Capsule` was created by the (in)famous [Phil Sturgeon](https://twitter.com/philsturgeon). Later it was merged into the offical repository. Today we will be learning how to use it outside Laravel.

## Installation
We will be using composer to install it.
```bash
composer require illuminate\database
```
Now creating a connection is as simple as shown below. Eloquent supports a wide variety of databases. You cav have a look at them in the [official docs](http://laravel.com/docs/database).
```php
//index.php
<?php
require "vendor/autoload.php";

use Illuminate\Database\Capsule\Manager as Capsule;

/**
 * Configure the database and boot Eloquent
 */
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => 'host',
    'database'  => 'database',
    'username'  => 'username',
    'password'  => 'password',
    'charset'   => 'utf8',
    'collation' => 'utf8_general_ci',
    'prefix'    => 'prefix_'
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();
// set timezone for timestamps etc
date_default_timezone_set('UTC');
```
And we are good to go!

## Building Schema
A schema can be built or dropped using code similar to shown below.
```php
<?php
use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

//Creating schema
Capsule::schema()->create('users', function (Blueprint $table) {
    $table->increments('id');
    $table->string('username');
    $table->string('first_name')->nullable();
    $table->string('last_name')->nullable();
    $table->string('email');
    $table->string('password');
    $table->timestamps();
});

//Droping Schema
Capsule::schema()->dropIfExists('users');
```

## Making a model
Making a model is as simple as extending `Illuminate\Database\Eloquent\Model`

```php
<?php
//User Model
use Illuminate\Database\Eloquent\Model as Eloquent
class User extends Eloquent {
    //
}
```

## Wrap Up
This was a quick look at using `Eloquent` ORM outside Laravel. Hope you find it useful too.
