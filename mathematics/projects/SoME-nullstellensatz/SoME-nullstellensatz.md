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

There is a trick that keeps showing up in combinatorics. You have a discrete
problem — counting sums, covering a grid, coloring a graph — that resists every
elementary attack. Then someone writes down a polynomial, points at *one* of its
coefficients, observes that this coefficient is non-zero, and the problem falls
over. No case analysis, no clever bijection. Just: *this number isn't zero, so
that configuration must exist.*

This is the **polynomial method**, and its sharpest single tool is Alon's
**Combinatorial Nullstellensatz**. What follows builds it from the ground up —
starting with a puzzle you can do on your fingers, and ending at the frontier of
additive combinatorics, where the same idea cracked a problem that had been open
for decades. Every claim here is proved, and every proof is short. That is the
whole point: the method trades cleverness for a single, reusable structural fact.

Play with the widgets. They are the argument, made tactile.

## The sumset puzzle

Pick a prime $p$ and two non-empty sets $A, B \subseteq \mathbb{Z}_p$. Their
**sumset** is

$$ A + B = \{\, a + b \pmod p : a \in A,\ b \in B \,\}. $$

How small can it be? Over the ordinary integers there is no mystery. If
$A = \{a_1 < \dots < a_m\}$ and $B = \{b_1 < \dots < b_n\}$, then

$$ a_1 + b_1 < a_1 + b_2 < \dots < a_1 + b_n < a_2 + b_n < \dots < a_m + b_n $$

is a strictly increasing chain of $m + n - 1$ distinct sums, so
$|A + B| \ge |A| + |B| - 1$. Ordering does all the work.

Over $\mathbb{Z}_p$ that argument evaporates. The modulo operation wraps the
number line into a circle — $5 + 5 = 3$ in $\mathbb{Z}_7$ — so there is no
largest element to anchor the chain. Sums fold back on top of each other, and it
is genuinely unclear whether the integer bound survives.

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
  </div>
  <canvas class="sp-canvas" aria-label="clock of Z_p; click to build sets A and B"></canvas>
  <p class="sp-hint">Red = A, blue = B, green ring = A+B. Try to make A+B as small as
    possible for given sizes — the dashed target is the conjectured minimum.</p>
</div>

Experiment. You will find you can never push $|A+B|$ below
$\min(p,\ |A| + |B| - 1)$. Take $A = B = \{0, 1, \dots, k\}$: the sumset is
$\{0, 1, \dots, 2k\}$, exactly $2k+1 = |A| + |B| - 1$ elements — the bound is
tight. Push $A$ and $B$ large enough and the sumset simply fills all of
$\mathbb{Z}_p$, which is why $p$ caps the bound. What you have rediscovered is a
theorem from 1935.

> **Cauchy–Davenport.** For a prime $p$ and non-empty $A, B \subseteq \mathbb{Z}_p$,
> $$ |A + B| \ge \min\{\,p,\ |A| + |B| - 1\,\}. $$

Cauchy proved it in 1813; Davenport rediscovered it in 1935. The classical proofs
are clever combinatorial rearrangements. We are going to obtain it — and a dozen
harder statements — from one algebraic reflex. But first we need to learn how to
turn a set into a polynomial.

Keep one image from the last widget in mind: the number line is really about
*roots*. Recall the fact every algebra course opens with — a non-zero polynomial
of degree $d$ has at most $d$ roots. That single sentence, pushed into several
variables, is the entire engine of this article.

## The encoding, and the univariate hammer

Here is the pivot. Encode a set $A = \{a_1, \dots, a_m\}$ by the polynomial whose
roots are exactly its elements:

$$ P_A(x) = \prod_{i=1}^{m} (x - a_i). $$

Now $P_A(a) = 0$ if and only if $a \in A$. Set membership has become *roothood*.
This is the bridge — combinatorics on the left bank, algebra on the right — and
every crossing in this article uses it.

Why is the algebra side easier? Because polynomials are **rigid**. The
one-variable fact bears repeating in the form we will actually use:

