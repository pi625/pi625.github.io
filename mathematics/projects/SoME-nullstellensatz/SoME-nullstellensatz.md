---
layout: post
title: "The Polynomial Cheat Code: From Sumsets to the Nullstellensatz"
date: 2026-08-16
ref: nullstellensatz
excerpt: "How a single non-zero polynomial coefficient can obliterate combinatorics problems — from Cauchy-Davenport and IMO 2007/6 all the way to the 2016 cap-set breakthrough."
tags: [3B1B, SoME 5, Combinatorics, Algebra]
math: true
---

<link rel="stylesheet" href="{% include post_asset.html file='widgets.css' %}">

There is a move that keeps reappearing in combinatorics, and once you have seen
it a few times it stops looking like a trick and starts looking like a law of
nature. You have a discrete problem — count the distinct sums of two sets, cover
a grid of lattice points with planes, colour a graph from prescribed lists — and
every elementary attack drowns in cases. Then someone writes down a polynomial,
points at *one* of its coefficients, checks that this single number is not zero,
and the problem is finished. No bijection, no induction on a cleverly chosen
parameter, no extremal configuration to chase. Just: *this number isn't zero, so
the configuration you wanted has to exist.*

That is the **polynomial method**, and the sharpest single instrument inside it is
Noga Alon's **Combinatorial Nullstellensatz**. This article builds that instrument
from nothing and then swings it at progressively harder targets. We start with a
puzzle you can check on your fingers and end at a 2016 result that broke a barrier
which had stood, essentially untouched, for almost thirty years. Along the way the
same two-line reflex will dispatch an International Mathematical Olympiad problem,
reprove a theorem from 1813, and settle a question in graph colouring that looks
like it belongs to a different subject entirely.

A word on the shape of the thing. Every argument here has exactly two stages.
First you **encode**: you translate the combinatorial object into a polynomial (or,
at the very end, a tensor) whose vanishing mirrors the property you care about.
Then you **read one number**: you locate a coefficient you can actually compute,
observe it is non-zero, and let the rigidity of polynomials force the rest. The
craft is entirely in the encoding — in choosing the polynomial so that the
coefficient you can control is the coefficient that matters. Everything else is
bookkeeping. If you keep those two stages in mind, the dozen theorems below will
feel less like a list and more like one theorem told a dozen ways.

The widgets are not decoration. Each one *is* the argument of its section, made
tactile — a place to build the sets, drag the points, watch the coefficient
change sign, and convince yourself that the claim is forced rather than merely
asserted. Play with them. That is where the intuition actually lives.

## The sumset puzzle

Fix a prime $p$ and take two non-empty subsets $A, B \subseteq \mathbb{Z}_p$,
where $\mathbb{Z}_p = \{0, 1, \dots, p-1\}$ is the integers with arithmetic done
modulo $p$. Their **sumset** is every value you can reach by adding one element of
each:

$$ A + B = \{\, a + b \pmod p : a \in A,\ b \in B \,\}. $$

The question that starts everything is disarmingly simple: *how small can
$|A+B|$ be?* You have $|A|\cdot|B|$ ordered pairs to add, but collisions can be
brutal, so the size of the output is genuinely in doubt.

Over the ordinary integers there is no puzzle at all, and it is worth seeing why,
because the reason is exactly what breaks modulo $p$. Suppose
$A = \{a_1 < a_2 < \dots < a_m\}$ and $B = \{b_1 < b_2 < \dots < b_n\}$ are sets
of *integers*. Then the following chain is strictly increasing:

$$ a_1 + b_1 \;<\; a_1 + b_2 \;<\; \dots \;<\; a_1 + b_n \;<\; a_2 + b_n \;<\; \dots \;<\; a_m + b_n. $$

Count the terms: we walked up the $b$'s once ($n$ of them) and then up the
remaining $a$'s ($m-1$ of them), giving $m + n - 1$ strictly increasing, hence
distinct, sums. So over $\mathbb{Z}$ we always have
$|A+B| \ge |A| + |B| - 1$, and *ordering does the entire job.* There is a smallest
sum, a largest sum, and a monotone staircase connecting them; nothing can
collapse.

Now reduce everything modulo $p$. The number line curls into a circle. In
$\mathbb{Z}_7$ we have $5 + 5 = 3$: adding can send you *backwards*. There is no
largest element to pin the top of the staircase to, and no smallest to anchor the
bottom. Sums wrap around and land on top of each other, and it is entirely
unclear whether the integer bound $|A|+|B|-1$ survives the folding. Maybe on a
circle two clever sets can share almost all their sums and force $|A+B|$ down near
$\max(|A|,|B|)$.

Before reading on, get your hands dirty. Pick a prime, build $A$ (red) and $B$
(blue) by clicking residues on the clock, and watch $A+B$ (green) appear. Try
honestly to make the green set small.

<div class="widget" id="sumset-playground">
  <p class="widget-title">Widget · The Sumset Playground</p>
  <div class="sp-controls">
    <label>Prime $p$:
      <select class="sp-prime"></select>
    </label>
    <span class="sp-stat">|A| = <b class="sp-a">0</b> · |B| = <b class="sp-b">0</b> · |A+B| = <b class="sp-s">0</b></span>
    <span class="sp-bound"></span>
  </div>
  <div class="sp-mode">
    Click a number to add it to
    <button type="button" class="sp-tab is-on" data-set="A">A</button>
    <button type="button" class="sp-tab" data-set="B">B</button>
    <button type="button" class="sp-clear">clear</button>
    <label class="sp-lines-lab"><input type="checkbox" class="sp-lines" checked> show sum chords</label>
  </div>
  <canvas class="sp-canvas" aria-label="clock of Z_p; click to build sets A and B"></canvas>
  <p class="sp-hint">Red = A, blue = B, green ring = A+B. The faint chords connect each
    $a$ and $b$ to their sum $a+b$ — watch how many chords pile onto the same green
    node when the sumset is small.</p>
</div>

Spend a minute and you will discover a floor you cannot break through:

$$ |A + B| \;\ge\; \min\{\,p,\ |A| + |B| - 1\,\}. $$

Two features of that bound deserve comment. The $|A|+|B|-1$ term is the integer
bound, refusing to die even after the folding. And the $\min$ with $p$ is forced:
once $A$ and $B$ are large enough that $|A|+|B|-1$ would exceed $p$, the sumset
simply cannot exceed the whole group, so it saturates at $p$. In fact when
$|A|+|B| > p$ the sumset is *all* of $\mathbb{Z}_p$ — we will prove that
cleanly later, and you can already feel it in the widget.

The bound is also tight, which means we are not going to be able to improve it and
should stop trying. Take $A = B = \{0, 1, \dots, k\}$, an arithmetic progression.
Then $A + B = \{0, 1, \dots, 2k\}$, which has exactly $2k + 1 = |A| + |B| - 1$
elements (as long as $2k < p$). Arithmetic progressions are the extremal
configurations — the sets that make the sumset as small as it is allowed to be.
That is a recurring theme in additive combinatorics: structure, in the form of
progressions and subgroups, is exactly what minimises sumset growth.

What you have rediscovered by hand is one of the oldest theorems in the subject.

> **Cauchy–Davenport.** For a prime $p$ and non-empty $A, B \subseteq \mathbb{Z}_p$,
> $$ |A + B| \ge \min\{\,p,\ |A| + |B| - 1\,\}. $$

Cauchy proved this in 1813, as a lemma on the road to a result about quadratic
residues; Davenport rediscovered it, unaware of Cauchy, in 1935. The classical
proofs are combinatorial rearrangement arguments — the "$e$-transform" pushes
elements between the two sets while controlling how the sumset can change, and it
works, but it is fiddly and it does not obviously generalise. We are going to get
Cauchy–Davenport, *and* a dozen statements that the rearrangement method cannot
touch, from a single algebraic reflex. But to do that we first have to learn how
to turn a set into a polynomial.

Hold onto one image from the widget as we cross over: the clock is really a
picture of *roots*. Each element of a set is a place where something vanishes.
And the very first fact any algebra course teaches — a non-zero polynomial of
degree $d$ has at most $d$ roots — is, once you push it into several variables,
the entire engine of everything that follows.

## The encoding, and the univariate hammer

Here is the pivot the whole subject turns on. Given a set
$A = \{a_1, \dots, a_m\} \subseteq \mathbb{F}$ (I will write $\mathbb{F}$ for a
field, which for now you can read as $\mathbb{Z}_p$), encode it by the polynomial
whose roots are exactly its elements:

