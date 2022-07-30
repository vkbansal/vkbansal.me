---
layout: 'layouts/Blog.astro'
title: 'Neural Networks: Learning'
date: 2016-05-14
description: My notes from Machine Learning Course by Andrew Ng.
tags:
  - notes
  - 'machine-learning'
math: true
---

import Blog from 'layouts/Blog.astro';

<Blog content={frontmatter}>

## Cost Function

Let's first define a few variables that we will need to use:

$$
\begin{align*}
L &= \text{total number of layers in the network}\\
s_l &= \text{number of units (not counting bias unit) in layer }l \\
K &= \text{number of output units/classes}
\end{align*}
$$

Recall that in neural networks, we may have many output nodes. We denote $h_\Theta(x)_k$ as being a hypothesis that results in the $k^{th}$ output.

Our cost function for neural networks is going to be a generalization of the one we used for logistic regression.

Recall that the cost function for regularized logistic regression was:

$$
J(\theta)=\frac{−1}{m} \sum_{i=1}^{m}\left[y^{(i)} log(h_\theta(x^{(i)}))+(1−y^{(i)}) log(1−h_\theta(x^{(i)}))\right]+\frac{\lambda}{2m} \sum_{j=1}^{n} \theta_j^2
$$

For neural networks, it is going to be slightly more complicated:

$$
J(\Theta)=\frac{−1}{m}\left[ \sum_{i=1}^{m} \sum_{k=1}^{K} y^{(i)}_klog((h_\Theta(x^{(i)}))_k)+(1−y^{(i)}_k) log(1−(h_\Theta(x^{(i)}))_k)\right]+\frac{\lambda}{2m}\sum_{l=1}^{L−1} \sum_{i=1}^{s_l} \sum_{j=1}^{s_{l+1}}(\Theta^{(l)}_{j,i})^2
$$

We have added a few nested summations to account for our multiple output nodes. In the first part of the equation, between the square brackets, we have an additional nested summation that loops through the number of output nodes.

In the regularization part, after the square brackets, we must account for multiple theta matrices. The number of columns in our current theta matrix is equal to the number of nodes in our current layer (including the bias unit). The number of rows in our current theta matrix is equal to the number of nodes in the next layer (excluding the bias unit). As before with logistic regression, we square every term.

Note:

- The double sum simply adds up the logistic regression costs calculated for each cell in the output layer; and.
- The triple sum simply adds up the squares of all the individual $\Theta$s in the entire network.
- The $i$ in the triple sum does **not** refer to training example $i$.

## Backpropagation Algorithm

**Backpropagation** is neural-network terminology for minimizing our cost function, just like what we were doing with gradient descent in logistic and linear regression.

Our goal is to compute:

$$
\min_\Theta J(\Theta)
$$

That is, we want to minimize our cost function $J$ using an optimal set of parameters in theta.

In this section we'll look at the equations we use to compute the partial derivative of $J(\Theta)$:

$$
\frac{\partial}{\partial \Theta^{(l)}_{i,j}} J(\Theta)
$$

In backpropagation we're going to compute for every node:

$$
\delta^{(l)}_j = error \text{ of node} j \text{ in layer } l
$$

Recall that $a^{(l)}_j$ is activation node $j$ in layer $l$.

For the **last layer**, we can compute the vector of delta values with:

$$
\delta^{(L)} = a^{(L)} - y
$$

Where $L​$ is our total number of layers and $a^{(L)}​$ is the vector of activation units for the last layer. So our **error values** for the last layer are simply the differences of our actual results in the last layer and the correct outputs in $y​$.

To get the delta values of the layers before the last layer, we can use an equation that steps us back from right to left:

$$
\delta^{(l)} = ((\Theta^{(l)})^T \delta^{(l+1)}).*g'(z^{(l)})
$$

The delta values of layer $l$ are calculated by multiplying the delta values in the next layer with the theta matrix of layer $l$. Here $\Theta$ **does not include** bias terms. We then element-wise multiply that with a function called $g'$, or g-prime, which is the derivative of the activation function $g$ evaluated with the input values given by $z^{(l)}$.