> **The univariate hammer.** A polynomial of degree $\le d$ that vanishes at
> $d+1$ distinct points is identically zero.

Contrapositive: if a polynomial is *not* identically zero, it cannot vanish too
often. So polynomials work as detectors. Build one that encodes your problem,
show it would have to vanish at more points than its degree allows, and you have
forced it to be the zero polynomial — usually an absurdity you can cash in.

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

The hammer is a one-variable tool, but Cauchy–Davenport lives in two sets, and
the deeper results live in $n$. Everything from here is about upgrading "at most
$d$ roots" to statements about polynomials in many variables evaluated on
**grids** $S_1 \times \dots \times S_n$. There are two historical stepping stones
before the main theorem — one from 1935, one from 1993.

## Chevalley–Warning: pigeonhole on steroids

The first multivariate rigidity result predates Alon by six decades.

> **Chevalley–Warning (1935).** Let $f_1, \dots, f_k \in \mathbb{F}_p[x_1, \dots, x_n]$
> with $\sum_i \deg(f_i) < n$. Then the number of common zeros of the $f_i$ in
> $\mathbb{F}_p^{\,n}$ is divisible by $p$.

The proof is a beautiful exercise in summation: sum the indicator
$\prod_i \bigl(1 - f_i(x)^{p-1}\bigr)$ over all $x \in \mathbb{F}_p^{\,n}$. By
Fermat's little theorem that indicator is $1$ exactly at common zeros, so the sum
*counts* them modulo $p$; expand it, and the degree hypothesis guarantees every
monomial has some variable appearing to a power in $\{1, \dots, p-2\}$, whose sum
over $\mathbb{F}_p$ is $0$. The whole count collapses to $0 \bmod p$.

The consequence is a manufacturing device. If you can exhibit *one* common zero —
usually the trivial $(0, \dots, 0)$ — then "the number of zeros is a positive
multiple of $p$" forces a **second** zero into existence. You get solutions for
free from a degree inequality.

<div class="widget" id="chevalley-scale">
  <p class="widget-title">Widget · The Chevalley–Warning Scale</p>
  <div class="cw-controls">
    <label>variables $n$ <input type="range" class="cw-n" min="1" max="10" value="5"></label>
    <label>prime $p$ <select class="cw-p"></select></label>
  </div>
  <div class="cw-polys" aria-label="polynomial degrees"></div>
  <button type="button" class="cw-add">+ add polynomial</button>
  <canvas class="cw-canvas" aria-label="balance scale comparing sum of degrees against n"></canvas>
  <p class="cw-verdict"></p>
  <p class="cw-hint">Adjust the degrees. When $\sum \deg f_i < n$ the scale tips and
    Chevalley–Warning fires: any one solution forces at least $p$.</p>
</div>

Here is the classic payoff, done correctly. (A warning: it is tempting to claim
"any $p-1$ integers contain a non-empty subsequence summing to $0 \bmod p$" — but
that is false; take $p-1$ copies of $1$. The right statement needs one more
integer and delivers something stronger.)

> **Erdős–Ginzburg–Ziv (1961).** Among any $2p - 1$ integers, some $p$ of them
> sum to a multiple of $p$.

*Proof.* Let the integers be $a_1, \dots, a_{2p-1}$ and introduce variables
$x_1, \dots, x_{2p-1}$ over $\mathbb{F}_p$. Consider

$$ f_1 = \sum_{i=1}^{2p-1} a_i\, x_i^{\,p-1}, \qquad f_2 = \sum_{i=1}^{2p-1} x_i^{\,p-1}. $$

Each has degree $p-1$, so $\sum \deg = 2(p-1) = 2p - 2 < 2p - 1 = n$. The trivial
point is a common zero, so by Chevalley–Warning there is a **non-trivial** one.
By Fermat, $x_i^{p-1}$ is $1$ on the support $I = \{i : x_i \neq 0\}$ and $0$ off
it, so $f_2 = 0$ reads $|I| \equiv 0 \pmod p$; since $0 < |I| \le 2p-1$, this
forces $|I| = p$. And $f_1 = 0$ reads $\sum_{i \in I} a_i \equiv 0 \pmod p$. Those
$p$ indices are the subset we wanted. $\blacksquare$

