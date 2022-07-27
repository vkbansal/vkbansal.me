---
layout: 'layouts/Blog.astro'
title: 'Support Vector Machines (SVMs)'
date: 2016-06-19
description: My notes from Machine Learning Course by Andrew Ng.
tags:
  - notes
  - 'machine-learning'
math: true
---

## Optimization Objective

The **Support Vector Machine** (SVM) is yet another type of *supervised* machine learning algorithm. It is sometimes cleaner and more powerful.

Recall that in logistic regression, we use the following rules:

$$
y =
\begin{cases}
\space 1 & \text{then } h_\theta(x) \approx 1 \text { and } \theta^Tx \gg 0 \\ \\
\space 0 &  \text{then } h_\theta(x) \approx 0 \text { and } \theta^Tx \ll 0
\end{cases}
$$

Recall the cost function for (unregularized) logistic regression:

$$
\begin{align*}
J(\theta)
&= \frac{1}{m} \sum_{i=1}^m \left[ -y^{(i)} log(h_\theta(x^{(i)}))  - (1-y^{(i)}) \space log(1-h_\theta(x^{(i)}))\right] \\
& =\frac{1}{m} \sum_{i=1}^m \left[ -y^{(i)} log \left(\frac{1}{1+e^{\theta^Tx}}\right)  - (1-y^{(i)}) \space log\left(1 -\frac{1}{1+e^{\theta^Tx}}\right)\right] \\
\end{align*}
$$