The g-prime derivative terms can also be written out as:

$$
g'(z^{(l)}) = a^{(l)}.*(1-a^{(l)})
$$

The full backpropagation equation for the inner nodes is then:

$$
\delta^{(l)} = \left( (\Theta^{(l)})^T \delta^{(l+1)} \right).* \space a^{(l)} .* \space (1-a^{(l)})
$$

We can compute our partial derivative terms by multiplying our activation values and our error values for each training example $t$:

$$
\frac{\partial J(\Theta)}{\partial \Theta_{i,j}} = \frac{1}{m} \sum_{t=1}^m a^{(t)(l)}_j \delta^{(t)(l+1)}_i
$$

Vectorized implementation:

$$
\Delta^{(l)} = \delta^{(l +1)}(a^{(l)})^T
$$

This however ignores regularization, which we'll deal with later.

We can now take all these equations and put them together into a backpropagation algorithm:

**Backpropagation Algorithm**

- Given training set $\{(x^{(1)},y^{(1)}), \dots, (x^{(m)},y^{(m)})\}$
- Set $\Delta^{(l)}_{i,j} :=0$ for all $(l,i,j)$
- For training example $t=1$ to $m$:
  - Set $a^{(1)} :=x^{(t)}$
  - Perform forward propagation to compute $a^{(l)}$ for $l=2,3, \dots,L$
  - Using $y^{(t)}$, compute $\delta^{(L)}=a^{(L)}−y^{(t)}$
  - Compute $\delta^{(L−1)},\delta^{(L−2)},\dots,\delta^{(2)}$ using $\delta^{(l)}= \left( (\Theta^{(l)})^T \delta^{(l+1)}\right) .* g'(z^{(l)})$
  - $\Delta^{(l)}_{i,j} := \Delta^{(l)}_{i,j} + a^{(l)}_j \delta^{(l+1)}_i$ or with vectorization, $\Delta^{(l)} :=\Delta^{(l)}+\delta^{(l+1)}(a^{(l)})^T$
- $D^{(l)}_{i,j} := \frac{1}{m} \Delta^{(l)}_{i,j} + \lambda \Theta^{(l)}_{i,j}$. **If** $j \neq 0$.
- $D^{(l)}_{i,j} := \frac{1}{m} \Delta^{(l)}_{i,j}$ . **If** $j=0$

The capital-delta matrix is used as an **accumulator** to add up our values as we go along and eventually compute our partial derivative.

The actual proof is quite involved, but, the $D^{(l)}_{i,j}$ terms are the partial derivatives and the results we are looking for:

$$
D^{(l)}_{i,j} = \frac{\partial J(\Theta)}{\partial \Theta^{(l)}_{i,j}}
$$

## Backpropagation Intuition

The cost function is:

$$
J(\Theta)=\frac{−1}{m}\left[ \sum_{i=1}^{m} \sum_{k=1}^{K} y^{(i)}_klog((h_\Theta(x^{(i)}))_k)+(1−y^{(i)}_k) log(1−(h_\Theta(x^{(i)}))_k)\right]+\frac{\lambda}{2m}\sum_{l=1}^{L−1} \sum_{i=1}^{s_l} \sum_{j=1}^{s_{l+1}}(\Theta^{(l)}_{j,i})^2
$$

If we consider simple non-multiclass classification (k = 1) and disregard regularization, the cost is computed with:

$$
cost(t) = y^{(t)} \space log(h_\theta(x^{(t)})) + (1 - y^{(t)}) \space log(1 - h_\theta(x^{(t)}))
$$

More intuitively you can think of that equation roughly as:

$$
cost(t) \approx (h_\theta(x^{(t)}) -  y ^{(t)})^2
$$

Intuitively, $\delta^{(l)}_j$ is the **error** for $a^{(l)}_j$ (unit $j$ in layer $l$).