Chevalley–Warning is powerful but *coarse*: it only perceives vanishing on the
**entire** field $\mathbb{F}_p^{\,n}$. Cauchy–Davenport asks about a tiny,
arbitrary rectangle $A \times B$ inside the field, and Chevalley–Warning is blind
to such grids. We need a tool that measures vanishing on an arbitrary box.

## Alon–Füredi: the degree pays the price

Take any grid $A_1 \times \dots \times A_n$ and ask: how cheaply can a polynomial
vanish on *almost* all of it?

> **Alon–Füredi (1993), punctured form.** If $f$ vanishes at every point of the
> grid $A_1 \times \dots \times A_n$ except exactly one, then
> $$ \deg(f) \ge \sum_{i=1}^{n} \bigl(|A_i| - 1\bigr). $$

You cannot nearly-vanish on a grid on the cheap. Sparing a single cell of a
$3 \times 3$ grid costs degree at least $(3-1) + (3-1) = 4$. Each extra row or
column raises the toll by one.

*Why it holds.* Induct on $n$. For $n = 1$ it is the univariate hammer: a
polynomial non-zero at one point of $A_1$ but zero at the other $|A_1| - 1$ has
degree $\ge |A_1| - 1$. For the step, fix the last coordinate to each value in
$A_n$; all but one slice must vanish on the whole $(n{-}1)$-grid, and a
divisibility/degree bookkeeping on $x_n$ contributes the missing $|A_n| - 1$.
(The theorem's full form lower-bounds the *number* of non-zeros; the punctured
version above is the slice we need.)

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

This is already a sledgehammer. Let us swing it at a problem that is notorious for
resisting elementary methods.

## IMO 2007, Problem 6: the first kill

> **Problem.** Let $n$ be a positive integer and
> $$ S = \{(x,y,z) : x,y,z \in \{0,1,\dots,n\}\} \setminus \{(0,0,0)\}. $$
> Find the least number of planes whose union contains every point of $S$ but
> does **not** contain the origin.

We have an $(n+1)^3$ lattice cube and must cover all of it except one corner,
using planes that dodge that corner. Coordinate planes like $x = 0$ would be
efficient, but they pass through the origin and are therefore banned — every
usable plane has a non-zero constant term. Elementary counting here is a swamp.

*Translation.* Suppose $m$ planes do the job. Write each as a linear form
$L_i(x,y,z) = a_i x + b_i y + c_i z + d_i$. Dodging the origin means
$L_i(0,0,0) = d_i \neq 0$. Multiply them all:

$$ f(x,y,z) = \prod_{i=1}^{m} L_i(x,y,z). $$

Read off three facts. First, $\deg f = m$. Second, $f$ vanishes on all of $S$,
since every point of $S$ lies on some covering plane, killing a factor. Third,
$f(0,0,0) = \prod_i d_i \neq 0$. So $f$ vanishes on the entire grid
$\{0,\dots,n\}^3$ **except** at the origin.

*The kill.* That is precisely the punctured Alon–Füredi setup with
$|A_i| = n+1$:

$$ m = \deg f \ \ge\ 3\bigl((n+1) - 1\bigr) = 3n. $$

Three lines. And $3n$ is achievable: the planes $x = k,\ y = k,\ z = k$ for
$k \in \{1, \dots, n\}$ are $3n$ planes, none through the origin, and any non-zero
lattice point has some coordinate in $\{1, \dots, n\}$, hence lies on one of them.
The answer is exactly $3n$ — and the identical argument gives $kn$ for the
$k$-dimensional cube, an infinite family solved in one paragraph.

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
    <button type="button" class="ip-reset">reset</button>
  </div>
  <canvas class="ip-canvas" aria-label="3D lattice cube with covering planes"></canvas>
  <p class="ip-hint">Place axis planes (each avoids the origin) and watch points get
    covered. Cover all of $S$ — you will need exactly $3n$.</p>