$$ P_A(x) = \prod_{i=1}^{m} (x - a_i). $$

Then $P_A(a) = 0$ **if and only if** $a \in A$. Membership in a set has become
*roothood* of a polynomial. This is the bridge between the two banks of the
river: combinatorics — sets, sizes, sums — on the left; algebra — polynomials,
degrees, coefficients — on the right. Every single argument in this article is a
round trip across that bridge. You state a combinatorial fact, translate it into a
statement about a polynomial, use the rigidity of polynomials to prove *that*, and
translate back.

Why is the algebra side the easy side? Because polynomials are **rigid** in a way
that finite sets are not. A set is just a bag of elements; it has no shape you can
exploit. A polynomial has a degree — a hard, finite budget — and that budget
strictly limits how it can behave. The one-variable version of that limit is worth
stating in the exact form we will keep reaching for.

> **The univariate hammer.** A polynomial of degree $\le d$ that vanishes at
> $d + 1$ distinct points is identically zero.

The proof is one line and you have seen it: each root $r$ lets you factor out
$(x - r)$, and $d+1$ distinct linear factors would give something of degree
$\ge d+1$, contradicting the degree bound unless the polynomial was $0$ to begin
with. But read the *contrapositive*, because that is the version we actually use:
if a polynomial is not identically zero, it **cannot** vanish at more than $\deg$
points. A non-zero degree-$d$ polynomial has a strict vanishing budget of $d$.
Spend it, and any further point is forced to be a non-zero value.

That single sentence is a detector. Suppose you want to prove some configuration
exists. Build a polynomial that would have to vanish everywhere *unless* the
configuration is present; show its degree is too small for it to vanish that
often; conclude it is non-zero somewhere, which is exactly the configuration you
wanted. The trick, always, is arranging for the degree to be smaller than the
number of forced roots.

Build the encoding by hand. Click a number line to drop roots into $A$; the
factored and expanded forms of $P_A(x)$ appear, and the curve crosses zero
precisely at your chosen points. Then use the slider to *cap the degree*. When you
demand more roots than the degree allows, the polynomial has no choice but to
collapse to the zero polynomial — the hammer, live.

<div class="widget" id="poly-encoder">
  <p class="widget-title">Widget · The Polynomial Encoder</p>
  <div class="pw-line" aria-label="number line: click to add elements to set A"></div>
  <div class="pw-controls">
    <label>Target degree $d$:
      <input type="range" class="pw-slider" min="0" max="8" step="1" value="3">
    </label>
    <span class="pw-d">3</span>
  </div>
  <div class="pw-latex"></div>
  <canvas class="pw-canvas" aria-label="plot of the encoding polynomial"></canvas>
  <p class="pw-warn" hidden></p>
  <p class="pw-hint">Click the number line to build $A$; the curve crosses zero exactly
    at your points. Now drag the target degree below $|A|$ — more roots than the degree
    allows forces the polynomial to collapse to $0$.</p>
</div>

The hammer is a one-variable statement, but Cauchy–Davenport already involves two
sets, and the deep results live in $n$ variables at once. So the plan for the rest
of the article is to upgrade "at most $d$ roots" into statements about polynomials
in many variables evaluated on **grids** $S_1 \times \dots \times S_n$ — Cartesian
products of finite sets. There are two historical stepping stones on the way to
the main theorem, one from 1935 and one from 1993, and each is worth meeting on
its own terms.

## Chevalley–Warning: pigeonhole on steroids

The first multivariate rigidity theorem predates Alon by more than sixty years and
comes at the problem from a completely different angle — not "how few roots" but
"how many," counted modulo $p$.

> **Chevalley–Warning (1935).** Let $f_1, \dots, f_k \in \mathbb{F}_p[x_1, \dots, x_n]$
> be polynomials with $\sum_i \deg(f_i) < n$. Then the number of common zeros of
> the $f_i$ in $\mathbb{F}_p^{\,n}$ is divisible by $p$.

Before the proof, feel what the statement buys you. It says nothing about *where*
the zeros are or *how many* there are exactly — only that their count is a multiple
of $p$. That sounds weak until you combine it with a single observation: many
natural systems have an *obvious* zero, the origin $(0, \dots, 0)$. And "the number
of zeros is a multiple of $p$, and it is at least $1$" forces the count to be at
least $p$. You exhibit one solution and the theorem manufactures $p - 1$ more, for
free, out of a mere inequality between degrees. That is why the section is
subtitled pigeonhole on steroids: like pigeonhole, it converts counting into
existence, but the multiplier is an entire prime.

The proof is a beautiful piece of bookkeeping and rewards being written out in
full, because the same summation lemma reappears in the cap-set argument at the
very end.

*Two lemmas about summing over a finite field.* First, for any $a \in \mathbb{F}_p$,
Fermat's little theorem gives $a^{p-1} = 1$ when $a \neq 0$ and $0^{p-1} = 0$. So
the expression $1 - a^{p-1}$ is $1$ when $a = 0$ and $0$ otherwise — it is an
*indicator of vanishing*. Second, and this is the crucial one:

$$ \sum_{a \in \mathbb{F}_p} a^{\,t} \;=\; \begin{cases} -1 & \text{if } (p-1) \mid t \text{ and } t > 0, \\ 0 & \text{otherwise.} \end{cases} $$

Why? If $$t = 0$$ every term is $$1$$ (using $$0^0 = 1$$) and the sum is $$p \equiv 0$$.
If $$t > 0$$ and $$(p-1) \mid t$$, then every non-zero $$a$$ has $$a^t = 1$$, so the sum is
$$(p-1)\cdot 1 = -1$$ in $$\mathbb{F}_p$$. And if $$t > 0$$ with $$(p-1) \nmid t$$, pick a
generator $$g$$ of the cyclic group $$\mathbb{F}_p^\times$$; multiplication by $$g$$
permutes the non-zero elements, so $$\sum_{a \neq 0} a^t = \sum_{a \neq 0} (ga)^t = g^t \sum_{a \neq 0} a^t$$, and since $$g^t \neq 1$$ the sum must be $$0$$. That is the
whole engine: **low-degree monomials sum to zero over the cube $$\mathbb{F}_p^n$$.**

*The count.* Consider the single polynomial

$$ N(x_1, \dots, x_n) = \prod_{i=1}^{k} \bigl(1 - f_i(x)^{\,p-1}\bigr). $$

By the first lemma, $N(x) = 1$ exactly when every $f_i(x) = 0$, and $N(x) = 0$
otherwise. So summing $N$ over the whole cube *counts the common zeros modulo
$p$*:

$$ \#\{\text{common zeros}\} \;\equiv\; \sum_{x \in \mathbb{F}_p^{\,n}} N(x) \pmod p. $$

Now bound the degree of $N$. Each factor contributes degree $(p-1)\deg(f_i)$, so
$\deg N \le (p-1)\sum_i \deg(f_i) < (p-1)\,n$ by hypothesis. Expand $N$ into
monomials $c\, x_1^{e_1} \cdots x_n^{e_n}$. For each such monomial,
$\sum_{x} x_1^{e_1}\cdots x_n^{e_n} = \prod_i \bigl(\sum_{a} a^{e_i}\bigr)$
factors over the coordinates. By the second lemma, that product is zero unless
*every* $e_i$ is a positive multiple of $p-1$ — but then the total degree would be
$\sum e_i \ge (p-1)n$, which exceeds $\deg N$. No monomial can meet the quota, so
*every* term sums to zero, and $\sum_x N(x) = 0$ in $\mathbb{F}_p$. Hence the
number of common zeros is $\equiv 0 \pmod p$. $\blacksquare$

The widget below is not an illustration of a formula — it is the actual theorem
running. Pick a small prime and a preset low-degree system with
$\sum \deg < n$; the widget enumerates *every* point of $\mathbb{F}_p^n$, colours
the common zeros, and reports the count. No matter what you choose, the number of
green points is divisible by $p$.

<div class="widget" id="chevalley-counter">
  <p class="widget-title">Widget · Counting Zeros mod p</p>
  <div class="cw-controls">
    <label>prime $p$ <select class="cw-p"></select></label>
    <label>system <select class="cw-sys"></select></label>
  </div>
  <canvas class="cw-canvas" aria-label="all points of F_p^n with common zeros highlighted"></canvas>
  <p class="cw-verdict"></p>
  <p class="cw-hint">Every point of $\mathbb{F}_p^{\,n}$ is drawn (in layers for $n=3$).
    Green = common zero. The degree budget $\sum\deg f_i < n$ forces the green count to be
    a multiple of $p$ — check it against the readout.</p>