More formally, the delta values are actually the derivative of the cost function:

$$
\delta^{(l)}_j = \frac{\partial}{\partial z^{(l)}_j} cost(t)
$$

Recall that our derivative is the slope of a line tangent to the cost function, so the steeper the slope the more incorrect we are.

Note: In lecture, sometimes $i$ is used to index a training example. Sometimes it is used to index a unit in a layer. In the Back Propagation Algorithm described here, $t$ is used to index a training example rather than overloading the use of $i$.

## Implementation Note: Unrolling Parameters

With neural networks, we are working with sets of matrices:

$$
\Theta_1, \Theta_2, \Theta_3, \dots \\
D_1, D_2, D_3,  \dots
$$

In order to use optimizing functions such as `fminunc()`, we will want to **unroll** all the elements and put them into one long vector:

```octave
thetaVector = [ Theta1(:); Theta2(:); Theta3(:); ]
deltaVector = [ D1(:); D2(:); D3(:) ]
```

If the dimensions of Theta1 is $10 \times 11$, Theta2 is $10 \times 11$ and Theta3 is $1 \times 11$, then we can get back our original matrices from the **unrolled** versions as follows:

```octave
Theta1 = reshape(thetaVector(1:110),10,11)
Theta2 = reshape(thetaVector(111:220),10,11)
Theta3 = reshape(thetaVector(221:231),1,11)
```

## Gradient Checking

Gradient checking will assure that our backpropagation works as intended.

We can approximate the derivative of our cost function with:

$$
\frac{\partial}{\partial \Theta} J (\Theta) \approx  \frac{J(\Theta + \epsilon) - J(\Theta - \epsilon)}{2 \epsilon}
$$

With multiple theta matrices, we can approximate the derivative **with respect to** $\Theta_j$ as follows:

$$
\frac{\partial}{\partial \Theta_j} J(\Theta) \approx \frac{J(\Theta_1, \dots, \Theta_{j+ \epsilon}, \dots, \Theta_n) - J(\Theta_1, \dots, \Theta_{j - \epsilon}, \dots, \Theta_n)}{2 \epsilon}
$$

A good small value for $\epsilon$ (epsilon), guarantees the math above to become true. If the value be much smaller, may we will end up with numerical problems. The professor Andrew usually uses the value $\epsilon = 10^{−4}$.

We are only adding or subtracting epsilon to the $\Theta_j$ matrix. In octave we can do it as follows:

```octave
epsilon = 1e-4;
for i = 1:n,
  thetaPlus = theta;
  thetaPlus(i) += epsilon;
  thetaMinus = theta;
  thetaMinus(i) -= epsilon;
  gradApprox(i) = (J(thetaPlus) - J(thetaMinus))/(2*epsilon)
end;
```

We then want to check that gradApprox ≈ deltaVector.

Once you've verified **once** that your backpropagation algorithm is correct, then you don't need to compute gradApprox again. The code to compute gradApprox is very slow.

## Random Initialization

Initializing all theta weights to zero does not work with neural networks. When we backpropagate, all nodes will update to the same value repeatedly.

Instead we can randomly initialize our weights:

Initialize each $\Theta^{(l)}_{i,j}$ to a random value between $[− \epsilon, \epsilon]$.

```octave
% If the dimensions of Theta1 is 10x11, Theta2 is 10x11 and Theta3 is 1x11.

Theta1 = rand(10,11) * (2 * INIT_EPSILON) - INIT_EPSILON;
Theta2 = rand(10,11) * (2 * INIT_EPSILON) - INIT_EPSILON;
Theta3 = rand(1,11) * (2 * INIT_EPSILON) - INIT_EPSILON;
```

`rand(x,y)` will initialize a matrix of random real numbers between $0$ and $1$. (Note: this _epsilon_ is unrelated to the _epsilon_ from Gradient Checking)

## Putting it Together

First, pick a network architecture; choose the layout of your neural network, including how many hidden units in each layer and how many layers total.

