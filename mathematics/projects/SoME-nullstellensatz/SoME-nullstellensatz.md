---
layout: post
title: "The Polynomial Cheat Code: From Sumsets to the Nullstellensatz"
date: 2026-08-16
ref: nullstellensatz
excerpt: "How a single non-zero polynomial coefficient can obliterate combinatorics problems, from Cauchy-Davenport to IMO 2007/6."
tags: [3B1B, SoME 5, Combinatorics, Algebra]
math: true
---

<link rel="stylesheet" href="{% include post_asset.html file='widgets.css' %}">

<!--
  DRAFT SCAFFOLD — prose is placeholder for pi625 to rewrite (SoME policy).
  Devin's contribution here: structure, LaTeX formatting, widget JS, math checks.
  Widgets: #poly-encoder (Widget 2) is live. Others are mount points awaiting JS.
-->

## The sumset puzzle

Pick any 4 numbers from $\{0,1,2,3,4,5,6\}$. Add every possible pair together, wrapping
around modulo $7$. How many *distinct* numbers do you get?

Fix a prime $p$ and two sets $A, B \subseteq \mathbb{Z}_p$. Their **sumset** is

$$ A + B = \{\, a + b \pmod p : a \in A,\ b \in B \,\}. $$

Over the integers, sumsets are tame: if $A = \{1,2\}$ and $B = \{10,20\}$ the sums
$11 < 12 < 21 < 22$ are strictly ordered, with a clear minimum and maximum. Over a
finite field $\mathbb{Z}_p$ the modulo operation is a *wraparound* — the number line
becomes a circle, $5 + 5 = 3$ in $\mathbb{Z}_7$ — and that circular structure destroys
the ordering intuition. Counting $|A+B|$ starts to feel like tracking balls in a pinball
machine.

<div class="widget" id="sumset-playground">
  <p class="widget-title">Widget 1 · The Sumset Playground</p>
  <p class="widget-placeholder">Interactive $\mathbb{Z}_p$ clock — mount point for pi625's existing Widget 1 code.</p>
</div>

Play with different primes and set sizes. What is the worst case for $|A+B|$? If you
guessed that $|A+B|$ never drops below $\min(p,\ |A| + |B| - 1)$, you rediscovered the
**Cauchy–Davenport theorem** (1935). Historically this meant messy case analysis. We
will instead build a tool that sledgehammers it in two lines — but to get there, we take
a detour that looks completely unrelated.

Recall the Fundamental Theorem of Algebra: a non-zero univariate polynomial of degree
$d$ has at most $d$ roots. Beautiful, but one-dimensional. What happens in $n$ dimensions?

## The encoding, and the univariate hammer

Here is the pivot: translate discrete sets into algebra. Encode a set
$A = \{a_1, \dots, a_m\}$ by the polynomial that annihilates exactly its elements,

$$ P_A(x) = \prod_{i=1}^{m} (x - a_i), $$

so that $P_A(a) = 0 \iff a \in A$. Membership in a set becomes *being a root of a
polynomial* — combinatorics on one side, algebra on the other. That bridge is the whole
game.

Why bother? Because polynomials are rigid. A degree-$d$ polynomial has at most $d$
roots, so a degree-$d$ polynomial that vanishes at $d+1$ distinct points is *identically
zero*. Polynomials become **detectors**: build one that encodes a problem, prove it
vanishes often enough, and rigidity forces it to be zero — which forces structure back
on the combinatorics.

<div class="widget" id="poly-encoder">
  <p class="widget-title">Widget 2 · The Polynomial Encoder</p>
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
  <p class="pw-hint">Click the number line to build $A$. The plot crosses zero exactly at
    your chosen points. Now drop the target degree below $|A|$ and watch the polynomial
    collapse.</p>
</div>

This univariate hammer is lovely, but Cauchy–Davenport has *two* sets. We must go to
higher dimensions — and there we hit a wall.

## Chevalley–Warning: pigeonhole on steroids

Before Alon there was Chevalley and Warning (1935), studying systems of polynomial
equations over $\mathbb{F}_p$.

> **Theorem (Chevalley–Warning).** Let $f_1, \dots, f_k \in \mathbb{F}_p[x_1, \dots, x_n]$.
> If $\sum_i \deg(f_i) < n$, then the number of common zeros in $\mathbb{F}_p^{\,n}$ is
> divisible by $p$.

The punchline: if you already know *one* solution exists (say the trivial
$(0,\dots,0)$), then the count is a positive multiple of $p$ — so there are at least $p$
solutions. It manufactures solutions out of a degree inequality.

<!-- MATH NOTE (Devin): the draft's original example — "any p-1 integers have a nonempty
     subsequence summing to 0 mod p" — is FALSE (take p-1 copies of 1). The canonical,
     correct Chevalley-Warning application is Erdos-Ginzburg-Ziv / the Davenport constant,
     stated below. Flagging for pi625; rewrite prose as you like. -->

