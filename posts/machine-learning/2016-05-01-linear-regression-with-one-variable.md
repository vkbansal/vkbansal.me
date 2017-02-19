---
title: Linear Regression with One Variable
author: 
    name: Vivek Kumar Bansal
    site: http://vkbansal.me
date: 2016-05-01
description: My notes from Machine Learning Course by Andrew Ng.
tag:
  - notes
  - "machine-learning"
math: true
---

## Model Representation

In *regression problems*, we taking input variables and trying to fit the output onto a*continuous* expected result function.

Linear regression with one variable is also known as "univariate linear regression."

Univariate linear regression is used when you want to predict a **single output** value from a **single input** value. 

We now introduce notation for equations.

$$
\begin{align*}
m &= \text{number of training examples} \\
x 's &= \text{input variable/features} \\
y's &= \text{output variable/target variable} \\
(x, y) &= \text{one training example} \\
(x^{(i)}, y^{(i)}) &= i^{th}  \text{ training example}
\end{align*}
$$
We're doing **supervised learning** here, so that means we already have an idea about what the input/output cause and effect should be.

 So h 

We feed training set a learning algorithm. Is the job of a learning algorithm to then output a function which by convention is usually denoted lowercase $h$ and $h$ stands for **hypothesis**. And hypothesis is a function that maps from $x$'s to $y$'s.



![hypothesis](./images/hypothesis.png)
<!--{.img-center}-->

## The Hypothesis Function

Our hypothesis function has the general form: $h_\theta(x) = \theta_0 + \theta_1 x$

Note that this is like the equation of a straight line and $\theta_1$ is the slope of the line.

We give to $h_\theta(x)$ values for $\theta_0$ and $\theta_1$ to get our output $y$. In other words, we are trying to create a function called $h_\theta$ that is trying to map our input data (the $x$'s) to our output data (the $y$'s).

**Example:**

| x (input) | y (output) |
| :-------: | :--------: |
|     0     |     4      |
|     1     |     7      |
|     2     |     7      |
|     3     |     8      |

Now we can make a random guess about our $h_\theta$ function: $\theta_0=2$ and $\theta_1=2$. The hypothesis function becomes $h_\theta(x)= 2 + 2x$.

![univariate-linear-regression-hypothesis](./images/univariate-linear-regression-hypothesis.png)

<!--{.img-center}-->

The red crosses indicate $y$'s and the blue line is our hypothesis.

So for input of $1$ to our hypothesis, $y$ will be $4$. This is off by $3$. Note that we will be trying out various values of $\theta_0$ and $\theta_1$ to try to find values which provide the best possible "fit" or the most representative "straight line" through the data points mapped on the x-y plane.

## Cost Function

We can measure the accuracy of our hypothesis function by using a **cost function**. This takes an average (actually a fancier version of an average) of all the results of the hypothesis with inputs from x's compared to the actual output y's.

$$
J(\theta_0, \theta_1) = \dfrac {1} {2m} \displaystyle \sum _{i=1}^m \left ( h_\theta(x_{i}) - y_{i}\right)^2
$$
This function is otherwise called the **Squared error function**, or **Mean squared error**. The mean is halved ($\dfrac {1}{2m}$) as a convenience for the computation of the gradient descent, as the derivative term of the square function will cancel out the $\dfrac {1}{2}$ term.

To break it apart, it is $\dfrac {1}{2} \bar x$ where $\bar x$ is the mean of the squares of $h_\theta(x_{i})−y_{i}$, or the difference between the predicted value and the actual value as it can be seen in figure below.

![univariate-linear-regression-hypothesis](./images/univariate-linear-regression-error.png)

<!--{.img-center}-->

We are trying to make straight line (defined by $h_\theta(x)$) which passes through our set of data. Our objective is to get the best possible line. The best possible line will be such so that the average distances of the scattered points from the line will be the least. In the best case, the line should pass through all the points of our training data set. In such a case the value of $J(\theta_0,\theta_1)$ will be $0$.

## Gradient Descent

So we have our hypothesis function and we have a way of measuring how accurate it is. Now what we need is a way to automatically improve our hypothesis function. That's where gradient descent comes in.

If we graph our hypothesis function based on its fields $\theta_0$ and $\theta_1$.We put $\theta_0$ on the x axis and $\theta_1$ on the y axis, with the cost function on the vertical z axis. The points on our graph will be the result of the **cost function** using our hypothesis with those specific theta parameters. We are not graphing $x $and $y$ itself, but the parameter range of our hypothesis function and the cost resulting from selecting particular set of parameters.