- Number of input units = dimension of features $x^{(i)}$
- Number of output units = number of classes
- Number of hidden layers = Reasonable default of 1 or if more than 1 hidden layer, then the same number of units in every hidden layer.
- Number of hidden units per layer = usually more the better (must balance with cost of computation as it increases with more hidden units)

**Training a Neural Network**

1. Randomly initialize the weights
2. Implement forward propagation to get $h_\Theta(x^{(i)})$
3. Implement the cost function $J(\Theta)$
4. Implement backpropagation to compute partial derivatives $\frac{\partial J(\Theta)}{\partial \Theta^{(l)}_{i,j}}$
5. Use gradient checking to compare $\frac{\partial J(\Theta)}{\partial \Theta^{(l)}_{i,j}}$ computed using backpropagation and using numerical estimate of gradient. Then disable gradient checking.
6. Use gradient descent or a built-in optimization function to minimize the cost function with the weights in theta.

When we perform forward and back propagation, we loop on every training example:

$$
\begin{align*}
&\text{for } i = 1:m \\
& \hspace{2em} \text{Perform forward propagation and backpropagation using example } (x^{(i)},y^{(i)}) \\
& \hspace{2em} \text{(Get activations } a^{(l)} \text{ and delta terms } \delta^{(l)} \text{ for }  l = 2,\dots,L \text{)}
   \end{align*}
$$

## Explanation of Derivatives Used in Backpropagation

We know that for a logistic regression classifier (which is what all of the output neurons in a neural network are), we use the cost function, $J(\theta)=−y \space log(h_\theta(x))−(1−y)\space log(1 − h_\theta(x))$, and apply this over the $K$ output neurons, and for all $m$ examples.

The equation to compute the partial derivatives of the theta terms in the output neurons can be written as:

$$
\frac{\partial J(\theta)}{\partial \theta^{(L-1)}} = \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L)}} \frac{\partial z^{(L)}}{\partial \theta^{(L-1)}}
$$

And the equation to compute partial derivatives of the theta terms in the [last] hidden layer neurons (layer $L-1$) can be written as:

$$
\frac{\partial J(\theta)}{\partial \theta^{(L-2)}} = \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L-1)}} \frac{\partial z^{(L-1)}}{\partial a^{(L-1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-2)}} \frac{\partial z^{(L-2)}}{\partial \theta^{(L-2)}}
$$

Clearly they share some pieces in common, so a delta term ($\delta(L)$) can be used for the common pieces between the output layer and the hidden layer immediately before it (with the possibility that there could be many hidden layers if we wanted):

$$
\delta^{(L)} = \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L)}}
$$

And we can go ahead and use another delta term $\delta^{(L−1)}$ for the pieces that would be shared by the final hidden layer and a hidden layer before that, if we had one. Regardless, this delta term will still serve to make the math and implementation more concise.

$$
\begin{align*}
\delta^{(L-1)} &= \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L)}} \frac{\partial z^{(L)}}{\partial a^{(L -1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-1)}} \\
&=\delta^{(L)} \frac{\partial z^{(L)}}{\partial a^{(L -1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-1)}}
\end{align*}
$$

With these delta terms, our equations become:

$$
\begin{align*}
\frac{\partial J(\theta)}{\partial \theta^{(L-1)}} &= \delta^{(L)} \frac{\partial z^{(L)}}{\partial \theta^{(L-1)}} \\
\frac{\partial J(\theta)}{\partial \theta^{(L-2)}} &= \delta^{(L-1)} \frac{\partial z^{(L-1)}}{\partial \theta^{(L-2)}} \\
\end{align*}
$$

Now, time to evaluate these derivatives:

Let's start with the output layer:

$$
\begin{align*}
\frac{\partial J(\theta)}{\partial \theta^{(L - 1 )}}
& =  \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L)}} \frac{\partial z^{(L)}}{\partial \theta^{(L - 1)}} \\
&= \delta^{(L)} \frac{\partial z^{(L)}}{\partial \theta^{(L - 1)}}
\end{align*}
$$