To make a support vector machine, we will modify the first term of the cost function $\left(−log(h_\theta(x))=−log\left(\frac{1}{1+e^{−\theta^Tx}}\right)\right)$ so that when $\theta^Tx$ (from now on, we shall refer to this as $z$) is greater than $1$, it outputs $0$. Furthermore, for values of $z$ less than $1$, we shall use a straight decreasing line instead of the sigmoid curve.(In the literature, this is called a [hinge loss](http://en.wikipedia.org/wiki/Hinge_loss) function.)

![Svm hinge loss](./img/hinge_loss.svg)

<!--{.img-center}-->

Similarly, we modify the second term of the cost function $\left(−log(1−h_\theta(x))=−log\left(1−\frac{1}{1+e^{−\theta^Tx}}\right)\right)$ so that when $z$ is less than $-1$, it outputs $0$. We also modify it so that for values of $z$ greater than $-1$, we use a straight increasing line instead of the sigmoid curve.

![Svm hinge loss](./img/hinge_loss_negative.svg)

<!--{.img-center}-->

We shall denote these as $Cost_1(z)$ and $Cost_0(z)$ respectively. Note that $Cost_1(z)$ is the cost for classifying when $y=1$, and $Cost_0(z)$ is the cost for classifying when $y=0$, and we may define them as follows (where $k$ is an arbitrary constant defining the magnitude of the slope of the line):

$$
\begin{align*}
z &= \theta^Tx \\
Cost_o(z) &= max(0, k(1+z)) \\
Cost_1(z)  &= max (0, k(1-z))
\end{align*}
$$

Recall the full cost function from (regularized) logistic regression:

$$
J(\theta) = \frac{1}{m} \sum_{i=1}^m y^{(i)}(-log(h_\theta(x^{(i)})) + (1-y^{(i)})(-log(1-h_\theta(x^{(i)}))) + \frac{\lambda}{2m} \sum_{j=1}^n\theta_j^2
$$

Note that the negative sign has been distributed into the sum in the above equation.

We may transform this into the cost function for support vector machines by substituting $Cost_0(z)$ and $Cost_1(z)$:

$$
J(\theta) = \frac{1}{m} \sum_{i=1}^m y^{(i)}Cost_1(\theta^Tx^{(i)}) + (1-y^{(i)})Cost_0(\theta^Tx^{(i)}) + \frac{\lambda}{2m} \sum_{j=1}^n\theta_j^2
$$

We can optimize this a bit by multiplying this by $m$ (thus removing the m factor in the denominators). Note that this does not affect our optimization, since we're simply multiplying our cost function by a positive constant.

$$
J(\theta) = \sum_{i=1}^m y^{(i)}Cost_1(\theta^Tx^{(i)}) + (1-y^{(i)})Cost_0(\theta^Tx^{(i)}) + \frac{\lambda}{2} \sum_{j=1}^n\theta_j^2
$$

Furthermore, convention dictates that we regularize using a factor $C$, instead of $\lambda$, like so:

$$
J(\theta) = C \sum_{i=1}^m y^{(i)}Cost_1(\theta^Tx^{(i)}) + (1-y^{(i)})Cost_0(\theta^Tx^{(i)}) + \frac{1}{2} \sum_{j=1}^n\theta_j^2
$$

This is equivalent to multiplying the equation by $C=\frac{1}{\lambda}$, and thus results in the same values when optimized. Now, when we wish to regularize more (that is, reduce overfitting), we *decrease* $C$, and when we wish to regularize less (that is, reduce underfitting), we *increase* $C$.

Finally, note that the hypothesis of the Support Vector Machine is *not* interpreted as the probability of $y$ being $1$ or $0$ (as it is for the hypothesis of logistic regression). Instead, it outputs either $1$ or $0$. (In technical terms, it is a discriminant function.)

$$
h_\theta(x) =
\begin{cases}
\space 1 & \text{if } \theta^Tx \geq 0 \\ \\
\space 0 & \text{otherwise}
\end{cases}
$$

## Large Margin Intuition

A useful way to think about Support Vector Machines is to think of them as *Large Margin Classifiers*.

$$
y =
\begin{cases}
\space 1 & \text{we want } \theta^Tx \geq 1 \text{ (not just} \geq 0\text{)} \\ \\
\space 0 & \text{we want } \theta^Tx \leq -1 \text{ (not just} < 0\text{)} \\
\end{cases}
$$

Now when we set our constant $C$ to a very **large** value (e.g. $100,000$), our optimizing function will constrain $\theta$ such that the summation of the cost of each example equals 0. We impose the following constraints on $\theta$:

$$
\theta^Tx \ge 1 \text{ if } y =1 \\
\theta^Tx \le -1 \text{ if } y =0
$$

If $C$ is very large, we must choose $\theta$ parameters such that:

$$
\sum_{i=1}^m y^{(i)} Cost_1(\theta^Tx) + (1-y^{(i)}) \space Cost_0(\theta^Tx) = 0
$$

This reduces our cost function to:

$$
J(\theta) = C \cdot 0 + \frac{1}{2} \sum_{j=1}^{n} \theta_j^2
$$

In SVMs, the decision boundary has the special property that it is **as far away as possible** from both the positive and the negative examples. The distance of the decision boundary to the nearest example is called the **margin**. Since SVMs maximize this margin, it is often called a *Large Margin Classifier*.

The SVM will separate the negative and positive examples by a **large margin**. This large margin is only achieved when **$C$ is very large**. Data is **linearly separable** when a **straight line** can separate the positive and negative examples. If we have **outlier** examples that we don't want to affect the decision boundary, then we can **reduce** $C$.

Increasing and decreasing $C$ is similar to respectively decreasing and increasing $\lambda$, and can simplify our decision boundary.

## Mathematics Behind Large Margin Classification

### Vector Inner Product

Say we have two vectors, $\vec{u}$ and $\vec{v}$:

$$
u = \begin{bmatrix}u_1 \\ u_2\end{bmatrix} v = \begin{bmatrix}v_1 \\ v_2\end{bmatrix}
$$

The length of vector $\vec{v}$ is denoted $||v||$, and it describes the line on a graph from origin $(0,0)$ to $(v_1,v_2)$.

The length of vector $\vec{v}$ can be calculated with $\sqrt{v_1^2 + v_2^2}$  by the Pythagorean theorem.

The **projection** of vector $\vec{v}$ onto vector $\vec{u}$ is found by taking a right angle from $\vec{u}$ to the end of $\vec{v}$, creating a right triangle.

$$
\begin{align*}
p &= \text{length of projection of } \vec{v} \text{ onto the vector } \vec{u}. \\ \\
u^Tv &= p \cdot ||u||
\end{align*}
$$

Note that $u^Tv=||u||\cdot||v||cos\theta$ where $\theta$ is the angle between $\vec{u}$ and $\vec{v}$. Also, $p=||v||cosθ$. If you substitute $p$ for $||v||cosθ$, you get $u^Tv=p \cdot ||u||$.

So the product $u^Tv$ is equal to the length of the projection times the length of vector $\vec{u}$.

If $\vec{u}$ and $\vec{v}$ are vectors of the same length, then $u^Tv=v^Tu$.

uTv=vTu=p⋅||u||=u1v1+u2v2

$$
u^Tv = v^Tu = p \cdot ||u|| = u_1v_1+ u_2 v_2
$$

If the **angle** between $\vec{v}$ and $\vec{u}$ is **greater than 90 degrees**, then the projection $p$ will be **negative**.

$$
\min_\theta \frac{1}{2} \sum_{j=1}^n \theta_j^2
= \frac{1}{2} (\theta_1^2 + \theta_2^2 + \cdots +\theta_n^2)
= \frac{1}{2} \sqrt{(\theta_1^2 + \theta_2^2 + \cdots +\theta_n^2)^2}
= \frac{1}{2} ||\Theta||^2
$$

We can use the same rules to rewrite $\Theta^Tx^{(i)}$:

$$
\Theta^Tx^{(i)} = p^{(i)} \cdot ||\Theta|| = \theta_1x^{(i)}_1 + \theta_2x^{(i)}_2+ \cdots + \theta_nx^{(i)}_n
$$

So we now have a new **optimization objective** by substituting $p^{(i)} \cdot ||\Theta||$ in for $\Theta^Tx^{(i)}$:

$$
\begin{align*}
&\text{If } y=1, \text{we want } p^{(i)} \cdot ||\Theta|| \ge 1 \\
& \text{If } y=0, \text{we want } p^{(i)} \cdot ||\Theta|| \le -1 \\
\end{align*}
$$

The reason this causes a **large margin** is because: the vector for $\Theta$ is perpendicular to the decision boundary. In order for our optimization objective (above) to hold true, we need the absolute value of our projections $p^{(i)}$ to be as large as possible.

If $\Theta_0=0$, then all our decision boundaries will intersect $(0,0)$. If $\Theta_o \ne 0$, the support vector machine will still find a large margin for the decision boundary.

## Kernels

**Kernels** allow us to make complex, non-linear classifiers using Support Vector Machines.

Given $x$, compute new feature depending on proximity to landmarks $l^{(1)}, l^{(2)}, l^{(3)}$.

To do this, we find the **similarity** of $x$ and some landmark $l^{(i)}$:

$$
f_i= similarity(x,l^{(i)})=exp\left(\frac{−||x−l^{(i)}||}{2\sigma^2}\right)
$$

This **similarity** function is called a **Gaussian Kernel**. It is a specific example of a kernel.

The similarity function can also be written as follows:

$$
f_i= similarity(x,l^{(i)})=exp\left(\frac{−\sum_{j=1}^n(x_j−l^{(i)}_j)^2}{2\sigma^2}\right)
$$

There are a couple properties of the similarity function:

$$
\text{If } x \approx l^{(i)} \text{, then } f_i = exp \left(\frac{(\approx 0)^2}{2\sigma^2} \right)  \approx 1\\
\text{If } x \text{ is far from } l^{(i)} \text{, then } f_i = exp \left(\frac{(\text{large number})^2}{2\sigma^2} \right) \approx  0\\
$$

In other words, if $x$ and the landmark are close, then the similarity will be close to $1$, and if $x$ and the landmark are far away from each other, the similarity will be close to $0$.

Each landmark gives us the features in our hypothesis:

$$
\begin{align*}
l^{(1)} & \rightarrow f_1 \\
l^{(2)} &\rightarrow f_2 \\
l^{(3)} & \rightarrow f_3  \dots\\

h_\Theta(x) &=\Theta_1f_1+\Theta_2f_2+\Theta_3f_3+ \dots
\end{align*}
$$

$\sigma^2$ is a parameter of the Gaussian Kernel, and it can be modified to increase or decrease the **drop-off** of our feature $f_i$.

Combined with looking at the values inside $\theta$, we can choose these landmarks to get the general shape of the decision boundary.

One way to get the landmarks is to put them in the **exact same** locations as all the training examples. This gives us m landmarks, with one landmark per training example.

Given example $x$:

$f_1=similarity(x,l^{(1)})$

$f_2=similarity(x,l^{(2)})$

$f_3=similarity(x,l^{(3)})$, and so on.

This gives us a **feature vector**,  $f^{(i)}$ of all our features for example $x^{(i)}$. We may also set $f_0=1$ to correspond with $\Theta_0$. Thus given training example $x^{(i)}$:

$$
x^{(i)} \rightarrow
\begin{bmatrix}
f^{(i) }_1 = similarity(x^{(i)}, l^{(1)}) \\
f^{(i) }_2 = similarity(x^{(i)}, l^{(2)}) \\
\vdots \\
f^{(i) }_m = similarity(x^{(i)}, l^{(m)}) \\
\end{bmatrix}
$$

Now to get the parameters $\Theta$ we can use the SVM minimization algorithm but with $f^{(i)}$ substituted in for $x^{(i)}$:

$$
\min_\Theta C \sum_{i=1}^m y^{(i)} Cost_1(\Theta^Tf^{(i)}) + (1-y^{(i)}) Cost_0(\Theta^T f^{(i)}) - \frac{1}{2} \sum_{j=1}^n \Theta_j^2
$$

Using kernels to generate $f^{(i)}$ is not exclusive to SVMs and may also be applied to logistic regression. However, because of computational optimizations on SVMs, kernels combined with SVMs is much faster than with other algorithms, so kernels are almost always found combined only with SVMs.

### Choosing SVM Parameters

Choosing $C$ (recall that $C=\frac{1}{λ}$)

- If $C$ is large, then we get higher variance/lower bias
- If $C$ is small, then we get lower variance/higher bias

The other parameter we must choose is $\sigma^2$ from the Gaussian Kernel function:

- With a large $\sigma^2$, the features $f_i$ vary more smoothly, causing higher bias and lower variance.
- With a small $\sigma^2$, the features $f_i$ vary less smoothly, causing lower bias and higher variance.

## Using An SVM

There are lots of good SVM libraries already written. Andrew. Ng often uses `liblinear` and `libsvm`. In practical application, you should use one of these libraries rather than rewrite the functions.

In practical application, the choices you *do* need to make are:

- Choice of parameter $C$
- Choice of kernel (similarity function)
  - No kernel ("linear" kernel) -- gives standard linear classifier. Choose when $n$ is **large** and when $m$ is **small**
  - Gaussian Kernel (above) -- need to choose $\sigma^2$. Choose when $n$ is **small** and $m$ is **large**

The library may ask you to provide the kernel function.

**Note**: do perform feature scaling before using the Gaussian Kernel.

**Note**: not all similarity functions are valid kernels. They must satisfy **Mercer's Theorem**, which guarantees that the SVM package's optimizations run correctly and do not diverge.

You want to train $C$ and the parameters for the kernel function using the **training** and **cross-validation** datasets.

### Multi-class Classification

Many SVM libraries have multi-class classification built-in.

You can use the *one-vs-all* method just like we did for logistic regression, where $y \in 1,2,3,\dots,K$ with $(\Theta^{(1)},\Theta^{()2},\dots,\Theta^{(K)}$. We pick class $i$ with the largest $(\Theta^{(i)})^Tx$.

### Logistic Regression vs. SVMs

- If $n$ is large (relative to $m$), then use logistic regression, or SVM without a kernel (the "linear kernel")
- If $n$ is small and $m$ is intermediate, then use SVM with a Gaussian Kernel
- If $n$ is small and $m$ is large, then manually create/add more features, then use logistic regression or SVM without a kernel.

In the first case, we don't have enough examples to need a complicated polynomial hypothesis. In the second example, we have enough examples that we may need a complex non-linear hypothesis. In the last case, we want to increase our features so that logistic regression becomes applicable.

**Note**: a neural network is likely to work well for any of these situations, but may be slower to train.