![Gradient Descent](./images/gradient-descent.png)

<!--{.img-center}-->

We will know that we have succeeded when our cost function is at the very bottom of the pits in our graph, i.e. when its value is the minimum.

The way we do this is by taking the **derivative** (the line tangent to a function) of our cost function. The slope of the tangent is the derivative at that point and it will give us a direction to move towards. We make steps down that derivative by the parameter $\alpha$, called the **learning rate**, until we reach a local minima.

The gradient descent algorithm is:

$$
\begin{alignat}{0}
\text {repeat until convergence: } \lbrace \\
\hspace{2em} \theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j}  J(\theta_0, \theta_1)\\
\rbrace  \hspace{2em}  \text {for } j = 0 \text{ and } j = 1
\end{alignat}
$$

Note: We need to use simultaneous updates
$$
\begin{align*}
temp0 &:= \theta_0 - \alpha \frac{\partial}{\partial \theta_0} J (\theta_0, \theta_1) \\
temp1 &:= \theta_1 - \alpha \frac{\partial}{\partial \theta_1} J (\theta_0, \theta_1) \\
\theta_0 &:= temp0 \\
\theta_1 &:= temp1\\
\end{align*}
$$


Intuitively, this could be thought of as:

$$
\begin{align*}
& \text{repeat until convergence: } \lbrace & \newline 
& \hspace{2em} \theta_j:= \theta_j - \alpha[\text{Slope of tangent in j dimension}] \newline
& \rbrace \\
\end{align*}
$$

## Gradient Descent for Linear Regression

When specifically applied to the case of linear regression, a new form of the gradient descent equation can be derived. We can substitute our actual cost function and our actual hypothesis function and modify the equation to (the derivation of the formulas can be found at end):

$$
\begin{align*}
& \text{repeat until convergence: } \lbrace & \newline 
& \hspace{2em} \theta_0 :=  \theta_0 - \alpha \frac{1}{m} \sum\limits_{i=1}^{m}(h_\theta(x_{i}) - y_{i}) \newline
& \hspace{2em} \theta_1 :=  \theta_1 - \alpha \frac{1}{m} \sum\limits_{i=1}^{m}\left((h_\theta(x_{i}) - y_{i}) x_{i}\right) \newline
& \rbrace \newline
\end{align*}
$$

where $m$ is the size of the training set, $\theta_0$ a constant that will be changing simultaneously with $\theta_1$ and $x_i$, $y_i$ are values of the given training set (data).

Note that we have separated out the two cases for $\theta_j$ into separate equations for $ \theta_0$ and $\theta_1$; and that for $\theta_1$ we are multiplying $x_i$ at the end due to the derivative.

The point of all this is that if we start with a guess for our hypothesis and then repeatedly apply these gradient descent equations, our hypothesis will become more and more accurate.

## Gradient Descent for Linear Regression: Intuition

Let us start with simple hypothesis $h_\theta =  \theta_1 x$. (i.e  $\theta_0 = 0$)

If we plot a graph between parameter $\theta_1$ and cost function $J(\theta_1)$, it will look something like this.

![Parabola](./images/parabola.png)

<!--{.img-center}-->

Suppose we start with $\theta_1$ that has positive slope:

![Parabola](./images/parabola-p-slope.png)

<!--{.img-center}-->

The $\theta_1$ value will be updated as $\theta_1 := \theta_1 - \alpha [\text{positive number}]$, thus $\theta_1$ will  decrease until it reaches local minima.

On the other hand, if we start with $\theta_1$ with negative slope:

![Parabola -ve](./images/parabola-n-slope.png)

<!--{.img-center}-->

The $\theta_1$ value will be updated as $\theta_1 := \theta_1 - \alpha [\text{negative number}]$, thus $\theta_1$ will increase until it reaches local minima.

If $\alpha$ is too small, gradient descent can be too slow, where as if it is too large, it can overshoot the minima. It may fail to converge, or even diverge.

Gradient descent can converge to a local minimum, even with the learning rate $\alpha$ fixed.

As we approach a local minimum, gradient descent will automatically take smaller steps. So, no need to decrease $\alpha$ over time. 

The same can be extended to hypothesis: $h_\theta (x)= \theta_0 + \theta_1 x$. The plot for cost function in this case will be a surface plot:

![Gradient Descent](./images/gradient-descent.png)

<!--{.img-center}-->