Given $J(\theta)=−y \space log(a^{(L)})−(1−y) \space log(1−a^{(L)})$, where $a^{(L)}=h_\theta(x)$, the partial derivative is:

$$
\frac{\partial J(\theta)}{\partial a^{(L)}} = \frac{-y}{a^{(L)}} - \frac{(1-y)}{1-a^{(L)}}
$$

And given $a=g(z)$, where $g=\frac{1}{1+e^{−z}}$, the partial derivative is:

$$
\frac{\partial a^{(L)}}{\partial z^{(L)}} = a^{(L)}(1-a^{(L)})
$$

So, let's substitute these in for $\delta(L)$:

$$
\begin{align*}
\delta(L)
&=  \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L)}} \\ \\
&= \left(  \frac{-y}{a^{(L)}} - \frac{(1-y)}{1-a^{(L)}} \right) a^{(L)}(1-a^{(L)}) \\ \\
&= -y(1-a^{(L)}) - a^{(L)}(1-y) \\ \\
&= a^{(L)} -y
\end{align*}
$$

Now, given $z=\theta ∗ input$, and in layer $L$ the $input$ is $a^{(L−1)}$, the partial derivative is:

$$
\frac{\partial z^{(L)}}{\partial \theta^{(L-1)}} = a^{(L-1)}
$$

Putting it together for the output layer:

$$
\begin{align*}
\frac{\partial J(\theta)}{\partial \theta^{(L - 1 )}}
&= \delta^{(L)} \frac{\partial z^{(L)}}{\partial \theta^{(L - 1)}} \\ \\
&= (a^{(L)} -y) \space a^{(L-1)}
\end{align*}
$$

Let's continue on for the hidden layer (assuming we only have 1 hidden layer):

$$
\begin{align*}
\frac{\partial J(\theta)}{\partial \theta^{(L-2)}}
&= \frac{\partial J(\theta)}{\partial a^{(L)}} \frac{\partial a^{(L)}}{\partial z^{(L-1)}} \frac{\partial z^{(L-1)}}{\partial a^{(L-1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-2)}} \frac{\partial z^{(L-2)}}{\partial \theta^{(L-2)}} \\ \\
&=\delta^{(L)} \frac{\partial z^{(L)}}{\partial a^{(L -1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-1)}} \\ \\
&= \delta^{(L-1)} \frac{\partial z^{(L-1)}}{\partial \theta^{(L-2)}} \\
\end{align*}
$$

Let's compute $\delta^{(L - 1)}$. Once again, given $z=θ ∗ input$, the partial derivative is:

$$
\frac{\partial z^{(L)}}{\partial a^{(L-1)}} = \theta^{(L-1)}
$$

And given $a=g(z)$, where $g=\frac{1}{1+e^{−z}}$, the partial derivative is:

$$
\frac{\partial a^{(L-1)}}{\partial z^{(L-1)}} = a^{(L-1)}(1-a^{(L-1)})
$$

So, let's substitute these in $\delta^{(L−1)}$:

$$
\begin{align*}
\delta^{(L-1)}
&=\delta^{(L)} \frac{\partial z^{(L)}}{\partial a^{(L -1)}} \frac{\partial a^{(L-1)}}{\partial z^{(L-1)}} \\ \\
&= \delta^{(L)} \theta^{(L-1)} a^{(L-1)}(1-a^{(L-1)}) \\ \\
&= \delta^{(L)} \theta^{(L-1)} g'(a^{(L-1)})
\end{align*}
$$

Put it together for the [last] hidden layer:

$$
\begin{align*}
\frac{\partial J(\theta)}{\partial \theta^{(L - 2)}}
&= \delta^{(L-1)} \frac{\partial z^{(L-1)}}{\partial \theta^{(L-2)}} \\ \\
&=  \delta^{(L)}  \theta^{(L-1)}  a^{(L-1)} (1 -  a^{(L-1)})  a^{(L-2)}
\end{align*}
$$

</Blog>
