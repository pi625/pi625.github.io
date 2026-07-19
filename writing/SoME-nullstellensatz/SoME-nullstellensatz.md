---
layout: post
title: "The Combinatorial Nullstellensatz, from scratch"
date: 2026-07-18
ref: nullstellensatz
tags: [3B1B, SoME 5]
---

## A warm-up: how small can a sumset be?

Given two finite sets of integers $A, B \subseteq \mathbb{Z}$, their **sumset** is

$$ A + B = \{\, a + b : a \in A,\ b \in B \,\}. $$

How small can $A + B$ be? Line the elements up:
if $A = \{a_1 < \dots < a_m\}$ and $B = \{b_1 < \dots < b_n\}$, then

$$ a_1 + b_1 < a_1 + b_2 < \dots < a_1 + b_n < a_2 + b_n < \dots < a_m + b_n $$

is a strictly increasing chain of $m + n - 1$ distinct sums. Hence

$$ |A + B| \ge |A| + |B| - 1. $$

> **Try it.** Take $A = \{0, 1, 4\}$ and $B = \{0, 2\}$. The bound predicts at least
> $3 + 2 - 1 = 4$ elements — check that $A + B = \{0, 1, 2, 3, 4, 6\}$ comfortably beats it,
> and find sets that hit the bound exactly.

## Encoding sets as polynomials

Here is the pivot. Encode a set $A = \{a_1, \dots, a_m\}$ by the polynomial

$$ P_A(x) = \prod_{i=1}^{m} (x - a_i). $$

The set is now the *root pattern* of a polynomial, and questions about the set
become questions about degrees and coefficients. This bridge — combinatorics on one
side, algebra on the other — is the whole game.

## The theorem

Alon's **Combinatorial Nullstellensatz** makes the bridge precise.

> **Theorem (Alon, 1999).** Let $F$ be a field and $f \in F[x_1, \dots, x_n]$ a
> polynomial of total degree $\sum_{i} t_i$. Suppose the coefficient of
> $\prod_i x_i^{t_i}$ in $f$ is non-zero. If $S_1, \dots, S_n \subseteq F$ with
> $\lvert S_i \rvert > t_i$, then there exist $s_i \in S_i$ such that
>
> $$ f(s_1, \dots, s_n) \neq 0. $$

Read it as a guarantee: **one** non-zero top coefficient forces the existence of a
point, in any large enough grid, where $f$ does not vanish. That single algebraic
fact reproduces a startling range of combinatorial results.

## Why it works, in one paragraph

If $f$ vanished on the entire grid $S_1 \times \dots \times S_n$, you could reduce
$f$ modulo the vanishing polynomials $g_i(x_i) = \prod_{s \in S_i}(x_i - s)$ without
raising any partial degree past $\lvert S_i \rvert - 1$. But that reduction can never touch the
monomial $\prod_i x_i^{t_i}$ (each exponent $t_i$ is too small to be rewritten), so
its coefficient would have to be zero — a contradiction. The non-zero coefficient is
exactly the obstruction to "vanishing everywhere."

## Cauchy–Davenport, for free

Over $\mathbb{Z}/p\mathbb{Z}$ the same warm-up bound survives modular wraparound:

$$ |A + B| \ge \min\{\,p,\ |A| + |B| - 1\,\}. $$

Assume it fails. Pick a set $C \supseteq A + B$ with $\lvert C \rvert = \lvert A \rvert + \lvert B \rvert - 2$ and study

$$ f(x, y) = \prod_{c \in C} (x + y - c). $$

Its total degree is $\lvert A \rvert + \lvert B \rvert - 2$, and the coefficient of $x^{\lvert A \rvert-1} y^{\lvert B \rvert-1}$ is
the binomial coefficient $\binom{\lvert A \rvert + \lvert B \rvert - 2}{\lvert A \rvert - 1} \not\equiv 0 \pmod p$. The
Nullstellensatz then hands us $a \in A$, $b \in B$ with $f(a,b) \neq 0$ — but $a + b
\in A + B \subseteq C$ makes some factor vanish. Contradiction. The bound holds.

## Where to go next

The same coefficient test yields Erdős–Heilbronn on restricted sums, Chevalley–Warning
on solutions of polynomial systems over finite fields, and slick olympiad solutions.
Each is a short post of its own — the point of this one was the mechanism: *pick the
polynomial so that the monomial you care about cannot be rewritten, then let a single
non-zero coefficient do the rest.*