</div>

Alon–Füredi works, but it is awkward to *state*: "vanishes everywhere but one
point" is a mouthful, and real problems rarely hand you exactly one exceptional
point. In 1999 Noga Alon repackaged the whole circle of ideas into a single
statement that reads like a magic wand.

## The Combinatorial Nullstellensatz

> **Combinatorial Nullstellensatz (Alon, 1999).** Let $F$ be a field and
> $f \in F[x_1, \dots, x_n]$ a polynomial of total degree
> $\deg f = t_1 + \dots + t_n$. Suppose the coefficient of the monomial
> $x_1^{t_1} \cdots x_n^{t_n}$ in $f$ is **non-zero**. Then for any sets
> $S_1, \dots, S_n \subseteq F$ with $|S_i| > t_i$, there exist $s_i \in S_i$ with
> $$ f(s_1, \dots, s_n) \neq 0. $$

One non-zero top-degree coefficient guarantees a point of any sufficiently large
grid where $f$ does not vanish. That is the entire tool. The art is only ever in
*choosing the polynomial* so that the monomial you can control is the one whose
coefficient you can compute.

*Why it works, honestly.* Suppose, for contradiction, that $f$ vanished on the
whole grid $S_1 \times \dots \times S_n$. On the set $S_i$, the polynomial
$g_i(x_i) = \prod_{s \in S_i}(x_i - s)$ vanishes, and it is monic of degree
$|S_i|$; so modulo the relations $g_i = 0$ we may repeatedly replace $x_i^{|S_i|}$
by lower powers, reducing $f$ to a polynomial $\tilde f$ with $\deg_{x_i} \tilde f
< |S_i|$ for every $i$, that still vanishes on the entire grid. A polynomial with
each degree strictly below the grid size that vanishes on the whole grid must be
identically zero (this is exactly the multivariate hammer — induct with the
one-variable version on each axis). But the reduction only ever *lowers* degrees,
and since $t_i < |S_i|$, the top monomial $x_1^{t_1} \cdots x_n^{t_n}$ is never
created or destroyed by it — so its coefficient in $\tilde f$ equals its
coefficient in $f$, which is non-zero. That contradicts $\tilde f \equiv 0$.
Hence $f$ does not vanish somewhere on the grid. $\blacksquare$

The non-zero coefficient is precisely the obstruction to "vanishing everywhere."
Alon–Füredi and Chevalley–Warning both fall out as special cases — but the reason
to prefer the Nullstellensatz is that it turns every application into the same
two-step ritual: **pick $f$; compute one coefficient.**

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

*Proof of Cauchy–Davenport.* We may assume $|A| + |B| - 1 \le p$, so the bound to
beat is $|A| + |B| - 1$ (if $|A| + |B| - 1 > p$ a short separate argument shows
$A + B = \mathbb{Z}_p$). Suppose for contradiction that
$|A + B| \le |A| + |B| - 2$. Enlarge $A + B$ to a set $C$ with exactly
$|C| = |A| + |B| - 2$ elements, and define

$$ f(x, y) = \prod_{c \in C} (x + y - c). $$

Its total degree is $|C| = |A| + |B| - 2 = (|A| - 1) + (|B| - 1)$. Look at the
monomial $x^{|A|-1} y^{|B|-1}$: it has exactly that total degree, so its
coefficient in $f$ equals its coefficient in the top part $(x + y)^{|A|+|B|-2}$,
namely

$$ \binom{|A| + |B| - 2}{|A| - 1}. $$

