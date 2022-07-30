---
layout: 'layouts/Blog.astro'
title: 'Recommender Systems'
date: 2016-07-26
description: My notes from Machine Learning Course by Andrew Ng.
tags:
  - notes
  - 'machine-learning'
draft: true
math: true
---

import Blog from 'layouts/Blog.astro';

<Blog content={frontmatter}>

## Problem Formulation

Recommendation is currently a very popular application of machine learning.

Say we are trying to recommend movies to customers. We can use the following definitions

> nu= number of users
>
> nm= number of movies
>
> r(i,j)=1 if user j has rated movie i
>
> y(i,j)= rating given by user j to movie i (defined only if r(i,j)=1)

## Content Based Recommendations

We can introduce two features, x1 and x2 which represents how much romance or how much action a movie may have (on a scale of 0−1).

One approach is that we could do linear regression for every single user. For each user j, learn a parameter θ(j)∈R3. Predict user j as rating movie i with (θ(j))Tx(i) stars.

> θ(j)= parameter vector for user j
>
> x(i)= feature vector for movie i
>
> For user j, movie i, predicted rating: (θ(j))T(x(i))
>
> m(j)= number of movies rated by user j

To learn θ(j), we do the following

minθ(j)=12∑i:r(i,j)=1((θ(j))T(x(i))−y(i,j))2+λ2∑k=1n(θ(j)k)2

This is our familiar linear regression. The base of the first summation is choosing all i such that r(i,j)=1.

To get the parameters for all our users, we do the following:

minθ(1),…,θ(nu)=12∑j=1nu∑i:r(i,j)=1((θ(j))T(x(i))−y(i,j))2+λ2∑j=1nu∑k=1n(θ(j)k)2

We can apply our linear regression gradient descent update using the above cost function.

The only real difference is that we **eliminate the constant 1m**.

## Collaborative Filtering

It can be very difficult to find features such as "amount of romance" or "amount of action" in a movie. To figure this out, we can use *feature finders*.

We can let the users tell us how much they like the different genres, providing their parameter vector immediately for us.

To infer the features from given parameters, we use the squared error function with regularization over all the users:

minx(1),…,x(nm)12∑i=1nm∑j:r(i,j)=1((θ(j))Tx(i)−y(i,j))2+λ2∑i=1nm∑k=1n(x(i)k)2

You can also **randomly guess** the values for theta to guess the features repeatedly. You will actually converge to a good set of features.

## Collaborative Filtering Algorithm

To speed things up, we can simultaneously minimize our features and our parameters:

J(x,θ)=12∑(i,j):r(i,j)=1((θ(j))Tx(i)−y(i,j))2+λ2∑i=1nm∑k=1n(x(i)k)2+λ2∑j=1nu∑k=1n(θ(j)k)2

It looks very complicated, but we've only combined the cost function for theta and the cost function for x.

Because the algorithm can learn them itself, the bias units where x0=1 have been removed, therefore x∈Rn and θ∈Rn.

These are the steps in the algorithm:

1. Initialize x(i),...,x(nm),θ(1),...,θ(nu) to small random values. This serves to break symmetry and ensures that the algorithm learns featuresx(i),...,x(nm) that are different from each other.

2. Minimize J(x(i),...,x(nm),θ(1),...,θ(nu)) using gradient descent (or an advanced optimization algorithm).

   Minimize J(x(i),...,x(nm),θ(1),...,θ(nu)) using gradient descent (or an advanced optimization algorithm).
   E.g. for every j=1,...,nu,i=1,...nm:

   Minimize J(x(i),...,x(nm),θ(1),...,θ(nu)) using gradient descent (or an advanced optimization algorithm).
   E.g. for every j=1,...,nu,i=1,...nm:
   x(i)k :=x(i)k−α⎛⎝∑j:r(i,j)=1((θ(j))Tx(i)−y(i,j))θ(j)k+λx(i)k⎞⎠

   Minimize J(x(i),...,x(nm),θ(1),...,θ(nu)) using gradient descent (or an advanced optimization algorithm).
   E.g. for every j=1,...,nu,i=1,...nm:
   x(i)k :=x(i)k−α⎛⎝∑j:r(i,j)=1((θ(j))Tx(i)−y(i,j))θ(j)k+λx(i)k⎞⎠
   θ(j)k :=θ(j)k−α⎛⎝∑i:r(i,j)=1((θ(j))Tx(i)−y(i,j))x(i)k+λθ(j)k⎞⎠

3. For a user with parameters θ and a movie with (learned) features x, predict a star rating of θTx.

## Vectorization: Low Rank Matrix Factorization

Given matrices X (each row containing features of a particular movie) and Θ (each row containing the weights for those features for a given user), then the full matrix Y of all predicted ratings of all movies by all users is given simply by: Y=XΘT.

Predicting how similar two movies i and j are can be done using the distance between their respective feature vectors x. Specifically, we are looking for a small value of ||x(i)−x(j)||.

## Implementation Detail: Mean Normalization

If the ranking system for movies is used from the previous lectures, then new users (who have watched no movies), will be assigned new movies incorrectly. Specifically, they will be assigned θ with all components equal to zero due to the minimization of the regularization term. That is, we assume that the new user will rank all movies 0, which does not seem intuitively correct.

We rectify this problem by normalizing the data relative to the mean. First, we use a matrix Y to store the data from previous ratings, where the ith row of Y is the ratings for the ith movie and the jth column corresponds to the ratings for the jth user.

We can now define a vector

μ=[μ1,μ2,…,μnm]

such that

μi=∑j:r(i,j)=1Yi,j∑jr(i,j)

Which is effectively the mean of the previous ratings for the ith movie (where only movies that have been watched by users are counted). We now can normalize the data by subtracting u, the mean rating, from the actual ratings for each user (column in matrix Y):

As an example, consider the following matrix Y and mean ratings μ:

Y=⎡⎣⎢⎢54005 ?000 ?550040⎤⎦⎥⎥,μ=⎡⎣⎢⎢2.522.251.25⎤⎦⎥⎥

The resulting Y′ vector is:

Y′=⎡⎣⎢⎢2.52−.2.25−1.252.5 ?−2.25−1.25−2.5 ?3.753.75−2.5−21.25−1.25⎤⎦⎥⎥

Now we must slightly modify the linear regression prediction to include the mean normalization term:

(θ(j))Tx(i)+μi

Now, for a new user, the initial predicted values will be equal to the μ term instead of simply being initialized to zero, which is more accurate.

</Blog>