</div>

Here is the classic payoff, and it is worth stating what *not* to claim first,
because the natural guess is false. It is tempting to assert "any $p-1$ integers
contain a non-empty subsequence summing to $0 \bmod p$." That is wrong: take
$p - 1$ copies of $1$, and every non-empty subsequence sums to something between
$1$ and $p-1$, never $0$. The correct statement needs one more integer *and* asks
for a subsequence of a fixed length, and it is a genuinely useful theorem.

> **Erdős–Ginzburg–Ziv (1961).** Among any $2p - 1$ integers, some $p$ of them sum
> to a multiple of $p$.

*Proof.* Label the integers $a_1, \dots, a_{2p-1}$ and introduce variables
$x_1, \dots, x_{2p-1}$ over $\mathbb{F}_p$. Consider the two polynomials

$$ f_1 = \sum_{i=1}^{2p-1} a_i\, x_i^{\,p-1}, \qquad f_2 = \sum_{i=1}^{2p-1} x_i^{\,p-1}. $$

Each has degree $p-1$, so $\sum \deg = 2(p-1) = 2p - 2$, which is strictly less
than the number of variables $n = 2p - 1$. The all-zeros point is a common zero,
so by Chevalley–Warning the number of common zeros is a positive multiple of $p$;
in particular there is a *second*, non-trivial common zero. Let
$I = \{ i : x_i \neq 0 \}$ be its support, which is non-empty. By Fermat,
$x_i^{p-1} = 1$ for $i \in I$ and $0$ otherwise, so the equation $f_2 = 0$ reads
$|I| \equiv 0 \pmod p$. Since $0 < |I| \le 2p - 1$, the only possibility is
$|I| = p$. And $f_1 = 0$ now reads $\sum_{i \in I} a_i \equiv 0 \pmod p$. Those $p$
indices are the subset we were promised. $\blacksquare$

Notice how little we did: we chose two polynomials so that one equation controlled
the *size* of the support and the other controlled the *sum*, then let
Chevalley–Warning hand us a non-trivial support for free. That is the encode /
read-one-consequence rhythm in an unfamiliar key. Try it directly — the widget
lets you throw down $2p-1$ integers and hunts for the $p$ of them that sum to
zero.

<div class="widget" id="egz-finder">
  <p class="widget-title">Widget · Erdős–Ginzburg–Ziv Finder</p>
  <div class="egz-controls">
    <label>prime $p$ <select class="egz-p"></select></label>
    <button type="button" class="egz-reroll">new random integers</button>
    <button type="button" class="egz-solve">find the p that sum to 0</button>
  </div>
  <div class="egz-chips" aria-label="the 2p-1 integers as chips"></div>
  <p class="egz-out"></p>
  <p class="egz-hint">There are $2p-1$ integers. Click chips to select exactly $p$ and the
    readout tracks your running sum mod $p$; or hit "find" to watch the guaranteed
    solution light up. It always exists — that is the theorem.</p>
</div>

Chevalley–Warning is powerful, but it is *coarse*: it can only perceive vanishing
on the **entire** cube $\mathbb{F}_p^n$. Cauchy–Davenport is a question about a
tiny, arbitrary rectangle $A \times B$ sitting inside the field, and to that
rectangle Chevalley–Warning is blind. We need an instrument that measures
vanishing on an arbitrary box, not the whole space. Before building it, a short
detour to see the same rigidity wearing probabilistic clothes — it will sharpen
the intuition for why "low degree" means "cannot vanish too often."

## Interlude: how much can a polynomial hide?

Everything so far has been a variation on one theme: a polynomial of low degree
cannot vanish at too many places. The probabilistic version of that slogan is a
workhorse of theoretical computer science, and meeting it now makes the
multivariate Nullstellensatz feel inevitable rather than surprising.

> **Schwartz–Zippel.** Let $f \in \mathbb{F}[x_1, \dots, x_n]$ be a non-zero
> polynomial of total degree $d$, and let $S \subseteq \mathbb{F}$ be finite. If a
> point $(s_1, \dots, s_n)$ is chosen uniformly at random from $S^n$, then
> $$ \Pr[\,f(s_1, \dots, s_n) = 0\,] \;\le\; \frac{d}{|S|}. $$

For $n = 1$ this is the univariate hammer in disguise: at most $d$ of the $|S|$
candidate points are roots, so the probability of hitting one is at most $d/|S|$.
The multivariate proof is a clean induction: write $f$ as a polynomial in $x_n$
whose coefficients are polynomials in the other variables, condition on the
top coefficient vanishing or not, and apply the hammer on whichever axis is left.
The moral is that a non-zero low-degree polynomial is *mostly non-zero*: its zero
set is a thin, lower-dimensional sliver of the grid, and a random point misses it
with high probability.

The picture below makes that concrete. Scatter random points in the plane, then
drop a polynomial curve $f = 0$ of adjustable degree on top. A line ($d = 1$) can
be dragged to pass through at most a handful; a conic ($d = 2$) bends to catch a
few more; but no low-degree curve can thread its way through *most* of the cloud.
The zero set is simply too rigid to be that greedy.

<div class="widget" id="schwartz-zippel">
  <p class="widget-title">Widget · How Much Can a Curve Catch?</p>
  <div class="sz-controls">
    <label>points $N$ <input type="range" class="sz-n" min="10" max="120" value="50"></label>
    <label>curve degree $d$ <input type="range" class="sz-d" min="1" max="5" value="2"></label>
    <button type="button" class="sz-reroll">new points</button>
  </div>
  <canvas class="sz-canvas" aria-label="random points and a movable low-degree curve"></canvas>
  <p class="sz-out"></p>
  <p class="sz-hint">Drag the curve (click-drag on the canvas to move it). It hits only the
    points that lie almost exactly on it — a degree-$d$ curve through a random cloud
    can catch very few. Rigidity, seen as scarcity.</p>
</div>

With that intuition in hand, back to the main line: we need to measure vanishing
on a box.

## Alon–Füredi: the degree pays the price

Take a grid $A_1 \times \dots \times A_n$ — a Cartesian product of finite sets —
and ask the sharpest possible question: how *cheaply*, in degree, can a polynomial
vanish on almost all of the grid while sparing at least one point?

> **Alon–Füredi (1993), punctured form.** If $f$ vanishes at every point of the
> grid $A_1 \times \dots \times A_n$ except exactly one, then
> $$ \deg(f) \ge \sum_{i=1}^{n} \bigl(|A_i| - 1\bigr). $$

The content is that you cannot *nearly*-vanish on a grid on the cheap. Sparing a
single cell of a $3 \times 3$ grid already costs total degree at least
$(3-1) + (3-1) = 4$. Every extra row or column you add raises the toll by exactly
one. Degree is a currency, and each unit of "almost everywhere zero" has a fixed
price.

*Proof, by induction on $n$.* The base case $n = 1$ *is* the univariate hammer:
a polynomial that vanishes at $|A_1| - 1$ points of $A_1$ but not at the last one
is non-zero, so it has degree at least $|A_1| - 1$.

For the inductive step, write $f$ as a polynomial in the last variable with
coefficients in the others:

$$ f(x_1, \dots, x_n) = \sum_{j=0}^{D} c_j(x_1, \dots, x_{n-1})\, x_n^{\,j}, \qquad D = \deg_{x_n} f. $$

Let the spared point be $(u_1, \dots, u_n)$. For each fixed value $\beta \in A_n$
with $\beta \neq u_n$, the slice $f(x_1, \dots, x_{n-1}, \beta)$ vanishes on the
*entire* grid $A_1 \times \dots \times A_{n-1}$ (every point of that slice differs
from the spared point in the last coordinate, so it is one of the required zeros).
Meanwhile the slice at $\beta = u_n$ vanishes everywhere on the $(n-1)$-grid
*except* at $(u_1, \dots, u_{n-1})$. Consider the one-variable polynomial
$g(x_n) = f(u_1, \dots, u_{n-1}, x_n)$: it vanishes at every $\beta \in A_n$ with
$\beta \neq u_n$ — that is $|A_n| - 1$ roots — but not at $u_n$, so
$\deg g \ge |A_n| - 1$. The coefficient of the top surviving power of $x_n$ in
$g$ comes from some $c_j$ with $j \ge |A_n| - 1$, and *that* $c_j$, evaluated at
$(u_1, \dots, u_{n-1})$, is non-zero. But $c_j$ vanishes on the $(n-1)$-grid
except (possibly) at the spared point — apply the inductive hypothesis to $c_j$ to
get $\deg c_j \ge \sum_{i<n}(|A_i| - 1)$. Therefore