Because $|A| + |B| - 2 < p$, this binomial coefficient has no factor of $p$, so it
is **non-zero in $\mathbb{F}_p$**. Now fire the Nullstellensatz with $S_1 = A$,
$S_2 = B$, and exponents $t_1 = |A| - 1 < |A|$, $t_2 = |B| - 1 < |B|$: there exist
$a \in A$, $b \in B$ with $f(a, b) \neq 0$. But $a + b \in A + B \subseteq C$, so
some factor $x + y - (a{+}b)$ vanishes and $f(a,b) = 0$. Contradiction. Therefore
$|A + B| \ge |A| + |B| - 1$. $\blacksquare$

Two lines of real content. The 1935 theorem is now a coefficient computation.

<div class="widget" id="cd-demolisher">
  <p class="widget-title">Widget · The Cauchy–Davenport Demolisher</p>
  <div class="cd-controls">
    <label>prime $p$ <select class="cd-p"></select></label>
    <label>|A| <input type="range" class="cd-a" min="1" max="8" value="3"></label>
    <label>|B| <input type="range" class="cd-b" min="1" max="8" value="3"></label>
  </div>
  <div class="cd-tri" aria-label="Pascal's triangle mod p"></div>
  <p class="cd-out"></p>
  <p class="cd-hint">Pascal's triangle mod $p$. The circled entry
    $\binom{|A|+|B|-2}{|A|-1}$ is the coefficient the proof needs; as long as it is
    non-zero mod $p$, the bound holds.</p>
</div>

Naturally we now push our luck. What if we forbid a summand from pairing with
itself?

## The Erdős–Heilbronn wall

Define the **restricted sumset**, where the two summands must be distinct:

$$ A \,\hat{+}\, A = \{\, a + a' \pmod p : a, a' \in A,\ a \neq a' \,\}. $$

Erdős and Heilbronn conjectured in the 1960s that removing the diagonal costs
almost nothing:

$$ |A \,\hat{+}\, A| \ge \min\{\,p,\ 2|A| - 3\,\}. $$

It looks like it should yield to the same ritual — but it does **not**, and seeing
*why* is the most instructive moment in the whole story. The natural polynomial is

$$ f(x, y) = \prod_{c \in C} (x + y - c), \qquad |C| = 2|A| - 4, $$

hoping to contradict $|A \,\hat{+}\, A| \le 2|A| - 4$. But the Nullstellensatz
with $S_1 = S_2 = A$ produces a point $(a, b) \in A \times A$ — and nothing stops
$a = b$. The theorem cannot see the constraint $a \neq b$. On the diagonal, $f$
need not vanish, so no contradiction arises. The wand passes straight through the
wall.

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

The conjecture stood for roughly thirty years. It was finally proved by Dias da
Silva and Hamidoune in 1994 using the exterior algebra — and then, a year later,
Alon, Nathanson and Ruzsa found a proof so short it fits in the margin. Their fix
is a single extra factor.

## The $(x - y)$ hack

The Nullstellensatz couldn't enforce $a \neq b$. So *build the constraint into the
polynomial*: multiply by $(x - y)$, which vanishes exactly on the diagonal.

*Proof of Erdős–Heilbronn (Alon–Nathanson–Ruzsa).* Write $m = |A|$ and assume
$2m - 3 \le p$. Suppose $|A \,\hat{+}\, A| \le 2m - 4$; take $E \supseteq
A \,\hat{+}\, A$ with $|E| = 2m - 4$ and set

$$ f(x, y) = (x - y) \prod_{e \in E} (x + y - e). $$

Then $\deg f = 1 + (2m - 4) = 2m - 3$. Target the monomial
$x^{\,m-1} y^{\,m-2}$ (total degree $2m - 3$). Its coefficient equals its
coefficient in the top part $(x - y)(x + y)^{2m-4}$, which is

$$ \binom{2m-4}{\,m-2\,} - \binom{2m-4}{\,m-1\,} \;=\; \frac{1}{m-1}\binom{2m-4}{\,m-2\,} \;=\; C_{m-2}, $$

the $(m{-}2)$-th **Catalan number**. Since $2m - 4 < p$ and $m - 1 < p$, this is
non-zero in $\mathbb{F}_p$. Fire the Nullstellensatz with $S_1 = S_2 = A$ and
$t_1 = m - 1 < m$, $t_2 = m - 2 < m$: there exist $a, b \in A$ with
$f(a, b) \neq 0$. The factor $(x - y)$ forces $a \neq b$; the rest forces
$a + b \notin E \supseteq A \,\hat{+}\, A$. But $a \neq b$ with $a, b \in A$ means
$a + b \in A \,\hat{+}\, A$. Contradiction. $\blacksquare$

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

The same "insert a factor that encodes the forbidden set" move is the whole
toolbox: forbid a diagonal with $(x-y)$, forbid a hyperplane with a linear form,
forbid repeats with a Vandermonde. Next we stop caring that the ground set is a
prime field at all.

## The Károlyi extension: beyond prime fields

Everything so far leaned on $\mathbb{Z}_p$ being a field — that is what let a
non-zero binomial or Catalan number remain non-zero. What about a general finite
abelian group $G$, where there is no field structure and zero-divisors abound?

The obstruction is real: in $\mathbb{Z}_6$, the set $A = \{0, 2, 4\}$ has
$A + A = \{0, 2, 4\}$, only $3$ elements, far below $2|A| - 1 = 5$ — the even
subgroup swallows the sumset. Any theorem must make room for subgroups. The
governing quantity turns out to be the smallest prime dividing $|G|$.

> **Károlyi (2004–2005).** Let $G$ be a finite abelian group whose smallest prime
> divisor is $p$, and let $A \subseteq G$ be non-empty. Then the restricted
> sumset obeys
> $$ |A \,\hat{+}\, A| \ge \min\{\,p,\ 2|A| - 3\,\}. $$

The prime $p$ replaces the field size, and cyclic-of-prime-order recovers
Erdős–Heilbronn exactly. The proof route embeds the problem into a field: one
works over $\mathbb{Z}_p$ (or an extension) and controls the group via characters
and the polynomial method, so the Nullstellensatz's coefficient test survives the
move to $G$. The moral is that the polynomial method was never really about
$\mathbb{Z}_p$ — it was about having a place to check that one coefficient is
non-zero, and the smallest prime divisor is exactly where that check has room to
succeed.

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
apparently from nowhere, in graph theory.

## The Alon–Tarsi theorem: coloring from lists

A graph $G$ is **$k$-choosable** (list-colorable) if, whenever every vertex is
handed its own list of $k$ allowed colors, a proper coloring can always be chosen
from the lists. This is strictly harder than ordinary $k$-coloring, where all
vertices share one palette. Encode a graph on vertices $1, \dots, n$ by its
**graph polynomial**

$$ f_G(x_1, \dots, x_n) = \prod_{\substack{(i,j) \in E \\ i < j}} (x_i - x_j). $$

A proper coloring is an assignment giving distinct values to adjacent vertices —
that is, a point where $f_G \neq 0$. So list coloring is *exactly* a
Nullstellensatz question: if $S_i$ is vertex $i$'s list, we want a grid point of
$S_1 \times \dots \times S_n$ where $f_G$ is non-zero.

> **Alon–Tarsi (1992).** Orient the edges of $G$ as a digraph $D$ with out-degrees
> $d_1, \dots, d_n$. If the number of **even** spanning Eulerian sub-digraphs of
> $D$ differs from the number of **odd** ones, then $G$ is choosable from any lists
> of sizes $|S_i| = d_i + 1$.

The link to everything above: that even/odd difference is exactly the coefficient
of $x_1^{d_1} \cdots x_n^{d_n}$ in $f_G$. When it is non-zero, the Combinatorial
Nullstellensatz (with $t_i = d_i$, $|S_i| = d_i + 1 > t_i$) hands over a proper
list coloring. A clean corollary: every planar bipartite graph is $3$-choosable,
because such graphs admit an orientation with all out-degrees $\le 2$ and the
Eulerian counts do not cancel.

<div class="widget" id="alon-tarsi">
  <p class="widget-title">Widget · List Coloring &amp; the Graph Polynomial</p>
  <div class="at-controls">
    <button type="button" class="at-ex" data-g="c4">C₄ (4-cycle)</button>
    <button type="button" class="at-ex" data-g="k4">K₄</button>
    <button type="button" class="at-ex" data-g="path">Path P₄</button>
    <label>list size $k$ <input type="range" class="at-k" min="1" max="4" value="2"></label>
  </div>
  <canvas class="at-canvas" aria-label="graph with per-vertex color lists"></canvas>
  <p class="at-out"></p>
  <p class="at-hint">Each vertex gets a random size-$k$ list. Click a vertex to cycle
    its color through its list; make every edge non-monochromatic. The readout shows
    the graph-polynomial coefficient that guarantees a solution exists.</p>
</div>

The word "Nullstellensatz" is of course borrowed. It is worth meeting the
ancestor.

## Hilbert's Nullstellensatz: the ancestor

Hilbert's theorem (1893) is the foundational dictionary between algebra and
geometry, over an algebraically closed field $k$ such as $\mathbb{C}$.

> **Weak Nullstellensatz.** Polynomials $f_1, \dots, f_m \in k[x_1, \dots, x_n]$
> have no common zero in $k^n$ if and only if there exist $g_1, \dots, g_m$ with
> $$ g_1 f_1 + \dots + g_m f_m = 1. $$

> **Strong Nullstellensatz.** For an ideal $J$, a polynomial vanishes on the whole
> common zero set $V(J)$ if and only if some power of it lies in $J$; compactly,
> $\mathbf{I}(\mathbf{V}(J)) = \sqrt{J}$.

Both say the same thing in spirit as Alon's: **there is no gap between geometry
and algebra** — a vanishing pattern is always explained by an algebraic identity.
Hilbert answers "when is there *no* common zero" over an infinite closed field;
Alon answers "when must there *be* a non-zero" over a finite grid. Alon's is not a
corollary of Hilbert's, but the name is a deliberate homage: both are
Nullstellensätze — "zero-locus theorems" — asserting that where a polynomial
vanishes is dictated by its algebra.

<div class="widget" id="hilbert">
  <p class="widget-title">Widget · Vanishing Loci</p>
  <div class="hb-controls">
    <button type="button" class="hb-ex is-on" data-c="circle">circle</button>
    <button type="button" class="hb-ex" data-c="parabola">parabola</button>
    <button type="button" class="hb-ex" data-c="two">two lines</button>
    <button type="button" class="hb-ex" data-c="cubic">cubic</button>
  </div>
  <canvas class="hb-canvas" aria-label="real vanishing locus of a polynomial in two variables"></canvas>
  <p class="hb-hint">The curve is $V(f)=\{f=0\}$. The Nullstellensatz says the algebra
    of $f$ knows this geometry exactly — an intuition Alon carried into the finite,
    combinatorial world.</p>
</div>

We end at the frontier, on a problem where the polynomial method did not merely
reprove a known bound but shattered one that had stood for decades.

## The slice-rank revolution: cap sets

A **cap set** is a subset of $\mathbb{F}_3^{\,n}$ containing no line — no three
distinct points $x, y, z$ with $x + y + z = 0$, equivalently no non-trivial
$3$-term arithmetic progression. How large can a cap set be? The trivial bound is
$3^n$; the question is the exponential *rate*. For years the best upper bound was
only barely sub-trivial, $O(3^n / n^{1+\varepsilon})$, and many believed the truth
was close to $3^n$.

<div class="widget" id="cap-set">
  <p class="widget-title">Widget · The Cap Set Game</p>
  <div class="cs-controls">
    <label>dimension $n$ <select class="cs-n"><option value="2">2 (9 pts)</option><option value="3">3 (27 pts)</option></select></label>
    <span class="cs-stat"></span>
    <button type="button" class="cs-clear">clear</button>
  </div>
  <canvas class="cs-canvas" aria-label="F_3^n grid; build a set with no line"></canvas>
  <p class="cs-out"></p>
  <p class="cs-hint">Click points to add them to your set. A red flash means you just
    completed a line $x+y+z=0$ — not allowed. How large a cap can you build? (Max is
    $4$ for $n=2$, $9$ for $n=3$.)</p>
</div>

Then in 2016 the dam broke. Croot, Lev and Pach cracked the analogous problem in
$\mathbb{Z}_4^n$ with a startlingly simple polynomial argument; within days
Ellenberg and Gijswijt adapted it to $\mathbb{F}_3^{\,n}$.

> **Ellenberg–Gijswijt (2016).** Every cap set in $\mathbb{F}_3^{\,n}$ has size at
> most $3\,\gamma^{\,n}$, where
> $\gamma = \min_{0 < x \le 1} \dfrac{1 + x + x^2}{x^{2/3}} \approx 2.7551$. In
> particular cap sets are exponentially thinner than the whole space.

The engine is Tao's reformulation via **slice rank**. Encode the "no line"
condition in a tensor $T$ on $A \times A \times A$ that is non-zero exactly on the
diagonal $x = y = z$. On one hand its slice rank is $|A|$, since a diagonal tensor
of $|A|$ non-zero entries has slice rank exactly $|A|$. On the other hand $T$ is
built from a low-degree polynomial — by Croot–Lev–Pach, reduction modulo
$x_i^3 = x_i$ keeps only monomials $\prod x_i^{a_i}$ with $a_i \in \{0,1,2\}$ and
total degree at most $\tfrac{2n}{3}$ on the relevant side — so its slice rank is
bounded by the *number* of such monomials, which is $O(\gamma^n)$ with the
$\gamma$ above by a Chernoff/entropy count. Equating the two,
$|A| \le 3\gamma^n$. The whole proof is a page.

That is the polynomial method at full power: the same reflex that turned
Cauchy–Davenport into a binomial coefficient — *build the right polynomial, read
off one number* — resolved a central problem in additive combinatorics that
classical Fourier analysis could not touch. A single non-zero (or, here,
low-rank) algebraic quantity, standing in for an entire combinatorial
impossibility.

## The one idea

Strip away the specifics and every argument here is the same two-step reflex:

1. **Encode.** Turn the combinatorial object — a set, a grid, a graph, a cap —
   into a polynomial or tensor whose vanishing mirrors the property you care
   about.
2. **Read one number.** Exhibit a single coefficient (or rank) that is non-zero,
   and let rigidity — the univariate hammer, generalized — force the configuration
   you want into existence.

Cauchy–Davenport, an Olympiad problem, graph coloring, and the cap-set bound are
not really different theorems. They are one theorem, wearing different disguises,
and the Combinatorial Nullstellensatz is the sentence that says so.

<script src="{% include post_asset.html file='js/sumset-playground.js' %}" defer></script>
<script src="{% include post_asset.html file='js/polynomial-encoder.js' %}" defer></script>
<script src="{% include post_asset.html file='js/chevalley-warning.js' %}" defer></script>
<script src="{% include post_asset.html file='js/grid-vanisher.js' %}" defer></script>
<script src="{% include post_asset.html file='js/imo-planes.js' %}" defer></script>
<script src="{% include post_asset.html file='js/nullstellensatz.js' %}" defer></script>
<script src="{% include post_asset.html file='js/cauchy-davenport.js' %}" defer></script>
<script src="{% include post_asset.html file='js/erdos-heilbronn.js' %}" defer></script>
<script src="{% include post_asset.html file='js/xy-hack.js' %}" defer></script>
<script src="{% include post_asset.html file='js/karolyi.js' %}" defer></script>
<script src="{% include post_asset.html file='js/alon-tarsi.js' %}" defer></script>
<script src="{% include post_asset.html file='js/hilbert.js' %}" defer></script>
<script src="{% include post_asset.html file='js/cap-set.js' %}" defer></script>
