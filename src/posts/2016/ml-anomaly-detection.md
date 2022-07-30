---
title: 'Anomaly Detection'
date: 2016-07-02
description: My notes from Machine Learning Course by Andrew Ng.
tags:
  - notes
  - machine-learning
---

## Problem Motivation

Just like in other learning problems, we are given a dataset $x^{(1)},x^{(2)}, \dots ,x^{(m)}$.

We are then given a new example, $x_{test}$, and we want to know whether this new example is abnormal/anomalous.

We define a **model** $p(x)$ that tells us the probability the example is not anomalous. We also use a threshold $\epsilon$ (epsilon) as a dividing line so we can say which examples are anomalous and which are not.

A very common application of anomaly detection is detecting fraud:

$$
\begin{align*}
& x^{(i)} = \text{features of user } i\text{'s activities} \newline
& \text{Model } p(x) \text{ from the data} \newline
& \text{Identify unusual users by checking which have } p(x) < \epsilon \\
\end{align*}
$$

If our anomaly detector is flagging **too many** anomalous examples, then we need to **decrease** our threshold $\epsilon$.

## Anamoly Detection vs Supervised Learning

|                                                 Anamoly Detection                                                  |                               Supervised Learning                                |
| :----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|       Very small no. of $+ve$ examples $(y = 1)$ (anamoly). Large number of $-ve$ $(y=0)$ examples (nomaly)        |                     Large number of $+ve$ and $-ve$ examples                     |
| Many different "types" of anomalies. Hard for any algorithm to learn from $+ve$ examples what anomalies look like. | Enough $+ve$ examples for the alogrithm to get a sense of what $+ve$(s) are like |
|              Future anomalies may look nothing like any of the anomalous examples we've seen so far.               |        Future $+ve$ examples likely to be similar to ones in training set        |
|                   Examples: Fraud Detection, Manufacturing, Monitoring machines in data centers                    |  Examples: Email Spam Classification, Weather Prediction, Cancer Classification  |

## Gaussian Distribution

The Gaussian Distribution is a familiar bell-shaped curve that can be described by a function $\mathcal{N}(\mu,\sigma^2)$

Let $x \in R$. If the probability distribution of $x$ is Gaussian with mean $\mu$, variance $\sigma^2$, then:

$$
x \sim \mathcal{N}(\mu, \sigma^2)
$$

The little $\sim$ or 'tilde' can be read as **distributed as**.

The Gaussian Distribution is parameterized by a mean and a variance.

Mu, or $\mu$, describes the center of the curve, called the mean. The width of the curve is described by sigma, or $\sigma$, called the standard deviation.

The full function is as follows:

$$
\large p(x; \mu, \sigma^2) = \dfrac{1}{\sigma\sqrt{2\pi}}e^{-\dfrac{1}{2}(\dfrac{x - \mu}{\sigma})^2}
$$

We can estimate the parameter $\mu$ from a given dataset by simply taking the average of all the examples:

$$
\mu = \frac{1}{m} \sum_{i =1}^{m} x^{(i)}
$$

We can estimate the other parameter, $\sigma^2$, with our familiar squared error formula:

$$
\sigma^2 = \frac{1}{m} \sum_{i = 1}{m}(x^{(i)} - \mu)^2
$$

## Algorithm

Given a training set of examples $\{x^{(1)}, \dots ,x^{(m)}\}$ where each example is a vector, $x \in R^n$.

$$
p(x) = p(x_1;\mu_1, \sigma^2_1) p(x_2;\mu_2, \sigma^2_2) \dots p(x_n;\mu_n, \sigma^2_n)
$$

In statistics, this is called an **independence assumption** on the values of the features inside training example $x$.

$$
= \prod_{j=1}^n(x_j; \mu_j, \sigma_j)
$$

**The algorithm**

Choose features $x_i$ that you think might be indicative of anomalous examples.

Fit parameters $\mu_1,\dots,\mu_n$, $\sigma^2_1, \dots, \sigma^2_n$.

Calculate $μ_j=\frac{1}{m}\sum_{i=1}^mx^{(i)}_j$

Calculate $\sigma^2_j = \frac{1}{m} \sum_{i=1}^m (x^{(i)}_j - \mu_j)^2$

Given a new example $x$, compute $p(x)$:

$$
p(x) = \prod_{j=1}^n p(x_j; \mu_j, \sigma^2_j) = \prod_{j=1}^n
$$

Anomaly if $p(x)< \epsilon$

A vectorized version of the calculation for $\mu$ is $μ=\frac{1}{m}\sum_{i=1}^{m}x^{(i)}$. You can vectorize $\sigma^2$ similarly.

## Developing and Evaluating an Anomaly Detection System

To evaluate our learning algorithm, we take some labeled data, categorized into anomalous and non-anomalous examples ($y=0$ if normal, $y=1$ if anomalous).

Among that data, take a large proportion of **good**, non-anomalous data for the training set on which to train $p(x)$.

Then, take a smaller proportion of mixed anomalous and non-anomalous examples (you will usually have many more non-anomalous examples) for your cross-validation and test sets.

For example, we may have a set where 0.2% of the data is anomalous. We take 60% of those examples, all of which are good (y=0) for the training set. We then take 20% of the examples for the cross-validation set (with 0.1% of the anomalous examples) and another 20% from the test set (with another 0.1% of the anomalous).

In other words, we split the data $60/20/20$ training/CV/test and then split the anomalous examples $50/50$ between the CV and test sets.

**Algorithm evaluation:**

Fit model $p(x)$ on training set $\{ x^{(1)}, \dots, x^{(m)}\} \\$
On a cross validation/test example $x\$, predict:

$$
\begin{align*}
& \text{If } p(x) < \epsilon \text{ (anomaly), then } y=1 \\
& \text{If } p(x) \ge \epsilon \text{ (normal), then } y=0 \\
\end{align*}
$$

Possible evaluation metrics (see [Machine Learning System Design](./ml-machine-learning-system-design/)):

- True positive, false positive, false negative, true negative.
- Precision/recall
- F1 score

> Note that we use the cross-validation set to choose parameter $ϵ$

## Choosing What Features to Use

The features will greatly affect how well your anomaly detection algorithm works.

We can check that our features are **gaussian** by plotting a histogram of our data and checking for the bell-shaped curve.

Some **transforms** we can try on an example feature x that does not have the bell-shaped curve are:

- $log(x)$
- $log(x+1)$
- $log(x+c)$ for some constant
- $\sqrt{x}$
- $x^{1/3}$

We can play with each of these to try and achieve the gaussian shape in our data.

There is an **error analysis procedure** for anomaly detection that is very similar to the one in supervised learning.

Our goal is for $p(x)$ to be large for normal examples and small for anomalous examples.

One common problem is when $p(x)$ is similar for both types of examples. In this case, you need to examine the anomalous examples that are giving high probability in detail and try to figure out new features that will better distinguish the data.

In general, choose features that might take on unusually large or small values in the event of an anomaly.

## Multivariate Gaussian Distribution

The multivariate gaussian distribution is an extension of anomaly detection and may (or may not) catch more anomalies.

Instead of modeling $p(x_1) ,p(x_2),\dots$ separately, we will model $p(x)$ all in one go. Our parameters will be: $\mu \in \mathbb{R}^n$ and $\Sigma \in \mathbb{R}^{n \times n}$

$$
p(x; \mu, \Sigma) = \frac{1}{(2\pi)^{n/2} |{\Sigma}|^{1/2}}exp\left( -\frac{1}{2}(x - \mu)^T \Sigma^{-1}(x - \mu)\right)
$$

The important effect is that we can model oblong gaussian contours, allowing us to better fit data that might not fit into the normal circular contours.

Varying $\Sigma$ changes the shape, width, and orientation of the contours. Changing $\mu$ will move the center of the distribution.

## Anomaly Detection using the Multivariate Gaussian Distribution

When doing anomaly detection with multivariate gaussian distribution, we compute $\mu$ and $\Sigma$ normally. We then compute $p(x)$ using the new formula in the previous section and flag an anomaly if $p(x)<\epsilon$.

The original model for $p(x)$ corresponds to a multivariate Gaussian where the contours of $p(x;\mu,\Sigma)$ are axis-aligned.

The multivariate Gaussian model can automatically capture correlations between different features of $x$.

However, the original model maintains some advantages: it is computationally cheaper (no matrix to invert, which is costly for large number of features) and it performs well even with small training set size (in multivariate Gaussian model, it should be greater than the number of features for $\Sigma$ to be invertible).