$$ \deg f \ge \deg c_j + j \ge \sum_{i=1}^{n-1}\bigl(|A_i| - 1\bigr) + \bigl(|A_n| - 1\bigr) = \sum_{i=1}^{n}\bigl(|A_i| - 1\bigr). \qquad \blacksquare $$

(The full Alon–Füredi theorem lower-bounds the *number* of non-zeros of a
polynomial on a grid, and the punctured version above is the special case we need.
The general statement is what powers finite-geometry results like Jamison's bound
on blocking sets, but one exceptional point is enough for us.)

The widget turns the bound into something you can feel. Set the grid dimensions,
click cells to "vanish" them (they go dark), and leave one alive (gold). The meter
reads off the forced minimum degree $(|A|-1)+(|B|-1)$, and no arrangement lets you
cheat below it.

<div class="widget" id="grid-vanisher">
  <p class="widget-title">Widget · The Grid Vanisher</p>
  <div class="gv-controls">
    <label>|A| <input type="range" class="gv-cols" min="2" max="8" value="4"></label>
    <label>|B| <input type="range" class="gv-rows" min="2" max="8" value="4"></label>
  </div>
  <canvas class="gv-canvas" aria-label="grid; click cells to vanish, leave one alive"></canvas>
  <div class="gv-meter"><div class="gv-fill"></div><span class="gv-label"></span></div>
  <p class="gv-hint">Click cells to "vanish" them (dark); leave exactly one alive (gold).
    The meter shows the forced minimum degree $(|A|-1)+(|B|-1)$ — you cannot beat it.</p>
</div>

Alon–Füredi is already a sledgehammer. Before refining it into the Nullstellensatz,
let us swing the raw tool at a problem famous for humiliating elementary methods.

## IMO 2007, Problem 6: the first kill

> **Problem.** Let $n$ be a positive integer and
> $$ S = \{(x,y,z) : x,y,z \in \{0,1,\dots,n\}\} \setminus \{(0,0,0)\}. $$
> Find the least number of planes whose union contains every point of $S$ but
> does **not** contain the origin.

Picture the $(n+1)^3$ lattice cube. You must cover every point of it except the
single corner at the origin, and the planes you use are forbidden from passing
through that corner. If the ban were lifted the problem would be trivial — the
three coordinate planes $x = 0$, $y = 0$, $z = 0$ cover everything with a zero
coordinate, which for the punctured cube is almost everything. But those planes go
through the origin, so they are illegal, and every legal plane must have a non-zero
constant term. Try to handle this by counting lattice points on planes and you
drown; the constraint "avoid one specific point" is exactly the kind of thing
elementary counting handles badly.

*Translation.* Suppose $m$ planes do the job. Each plane is the zero set of a
linear form $L_i(x,y,z) = a_i x + b_i y + c_i z + d_i$. "Dodges the origin" means
$L_i(0,0,0) = d_i \neq 0$. Multiply all the forms into one polynomial:

$$ f(x,y,z) = \prod_{i=1}^{m} L_i(x,y,z). $$

Read off three facts, each immediate. First, $\deg f = m$, since $f$ is a product
of $m$ linear forms. Second, $f$ vanishes on all of $S$: every point of $S$ lies
on some covering plane, which kills the corresponding factor and hence the whole
product. Third, $f(0,0,0) = \prod_i d_i \neq 0$, since none of the $d_i$ is zero.
Put together: $f$ vanishes on the entire grid $\{0, \dots, n\}^3$ **except** at
the origin.

*The kill.* That is *precisely* the punctured Alon–Füredi setup, with each
$|A_i| = n + 1$:

$$ m = \deg f \;\ge\; \sum_{i=1}^{3}\bigl((n+1) - 1\bigr) = 3n. $$

Three lines. And $3n$ is achievable: the planes $x = k$, $y = k$, $z = k$ for
$k \in \{1, \dots, n\}$ number exactly $3n$, none passes through the origin (since
$0 \notin \{1, \dots, n\}$), and any non-zero lattice point has some coordinate in
$\{1, \dots, n\}$, hence lies on one of them. So the minimum is exactly $3n$. The
identical argument in $k$ dimensions gives $kn$ — an infinite family of
competition problems, solved in one paragraph, with the dimension appearing as a
parameter rather than a new difficulty.

Rotate the cube, place axis planes, and watch the coverage fill in. The origin is
the protected red point you are never allowed to hit; try to finish with fewer than
$3n$ planes and you will always be left with a gap.

<div class="widget" id="imo-planes">
  <p class="widget-title">Widget · The Plane Placer</p>
  <div class="ip-controls">
    <label>$n$ <input type="range" class="ip-n" min="1" max="3" value="2"></label>
    <span class="ip-stat"></span>
  </div>
  <div class="ip-planes"></div>
  <div class="ip-add">
    add plane
    <select class="ip-axis"><option value="x">x</option><option value="y">y</option><option value="z">z</option></select>
    =
    <select class="ip-val"></select>
    <button type="button" class="ip-go">place</button>
    <button type="button" class="ip-solve">auto-solve</button>
    <button type="button" class="ip-reset">reset</button>
  </div>
  <canvas class="ip-canvas" aria-label="3D lattice cube with covering planes; drag to rotate"></canvas>
  <p class="ip-hint">Drag the canvas to rotate the cube. Place axis planes (each avoids the
    origin) and watch points turn green. You will need exactly $3n$ — "auto-solve" shows one
    optimal cover.</p>
</div>

Alon–Füredi works, but it is awkward to *state* and to *use*: "vanishes everywhere
but one point" is a mouthful, and real problems almost never hand you exactly one
exceptional point on a nose. In 1999 Alon distilled this entire circle of ideas
into one statement that reads like an incantation and applies almost mechanically.

## The Combinatorial Nullstellensatz

> **Combinatorial Nullstellensatz (Alon, 1999).** Let $\mathbb{F}$ be a field and
> $f \in \mathbb{F}[x_1, \dots, x_n]$ a polynomial of total degree
> $\deg f = t_1 + \dots + t_n$. Suppose the coefficient of the monomial
> $x_1^{t_1} \cdots x_n^{t_n}$ in $f$ is **non-zero**. Then for any sets
> $S_1, \dots, S_n \subseteq \mathbb{F}$ with $|S_i| > t_i$, there exist $s_i \in S_i$
> with
> $$ f(s_1, \dots, s_n) \neq 0. $$

Sit with the shape of this. The hypothesis is a statement about *one coefficient*
of $f$ — the coefficient of a top-degree monomial whose exponents you get to
choose. The conclusion is that $f$ is guaranteed *not* to vanish somewhere on any
grid that is large enough in each coordinate. So the theorem converts an algebraic
fact you can compute ("this coefficient is non-zero") into a combinatorial
existence statement ("there is a grid point where $f \neq 0$"). The entire art of
applying it is designing $f$ so that (a) $f$ vanishing everywhere on the grid would
*contradict* the problem, and (b) the top monomial whose coefficient you can
actually evaluate is one whose coefficient turns out to be non-zero.

*Why it is true.* Suppose, for contradiction, that $f$ vanishes at every point of
the grid $S_1 \times \dots \times S_n$. For each coordinate let
$g_i(x_i) = \prod_{s \in S_i}(x_i - s)$, the encoding polynomial of $S_i$; it is
monic of degree $|S_i|$ and vanishes exactly on $S_i$. The key move is *reduction*.
Wherever a power $x_i^{|S_i|}$ or higher appears in $f$, use the relation
$g_i(x_i) = 0$ — that is, $x_i^{|S_i|} = x_i^{|S_i|} - g_i(x_i)$, which is a
polynomial of *lower* degree in $x_i$ — to rewrite it. Repeat until no variable
appears to a power $\ge |S_i|$. Call the result $\tilde f$. Two things are true of
$\tilde f$: it still agrees with $f$ at every grid point (we only ever subtracted
multiples of things that vanish on the grid), so it *also* vanishes on the whole
grid; and $\deg_{x_i} \tilde f < |S_i|$ for every $i$.