If we start from any arbitrary point on the graph and apply gradient descent (using slope at that point), we will reach a minima eventually.

## Frequently Asked Questions:

**Q: Why is the cost function about the sum of squares, rather than the sum of cubes?**

A: The sum of squares isn’t the only possible cost function, but it has many nice properties. Squaring the error means that an overestimate is "punished" just the same as an underestimate: an error of $-1$ is treated just like $+1$, and the two equal but opposite errors can’t cancel each other. If we cube the error, we lose this property. Big errors are punished more than small ones, so an error of $2$ becomes $4$.

The squaring function is smooth (can be differentiated) and yields linear forms after differentiation, which is nice for optimization. It also has the property of being “convex”. A convex cost function guarantees there will be a global minimum, so our algorithms will converge.

**Q: Why can’t I use 4th powers in the cost function? Don’t they have the nice properties of squares?**

A: Imagine that you are throwing darts at a dartboard, or firing arrows at a target. If you use the sum of squares as the error (where the center of the bulls-eye is the origin of the coordinate system), the error is the distance from the center. Now rotate the coordinates by 30 degree, or 45 degrees, or anything. The distance, and hence the error, remains unchanged. 4th powers lack this property, which is known as “rotational invariance”.

**Q: Why does 1/(2 \* m) make the math easier?**

A: When we differentiate the cost to calculate the gradient, we get a factor of 2 in the numerator, due to the exponent inside the sum. This '2' in the numerator cancels-out with the '2' in the denominator, saving us one math operation in the formula.

## Derivation of Gradient Descent Equations

We know that hypothesis is $h_\theta = \theta_0 + \theta_1 x$, and cost function is:
$$
J(\theta_0, \theta_1) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta (x^{(i)}) - y^{(i)}\right)^2
$$
Solving for derivatives:
$$
\begin{align*}
\frac{\partial}{\partial \theta_0} J(\theta_0, \theta_1) & = \frac{\partial}{\partial \theta_0} \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta (x^{(i)}) - y^{(i)}\right)^2 \\
&= \frac{\partial}{\partial \theta_0} \frac{1}{2m} \sum_{i=1}^{m} \left( \theta_0 + \theta_1 x ^{(i)}- y^{(i)}\right)^2 \\
&= \frac{\partial}{\partial \theta_0} \frac{1}{2m} \sum_{i=1}^{m} \left( \theta_0^2 + \theta_1^2 ( x^{(i)})^2+ (y^{(i)})^2 + 2 \theta_0 \theta_1x^{(i)} - 2 \theta_0 y^{(i)} - 2 \theta_1x^{(i)}y^{(i)} \right) \\
&= \frac{1}{2m} \sum_{i=1}^{m} \left(2 \theta_0  + 2 \theta_1x^{(i)} - 2 y^{(i)}  \right) \\
&= \frac{1}{m} \sum_{i=1}^{m} \left( \theta_0  + \theta_1x^{(i)} - y^{(i)}  \right) \\
&=  \frac{1}{m} \sum_{i=1}^{m} \left(  h_\theta(x^{(i)}) - y^{(i)}  \right) \\ \\
\frac{\partial}{\partial \theta_1} J(\theta_0, \theta_1) & = \frac{\partial}{\partial \theta_1} \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta (x^{(i)}) - y^{(i)}\right)^2 \\
&= \frac{\partial}{\partial \theta_1} \frac{1}{2m} \sum_{i=1}^{m} \left( \theta_0 + \theta_1 x ^{(i)}- y^{(i)}\right)^2 \\
&= \frac{\partial}{\partial \theta_1} \frac{1}{2m} \sum_{i=1}^{m} \left( \theta_0^2 + \theta_1^2 ( x^{(i)})^2+ (y^{(i)})^2 + 2 \theta_0 \theta_1x^{(i)} - 2 \theta_0 y^{(i)} - 2 \theta_1x^{(i)}y^{(i)} \right) \\
&= \frac{1}{2m} \sum_{i=1}^{m} \left(2 \theta_1 (x^{(i)})^2  + 2 \theta_0x^{(i)} - 2 x^{(i)}y^{(i)}  \right) \\
&= \frac{1}{m} \sum_{i=1}^{m} \left( \theta_0  + \theta_1x^{(i)} - y^{(i)}  \right) x^{(i)} \\
&=  \frac{1}{m} \sum_{i=1}^{m} \left(  h_\theta(x^{(i)}) - y^{(i)}  \right) x^{(i)}
\end{align*}
$$