A canonical application is the **Erdős–Ginzburg–Ziv** theorem: among any $2p-1$ integers,
some $p$ of them sum to a multiple of $p$. Encode a choice of subset by variables
$x_1, \dots, x_{2p-1}$ and use two polynomials of degree $p-1$,

$$ f_1 = \sum_{i} a_i\, x_i^{\,p-1}, \qquad f_2 = \sum_{i} x_i^{\,p-1}, $$

built so that Fermat's little theorem ($x^{p-1} \in \{0,1\}$) turns "is $x_i$ chosen?"
into an indicator. Here $n = 2p-1$ variables and $\sum \deg f_i = 2(p-1) = 2p - 2 < n$,
so Chevalley–Warning applies. The trivial zero is one common solution, so a *second*
common solution exists — and that second solution encodes exactly $p$ chosen indices
whose $a_i$ sum to $0 \pmod p$.

<div class="widget" id="chevalley-scale">
  <p class="widget-title">Widget 3 · The Chevalley–Warning Scale</p>
  <p class="widget-placeholder">Balance scale comparing $\sum \deg(f_i)$ against $n$ — mount point (JS pending).</p>
</div>

Chevalley–Warning is blunt, though: it only sees vanishing on the **whole** field
$\mathbb{F}_p^{\,n}$. Cauchy–Davenport lives on a tiny arbitrary grid $A \times B$, and
Chevalley–Warning is blind to grids. We need a sharper blade.

## Alon–Füredi: the degree pays the price

Take a grid $A_1 \times \dots \times A_n$ and a polynomial that vanishes on all of it
*except one point*.

> **Theorem (Alon–Füredi, 1993, special case).** If $f$ is non-zero at exactly one point
> of the grid $A_1 \times \dots \times A_n$ and zero on all the others, then
> $$ \deg(f) \ge \sum_{i=1}^{n} (|A_i| - 1). $$

You cannot *almost* vanish on a grid cheaply. On a $3 \times 3$ grid, sparing a single
point costs degree at least $(3-1)+(3-1) = 4$. Every point you add taxes the degree. The
proof is an induction on variables: the one-variable case is the Fundamental Theorem of
Algebra, and slicing the grid reduces $n$ variables to $n-1$.

<div class="widget" id="grid-vanisher">
  <p class="widget-title">Widget 4 · The Grid Vanisher</p>
  <p class="widget-placeholder">Toggle grid cells to vanish; watch the degree meter $(|A|-1)+(|B|-1)$ — mount point (JS pending).</p>
</div>

This is a sledgehammer. Let us swing it at an Olympiad problem.

## IMO 2007/6: the first kill

> **Problem.** Let $n$ be a positive integer and let
> $$ S = \{(x,y,z) : x,y,z \in \{0,1,\dots,n\}\} \setminus \{(0,0,0)\}. $$
> Find the smallest number of planes whose union contains $S$ but not the origin.

We have an $(n+1)^3$ grid and want to cover every point except the origin, using planes
that avoid the origin. Coordinate planes $x=0$ would help, but they pass through the
origin, so they are banned: every usable plane has a non-zero constant term.

**Translation.** Suppose $m$ planes work. Write each as a linear form
$L_i(x,y,z) = a_i x + b_i y + c_i z + d_i$. Avoiding the origin means
$L_i(0,0,0) = d_i \neq 0$. Multiply them:

$$ f(x,y,z) = \prod_{i=1}^{m} L_i(x,y,z). $$

Then $\deg f = m$; $f$ vanishes on every point of $S$ (each lies on some plane); and
$f(0,0,0) = \prod_i d_i \neq 0$. So $f$ vanishes on the whole grid $\{0,\dots,n\}^3$
**except** the origin.

**The kill.** That is exactly the Alon–Füredi setup with $|A_i| = n+1$:

$$ m = \deg f \ge (n+1-1)\cdot 3 = 3n. $$

Three lines. And $3n$ is achievable — the planes $x=k, y=k, z=k$ for $k \in \{1,\dots,n\}$
are $3n$ planes avoiding the origin and covering everything. The answer is exactly $3n$,
and the same argument gives $kn$ for the $k$-dimensional version for free.

<div class="widget" id="imo-planes">
  <p class="widget-title">Widget 5 · The IMO Plane Placer</p>
  <p class="widget-placeholder">3D grid where you drop planes and watch coverage vs. the $3n$ bound — mount point (JS pending).</p>
</div>

Alon–Füredi is powerful but clunky to state. Can we repackage it into one clean, magical
tool? Yes — the Combinatorial Nullstellensatz. *(Sections 6–13 continue from here.)*

<script src="{% include post_asset.html file='js/polynomial-encoder.js' %}" defer></script>