A polynomial with each individual degree strictly below the grid size that
vanishes on the entire grid must be the zero polynomial — this is the
**multivariate hammer**, proved by inducting the one-variable version along each
axis in turn. So $\tilde f \equiv 0$. But now look at the top monomial
$x_1^{t_1} \cdots x_n^{t_n}$. Each reduction step *strictly lowers* the degree in
some variable, so it can never create this monomial, and because $t_i < |S_i|$ for
every $i$, this monomial already satisfies the reduced-degree condition, so it is
never destroyed either. Hence its coefficient in $\tilde f$ equals its coefficient
in $f$, which is non-zero by hypothesis. That contradicts $\tilde f \equiv 0$.
Therefore $f$ does not vanish somewhere on the grid. $\blacksquare$

The non-zero coefficient is, quite literally, the obstruction to "vanishing
everywhere": the one piece of $f$ that the grid relations cannot erase. Watch the
reduction happen. The widget expands a two-variable polynomial into its monomial
grid, then applies the relations $x^{|A|} \to \text{lower}$ and
$y^{|B|} \to \text{lower}$ step by step; monomials above the grid size get
rewritten and cancel downward, but the highlighted top monomial sits in the
"legal" corner and never moves.

<div class="widget" id="null-reduce">
  <p class="widget-title">Widget · The Reduction, Step by Step</p>
  <div class="nr-controls">
    <label>prime $p$ <select class="nr-p"></select></label>
    <label>|A| <input type="range" class="nr-a" min="2" max="5" value="3"></label>
    <label>|B| <input type="range" class="nr-b" min="2" max="5" value="3"></label>
    <button type="button" class="nr-step">reduce one step</button>
    <button type="button" class="nr-reset">reset</button>
  </div>
  <canvas class="nr-canvas" aria-label="monomial grid of f, reduced modulo the grid relations"></canvas>
  <p class="nr-out"></p>
  <p class="nr-hint">Each dot is a monomial $x^i y^j$ present in $f$; the shaded corner is the
    "legal" region $i<|A|,\,j<|B|$. Reduction pulls illegal monomials down into the corner.
    The ringed monomial is the top one the Nullstellensatz watches — it never leaves the corner.</p>
</div>

The reason to prefer the Nullstellensatz over Alon–Füredi and Chevalley–Warning
(both of which are corollaries of it) is purely practical: it makes every
application the *same* two-step ritual. **Pick $f$. Compute one coefficient.**
Once you internalise the ritual, theorems start falling in pairs.

<div class="widget" id="null-coeff">
  <p class="widget-title">Widget · The Coefficient Detector</p>
  <p class="nc-desc">Build $f(x,y)=\prod (x+y-c)$ over a chosen grid, then reduce it
    modulo the grid's vanishing polynomials. Watch the top monomial's coefficient
    survive the reduction untouched — that survival <em>is</em> the theorem.</p>
  <div class="nc-controls">
    <label>prime $p$ <select class="nc-p"></select></label>
    <label>|A| <input type="range" class="nc-a" min="1" max="5" value="3"></label>
    <label>|B| <input type="range" class="nc-b" min="1" max="5" value="3"></label>
  </div>
  <div class="nc-out"></div>
  <p class="nc-hint">The highlighted coefficient of $x^{|A|-1}y^{|B|-1}$ is what the
    Nullstellensatz reads. Non-zero mod $p$ ⇒ a non-vanishing grid point exists.</p>
</div>

Time to collect trophies. Everything below is the ritual, applied.

## Demolishing Cauchy–Davenport

*Proof of Cauchy–Davenport.* First dispose of the easy regime. If
$|A| + |B| > p$, then for any target $t \in \mathbb{Z}_p$ the sets $A$ and
$t - B = \{t - b : b \in B\}$ have sizes summing to more than $p$, so they must
intersect; an element in both gives $a = t - b$, i.e. $t = a + b \in A + B$. Hence
$A + B = \mathbb{Z}_p$ and $|A+B| = p = \min\{p, |A|+|B|-1\}$. So assume
$|A| + |B| - 1 \le p$, where the bound to beat is $|A| + |B| - 1$.

Suppose, for contradiction, that $|A + B| \le |A| + |B| - 2$. Enlarge $A + B$ to a
set $C \supseteq A + B$ with *exactly* $|C| = |A| + |B| - 2$ elements (possible
since $A+B$ is at most this big and $\mathbb{Z}_p$ is big enough), and define

$$ f(x, y) = \prod_{c \in C} (x + y - c). $$

Its total degree is $|C| = |A| + |B| - 2 = (|A| - 1) + (|B| - 1)$. Now target the
monomial $x^{|A|-1} y^{|B|-1}$, which has exactly that total degree. Because it is
a top-degree monomial, its coefficient in $f$ equals its coefficient in the
top-degree part of $f$, which is $(x + y)^{|A|+|B|-2}$. By the binomial theorem
that coefficient is

$$ \binom{|A| + |B| - 2}{|A| - 1}. $$

Here is the one place the field structure matters. Because $|A| + |B| - 2 < p$,
every factor in the numerator of this binomial coefficient is a positive integer
less than $p$, so $p$ divides *none* of them; the binomial coefficient is
therefore **non-zero in $\mathbb{F}_p$**. Now fire the Nullstellensatz with
$S_1 = A$, $S_2 = B$ and exponents $t_1 = |A| - 1 < |A| = |S_1|$,
$t_2 = |B| - 1 < |B| = |S_2|$: there exist $a \in A$, $b \in B$ with
$f(a, b) \neq 0$. But $a + b \in A + B \subseteq C$, so one factor
$x + y - (a{+}b)$ vanishes at $(a,b)$, making $f(a,b) = 0$. Contradiction.
Therefore $|A + B| \ge |A| + |B| - 1$. $\blacksquare$

Two lines of genuine content, and the 1935 theorem has become a statement about a
single binomial coefficient not being divisible by $p$. The widget lays out
Pascal's triangle modulo $p$ and circles exactly the entry the proof depends on;
slide $|A|$ and $|B|$ and watch it stay non-zero right up until $|A|+|B|-2$ reaches
$p$, at which point the $\min$ in the theorem quietly takes over.

<div class="widget" id="cd-demolisher">
  <p class="widget-title">Widget · The Cauchy–Davenport Demolisher</p>
  <div class="cd-controls">
    <label>prime $p$ <select class="cd-p"></select></label>
    <label>|A| <input type="range" class="cd-a" min="1" max="8" value="3"></label>
    <label>|B| <input type="range" class="cd-b" min="1" max="8" value="3"></label>
  </div>
  <div class="cd-tri" aria-label="Pascal's triangle mod p"></div>
  <p class="cd-out"></p>
  <p class="cd-hint">Pascal's triangle mod $p$, coloured by value. The circled entry
    $\binom{|A|+|B|-2}{|A|-1}$ is the coefficient the proof needs; as long as it is
    non-zero mod $p$, the bound holds.</p>
</div>

Naturally we push our luck. What happens if we forbid a summand from pairing with
itself?

## The Erdős–Heilbronn wall

Define the **restricted sumset**, where the two summands are required to be
distinct:

$$ A \,\hat{+}\, A = \{\, a + a' \pmod p : a, a' \in A,\ a \neq a' \,\}. $$

Removing the diagonal $a = a'$ should barely cost anything — you lose at most the
sums $2a$, and there are only $|A|$ of them. Erdős and Heilbronn conjectured in
the early 1960s that the honest bound is almost the same as before, just shifted by
a constant:

$$ |A \,\hat{+}\, A| \ge \min\{\,p,\ 2|A| - 3\,\}. $$

It looks like it should surrender to the same ritual, so let us try and watch it
fail, because the failure is the most instructive moment in the whole story.
Mimicking the Cauchy–Davenport proof, we would take

$$ f(x, y) = \prod_{c \in C} (x + y - c), \qquad |C| = 2|A| - 4, $$

hoping to contradict $|A \,\hat{+}\, A| \le 2|A| - 4$. But the Nullstellensatz,
applied with $S_1 = S_2 = A$, produces a grid point $(a, b) \in A \times A$ — and
*nothing in the theorem forbids $a = b$*. The Nullstellensatz cannot see the
constraint $a \neq b$; it only knows about the box $A \times A$, diagonal and all.
On the diagonal, $f$ has no reason to vanish (the sum $2a$ need not lie in $C$), so
we get no contradiction. The wand passes straight through the wall.

Build $A$ and compare the full sumset $A + A$ (green) against the restricted
$A \,\hat{+}\, A$ (purple). The purple set is what we are trying to bound; notice
how the diagonal sums $2a$ are exactly the elements that can appear in green but
not in purple.

<div class="widget" id="eh-explorer">
  <p class="widget-title">Widget · Restricted Sumsets</p>
  <div class="eh-controls">
    <label>prime $p$ <select class="eh-p"></select></label>
    <span class="eh-stat"></span>
  </div>
  <canvas class="eh-canvas" aria-label="Z_p clock showing A, its sumset, and restricted sumset"></canvas>
  <p class="eh-hint">Click to build $A$. Green = full $A+A$, purple = restricted
    $A\,\hat{+}\,A$ (diagonal removed). Compare each against its bound; note how much
    thinner the restricted guarantee is.</p>
</div>

The conjecture stood for roughly thirty years. Dias da Silva and Hamidoune finally
proved it in 1994 using the exterior algebra and representation theory of the
symmetric group — a heavy hammer. Then, within a year, Alon, Nathanson and Ruzsa
found a proof so short it fits in a paragraph. Their entire fix is a single extra
factor, and it is the cleanest possible illustration of the encode-the-constraint
philosophy.

## The $(x - y)$ hack

The Nullstellensatz could not enforce $a \neq b$. So *build the constraint into
the polynomial itself*: multiply by $(x - y)$, which vanishes exactly on the
diagonal $x = y$. Now if the theorem hands us a point where the product is
non-zero, that point is automatically off the diagonal, for free.

*Proof of Erdős–Heilbronn (Alon–Nathanson–Ruzsa).* Write $m = |A|$ and assume
$2m - 3 \le p$ (the other regime, as before, forces the restricted sumset to be
everything). Suppose $|A \,\hat{+}\, A| \le 2m - 4$; take a set
$E \supseteq A \,\hat{+}\, A$ with exactly $|E| = 2m - 4$ elements and set

$$ f(x, y) = (x - y) \prod_{e \in E} (x + y - e). $$

Then $\deg f = 1 + (2m - 4) = 2m - 3$. Target the monomial $x^{m-1} y^{m-2}$,
whose total degree is $2m - 3$. Its coefficient equals its coefficient in the
top-degree part $(x - y)(x + y)^{2m-4}$. Extracting it: from $(x+y)^{2m-4}$ the
term $\binom{2m-4}{k} x^k y^{2m-4-k}$, multiplied by $x$, contributes to
$x^{m-1}y^{m-2}$ when $k = m-2$; multiplied by $-y$, it contributes when
$k = m-1$. So the coefficient is

$$ \binom{2m-4}{\,m-2\,} - \binom{2m-4}{\,m-1\,} \;=\; \frac{1}{m-1}\binom{2m-4}{\,m-2\,} \;=\; C_{m-2}, $$

the $(m{-}2)$-th **Catalan number**. (The middle equality is the standard Catalan
identity $C_k = \binom{2k}{k} - \binom{2k}{k+1} = \frac{1}{k+1}\binom{2k}{k}$ with
$k = m-2$.) Since $2m - 4 < p$ and $m - 1 < p$, neither the binomial coefficient
nor the denominator $m-1$ is divisible by $p$, so $C_{m-2} \neq 0$ in
$\mathbb{F}_p$. Fire the Nullstellensatz with $S_1 = S_2 = A$ and exponents
$t_1 = m - 1 < m$, $t_2 = m - 2 < m$: there exist $a, b \in A$ with
$f(a, b) \neq 0$. The factor $(x - y)$ forces $a \neq b$; the remaining factors
force $a + b \notin E \supseteq A \,\hat{+}\, A$. But $a \neq b$ with $a, b \in A$
means $a + b \in A \,\hat{+}\, A$ by definition. Contradiction. $\blacksquare$

The single factor $(x-y)$ did all the work: it cut the diagonal out of the
solution space so the theorem could only return the points we wanted. Watch which
coefficient we end up reading. The widget draws the row of binomial coefficients
in $(x+y)^{2m-4}$ and marks the two entries whose *difference* — a Catalan number
— is the coefficient that has to stay non-zero.

<div class="widget" id="xy-hack">
  <p class="widget-title">Widget · The Diagonal Hack &amp; Catalan Coefficient</p>
  <div class="xy-controls">
    <label>prime $p$ <select class="xy-p"></select></label>
    <label>|A| = m <input type="range" class="xy-m" min="2" max="9" value="4"></label>
  </div>
  <canvas class="xy-canvas" aria-label="coefficient extraction from (x-y)(x+y)^(2m-4)"></canvas>
  <p class="xy-out"></p>
  <p class="xy-hint">The extra $(x-y)$ shifts which coefficient we read: it becomes the
    Catalan number $C_{m-2}=\frac{1}{m-1}\binom{2m-4}{m-2}$. Watch it stay non-zero
    mod $p$ while $2m-3\le p$.</p>
</div>

The move generalises into a whole toolbox: to forbid a configuration, multiply by a
factor that vanishes on it. Forbid the diagonal with $(x - y)$; forbid a hyperplane
with a linear form; forbid all-equal coordinates with a Vandermonde product
$\prod_{i<j}(x_i - x_j)$. Each forbidden set you can describe as a zero locus, you
can delete from the search. Next we stop relying on the ground set being a prime
field at all.

## The Károlyi extension: beyond prime fields

Everything so far leaned on $\mathbb{Z}_p$ being a **field**: that is what kept
binomial coefficients and Catalan numbers non-zero, because in a field the only
way a product vanishes is if a factor does. In a general finite abelian group
$G$ there is no field structure, multiplication may not even be defined, and
worst of all there are *subgroups*, which are the natural enemies of sumset growth.

The obstruction is concrete and worth seeing. In $\mathbb{Z}_6$ take
$A = \{0, 2, 4\}$, the even residues. Then $A + A = \{0, 2, 4\} = A$, only $3$
elements — far below the field bound $2|A| - 1 = 5$. The set is a coset of a
subgroup, and adding a subgroup to itself gives the subgroup back; there is no room
to grow. So any theorem over general groups must build in an escape hatch for
subgroups, and the quantity that controls everything turns out to be the smallest
prime dividing $|G|$.

> **Károlyi (2004–2005).** Let $G$ be a finite abelian group whose smallest prime
> divisor is $p$, and let $A \subseteq G$ be non-empty. Then the restricted sumset
> satisfies
> $$ |A \,\hat{+}\, A| \ge \min\{\,p,\ 2|A| - 3\,\}. $$

The smallest prime divisor $p$ replaces the field size, and when $G = \mathbb{Z}_p$
is cyclic of prime order this recovers Erdős–Heilbronn exactly. The reason $p$ is
the right quantity is that the polynomial method needs a place where "this
coefficient is non-zero" cannot be sabotaged by zero-divisors, and the subgroup
of order $p$ is the smallest structure that could interfere. The proof route
embeds the problem into a field — one works over $\mathbb{F}_p$ or an extension of
it, transports the group into that field using characters, and runs the same
coefficient argument there, so the non-vanishing survives the move to $G$. The
deeper moral is that the polynomial method was never really about $\mathbb{Z}_p$
specifically; it was about having *somewhere* to certify a non-zero coefficient,
and the smallest prime divisor is exactly where that certification has room to
succeed.

Play with composite moduli. Build $A$ inside a subgroup (the even numbers, say) and
watch the naive bound $2|A| - 3$ collapse, while the guarantee that *survives* is
governed by the smallest prime factor of $n$ — exactly Károlyi's quantity.

<div class="widget" id="karolyi">
  <p class="widget-title">Widget · Sumsets in $\mathbb{Z}_n$</p>
  <div class="ka-controls">
    <label>modulus $n$ <select class="ka-n"></select></label>
    <span class="ka-stat"></span>
  </div>
  <canvas class="ka-canvas" aria-label="Z_n clock; watch subgroups defeat the naive bound"></canvas>
  <p class="ka-hint">Try composite $n$. Build $A$ inside a subgroup (e.g. the even
    numbers) and watch the naive $2|A|-3$ bound fail — the guarantee drops to the
    smallest prime factor of $n$, exactly as Károlyi predicts.</p>
</div>

Additive combinatorics is only one continent. The same coefficient test lands,
apparently out of nowhere, in the middle of graph theory.

## The Alon–Tarsi theorem: colouring from lists

A proper colouring of a graph assigns colours to vertices so that adjacent
vertices differ. Ordinary $k$-colouring gives every vertex the *same* palette of
$k$ colours. **List colouring** is the harder, adversarial version: an opponent
hands each vertex $v$ its *own* list $S_v$ of $k$ allowed colours, and you must
still find a proper colouring drawn from the lists. A graph is **$k$-choosable**
if you can always win, no matter how the opponent designs the lists. Choosability
can be strictly harder than colourability — there are bipartite graphs (which are
$2$-colourable) that are not $2$-choosable — so this is genuinely more demanding.

Encode a graph on vertices $1, \dots, n$ by its **graph polynomial**:

$$ f_G(x_1, \dots, x_n) = \prod_{\substack{(i,j) \in E \\ i < j}} (x_i - x_j). $$

A proper colouring is an assignment of values to the variables that makes adjacent
variables differ — that is, a point where *no factor vanishes*, i.e. where
$f_G \neq 0$. So "there is a proper colouring with vertex $i$ taking a value from
its list $S_i$" is *exactly* "$f_G$ is non-zero somewhere on the grid
$S_1 \times \dots \times S_n$" — a Nullstellensatz question, verbatim. The only
thing left is to find a top monomial of $f_G$ with a non-zero coefficient and
exponents small enough to fit the list sizes.

> **Alon–Tarsi (1992).** Orient the edges of $G$ to form a digraph $D$ with
> out-degrees $d_1, \dots, d_n$. If the number of **even** spanning Eulerian
> sub-digraphs of $D$ differs from the number of **odd** ones, then $G$ is
> choosable from any lists of sizes $|S_i| = d_i + 1$.

(A spanning Eulerian sub-digraph is a subset of the edges in which every vertex has
equal in- and out-degree; it is *even* or *odd* according to the parity of its
number of edges.) The bridge to everything above is a clean piece of algebra: that
even-minus-odd difference is *precisely* the coefficient of the monomial
$x_1^{d_1} \cdots x_n^{d_n}$ in $f_G$. Expanding the product $\prod (x_i - x_j)$,
each edge contributes either $+x_i$ or $-x_j$; a choice of which endpoint to take
from each factor is an orientation of the edges, the resulting monomial records the
out-degree sequence, and the sign records the parity — collect terms and the
coefficient is exactly the signed count of orientations realising the degree
sequence $d$, which after cancellation is the even-minus-odd Eulerian count. When
that coefficient is non-zero, the Combinatorial Nullstellensatz (with $t_i = d_i$
and $|S_i| = d_i + 1 > t_i$) hands over a proper list colouring. A famous corollary:
every planar bipartite graph is $3$-choosable, because such graphs admit an
orientation with all out-degrees $\le 2$ for which the Eulerian counts fail to
cancel.

Pick a graph, give each vertex a random list, and try to colour it properly by
clicking through the lists; the readout computes the actual graph-polynomial
coefficient that *guarantees* a solution exists whenever it is non-zero.

<div class="widget" id="alon-tarsi">
  <p class="widget-title">Widget · List Coloring &amp; the Graph Polynomial</p>
  <div class="at-controls">
    <button type="button" class="at-ex" data-g="c4">C₄ (4-cycle)</button>
    <button type="button" class="at-ex" data-g="k4">K₄</button>
    <button type="button" class="at-ex" data-g="path">Path P₄</button>
    <button type="button" class="at-ex" data-g="bull">Bull</button>
    <label>list size $k$ <input type="range" class="at-k" min="1" max="4" value="2"></label>
    <button type="button" class="at-shuffle">new lists</button>
  </div>
  <canvas class="at-canvas" aria-label="graph with per-vertex color lists"></canvas>
  <p class="at-out"></p>
  <p class="at-hint">Each vertex gets a random size-$k$ list. Click a vertex to cycle
    its color through its list; make every edge non-monochromatic. The readout shows
    the graph-polynomial coefficient that guarantees a solution exists.</p>
</div>

The word "Nullstellensatz" is borrowed, of course. It is worth meeting the
theorem it is named after.

## Hilbert's Nullstellensatz: the ancestor

Hilbert's theorem (1893) is the founding dictionary between algebra and geometry,
and it lives over an algebraically closed field $k$ such as $\mathbb{C}$ — a field
where every non-constant polynomial has a root, so the geometry is rich enough to
mirror the algebra perfectly.

> **Weak Nullstellensatz.** Polynomials $f_1, \dots, f_m \in k[x_1, \dots, x_n]$
> have no common zero in $k^n$ if and only if there exist $g_1, \dots, g_m$ with
> $$ g_1 f_1 + \dots + g_m f_m = 1. $$

> **Strong Nullstellensatz.** For an ideal $J$, a polynomial vanishes on the entire
> common zero set $V(J)$ if and only if some power of it lies in $J$; compactly,
> $\mathbf{I}(\mathbf{V}(J)) = \sqrt{J}$.

The weak form is a Fredholm-style alternative: either the system has a common
solution, or there is a *certificate of unsolvability* — an explicit algebraic
identity expressing $1$ as a combination of the equations. Solvability and the
existence of that certificate are not just related; they are logically equivalent.
The strong form says the same thing at the level of vanishing: the geometry
$V(J)$ (where things vanish) determines the algebra $\sqrt{J}$ (what vanishes
there) with no slack — every vanishing pattern is accounted for by an algebraic
reason.

Explore the geometry directly. The widget plots the real zero set
$V(f) = \{f = 0\}$ for a few curves and shades the regions where $f > 0$ and
$f < 0$ so you can see the curve as the exact boundary between them — the vanishing
locus as a genuine geometric object that the algebra of $f$ pins down completely.

<div class="widget" id="hilbert">
  <p class="widget-title">Widget · Vanishing Loci</p>
  <div class="hb-controls">
    <button type="button" class="hb-ex is-on" data-c="circle">circle</button>
    <button type="button" class="hb-ex" data-c="parabola">parabola</button>
    <button type="button" class="hb-ex" data-c="two">two lines</button>
    <button type="button" class="hb-ex" data-c="cubic">cubic</button>
    <button type="button" class="hb-ex" data-c="lemniscate">lemniscate</button>
    <label class="hb-sign-lab"><input type="checkbox" class="hb-sign" checked> shade sign of $f$</label>
  </div>
  <canvas class="hb-canvas" aria-label="real vanishing locus of a polynomial in two variables"></canvas>
  <p class="hb-hint">The curve is $V(f)=\{f=0\}$, the exact border between the blue region
    $f<0$ and the warm region $f>0$. The Nullstellensatz says the algebra of $f$ knows this
    geometry exactly — an intuition Alon carried into the finite, combinatorial world.</p>
</div>

How is Alon's finite theorem related to Hilbert's infinite one? They are not
corollaries of each other — Hilbert answers "when is there *no* common zero" over
an infinite closed field, while Alon answers "when must there *be* a non-zero" over
a finite grid. But the name is a deliberate homage, and the kinship is real: both
are *Nullstellensätze*, "zero-locus theorems," and both assert that where a
polynomial vanishes is completely dictated by its algebra, with no gap between the
geometric picture and the algebraic certificate. We now end where the method
stopped merely reproving known results and started breaking records.

## Croot–Lev–Pach: the lemma that changed everything

For the finale we need a genuinely new idea, because the frontier problem resists
the coefficient trick as stated. The setting is $\mathbb{F}_3^n$, the vectors of
length $n$ over the three-element field, and the object of desire is a **cap set**:

> A **cap set** is a subset of $\mathbb{F}_3^{\,n}$ containing no line — no three
> distinct points $x, y, z$ with $x + y + z = 0$, equivalently no non-trivial
> $3$-term arithmetic progression.

How large can a cap set be? The whole space has $3^n$ points; the question is the
exponential *rate* of the largest cap. For decades the best upper bound was only
barely below trivial — of the form $O(3^n / n^{1+\varepsilon})$ — and a good number
of experts suspected the truth might be close to $3^n$, i.e. that caps could be a
constant fraction of the space. Build one by hand first, in dimension $2$ or $3$,
and get a feel for how quickly lines start to appear and box you in.

<div class="widget" id="cap-set">
  <p class="widget-title">Widget · The Cap Set Game</p>
  <div class="cs-controls">
    <label>dimension $n$ <select class="cs-n"><option value="2">2 (9 pts)</option><option value="3">3 (27 pts)</option></select></label>
    <span class="cs-stat"></span>
    <button type="button" class="cs-auto">show a maximum cap</button>
    <button type="button" class="cs-clear">clear</button>
  </div>
  <canvas class="cs-canvas" aria-label="F_3^n grid; build a set with no line"></canvas>
  <p class="cs-out"></p>
  <p class="cs-hint">Click points to add them. If you complete a line $x+y+z=0$ it flashes
    and the offending triple is drawn — not allowed. Max cap is $4$ for $n=2$, $9$ for
    $n=3$. "Show a maximum cap" reveals an optimal one.</p>
</div>

Then in 2016 the dam broke, and it broke twice in a week. Croot, Lev and Pach
solved the closely analogous problem in $\mathbb{Z}_4^n$ with a startlingly simple
polynomial argument; within days Ellenberg and Gijswijt, and independently others
prompted by Terence Tao's blog write-up, adapted the idea to $\mathbb{F}_3^n$ and
settled the cap-set rate. The engine is a single lemma about the rank of certain
matrices built from low-degree polynomials.

> **Croot–Lev–Pach lemma.** Let $$P \in \mathbb{F}_3[x_1, \dots, x_n]$$ be a
> polynomial in which every variable appears to degree $$\le 2$$ (a *reduced*
> polynomial, since $$x^3 = x$$ on $$\mathbb{F}_3$$), and let $$A \subseteq \mathbb{F}_3^n$$.
> Consider the $$|A| \times |A|$$ matrix $$M$$ with entries $$M_{a,b} = P(a + b)$$. If
> $$\deg P \le d$$, then the rank of $$M$$ is at most twice the number of reduced
> monomials of degree $$\le d/2$$.

*Why the lemma holds.* Expand $P(a+b)$ over its monomials. A monomial of $P$ of
degree $\le d$, evaluated at $a + b$, splits into a part depending on $a$ and a
part depending on $b$; in at least one of the two the degree is $\le d/2$. Grouping
the terms by which side carries the low degree writes $M$ as a sum of two products,
each factoring through the space of reduced monomials of degree $\le d/2$. The rank
of a product is at most the shared dimension, so $\operatorname{rank} M$ is at most
twice the number of such monomials. That count — reduced monomials in $n$ variables
(exponents in $\{0,1,2\}$) of total degree at most $d/2$ — is the quantity that
becomes $\gamma^n$.

This is the same reflex as always — *a low-degree polynomial cannot be too
complicated* — but measured by matrix rank instead of number of roots. To convert
it into a bound on caps we need one more idea, due to Tao: the right notion of
"rank" for a three-dimensional array.

## Slice rank and the cap-set bound

Terence Tao reorganised the Croot–Lev–Pach argument around a notion of rank for
tensors (multi-dimensional arrays) that behaves well for exactly this problem.

> **Slice rank.** A tensor $T(x, y, z)$ has **slice rank $1$** if it factors as a
> function of one variable times a function of the other two — e.g.
> $T = f(x)\, g(y, z)$. The slice rank of a general tensor is the least number of
> rank-$1$ tensors summing to it.

Two facts about slice rank collide to give the theorem. First, a **diagonal**
tensor — one that is non-zero exactly when $x = y = z$, with non-zero values down
the diagonal — has slice rank *equal to* the number of non-zero diagonal entries.
(This is the crux, and it is a short but genuinely clever argument; it is the
tensor analogue of "a diagonal matrix with $r$ non-zero entries has rank $r$.")
Second, a tensor built from a **low-degree polynomial** has *small* slice rank, by
the Croot–Lev–Pach counting.

*The argument.* Let $A \subseteq \mathbb{F}_3^n$ be a cap set. Using $x^3 = x$,
build a reduced polynomial that is non-zero precisely when $x + y + z = 0$, and
restrict it to $A \times A \times A$ to get a tensor $T$. Because $A$ is a cap,
the only way three points of $A$ sum to zero is the trivial way $x = y = z$
(distinct solutions are exactly the forbidden lines). So on $A \times A \times A$
the tensor $T$ is *diagonal* with $|A|$ non-zero entries, and by the first fact its
slice rank is exactly $|A|$. On the other hand $T$ comes from a polynomial of
degree $\le 2n$ (split evenly, $\le 2n/3$ on the relevant side after symmetrising),
so by Croot–Lev–Pach its slice rank is at most $3$ times the number of reduced
monomials of degree $\le 2n/3$ — a quantity that a Chernoff / entropy count shows
is at most $3\,\gamma^n$. Equate the two computations:

$$ |A| \;=\; \operatorname{slice\ rank}(T) \;\le\; 3\,\gamma^{\,n}, \qquad \gamma = \min_{0 < x \le 1} \frac{1 + x + x^2}{x^{2/3}} \approx 2.7551. $$

The whole proof is about a page. That constant $\gamma \approx 2.7551$ is strictly
less than $3$, so cap sets are *exponentially thinner* than the whole space — the
fraction $|A|/3^n$ decays like $(\gamma/3)^n \to 0$. The experts who guessed the
truth was near $3^n$ were wrong, and the tool that showed it was not Fourier
analysis or the regularity method but the same low-degree rigidity we started with,
now expressed as a rank bound.

<div class="widget" id="slice-rank">
  <p class="widget-title">Widget · The Exponential Gap</p>
  <div class="sr-controls">
    <label>dimension $n$ <input type="range" class="sr-n" min="1" max="40" value="25"></label>
  </div>
  <canvas class="sr-canvas" aria-label="comparison of 3^n against the cap-set bound 3 gamma^n"></canvas>
  <p class="sr-out"></p>
  <p class="sr-hint">The whole space grows like $3^n$; the largest cap is trapped below
    $3\,\gamma^n$ with $\gamma\approx2.7551$. The bars are on a log scale — the widening gap
    is the cap fraction $(\gamma/3)^n$ collapsing to zero.</p>
</div>

That is the polynomial method at full extension: the same reflex that turned
Cauchy–Davenport into a binomial coefficient — *build the right algebraic object,
read off one number* — resolved a central question in additive combinatorics that
had resisted the heavy analytic machinery for a generation. A single low-complexity
algebraic quantity, standing in for an entire combinatorial impossibility.

## The one idea

Strip away the specifics and every argument in this article is the same two-step
reflex.

1. **Encode.** Turn the combinatorial object — a set, a grid, a graph, a cap —
   into a polynomial or tensor whose vanishing (or rank) mirrors the property you
   care about. When the problem has a forbidden configuration, delete it by
   multiplying in a factor that vanishes on it.
2. **Read one number.** Exhibit a single coefficient — or, at the frontier, a
   single rank — that is non-zero, and let rigidity (the univariate hammer,
   generalised in every direction) force the configuration you want into existence.

Cauchy–Davenport, an Olympiad problem, a graph-colouring theorem, and the cap-set
bound are not really four theorems. They are one theorem in four costumes, and the
Combinatorial Nullstellensatz is the sentence that says so: *a non-zero top
coefficient means a non-vanishing grid point, always.* The method's reach extends
well past this article — the finite-field Kakeya conjecture fell to Dvir with a
one-page polynomial argument, joints and incidence problems yielded to the same
circle of ideas, and slice rank has since been turned on sunflower-free sets and
tri-coloured sum-free sets. Once you have the reflex, you start seeing places to
use it everywhere, which is the surest sign that a "trick" was really a law all
along.

<script src="{% include post_asset.html file='js/sumset-playground.js' %}" defer></script>
<script src="{% include post_asset.html file='js/polynomial-encoder.js' %}" defer></script>
<script src="{% include post_asset.html file='js/chevalley-counter.js' %}" defer></script>
<script src="{% include post_asset.html file='js/egz-finder.js' %}" defer></script>
<script src="{% include post_asset.html file='js/schwartz-zippel.js' %}" defer></script>
<script src="{% include post_asset.html file='js/grid-vanisher.js' %}" defer></script>
<script src="{% include post_asset.html file='js/imo-planes.js' %}" defer></script>
<script src="{% include post_asset.html file='js/null-reduce.js' %}" defer></script>
<script src="{% include post_asset.html file='js/nullstellensatz.js' %}" defer></script>
<script src="{% include post_asset.html file='js/cauchy-davenport.js' %}" defer></script>
<script src="{% include post_asset.html file='js/erdos-heilbronn.js' %}" defer></script>
<script src="{% include post_asset.html file='js/xy-hack.js' %}" defer></script>
<script src="{% include post_asset.html file='js/karolyi.js' %}" defer></script>
<script src="{% include post_asset.html file='js/alon-tarsi.js' %}" defer></script>
<script src="{% include post_asset.html file='js/hilbert.js' %}" defer></script>
<script src="{% include post_asset.html file='js/cap-set.js' %}" defer></script>
<script src="{% include post_asset.html file='js/slice-rank.js' %}" defer></script>
