---
title: When C++ O3 is Slower than O2
description: Performance surprises in C++ optimization levels.
date: 2025-10-26
katex: true
---

> I explain a bit about the language standards and compilers first. Feel free to
> [jump to the examples](#examples).

I like C++. I first learned it in mid 2015 and have been using it actively ever
since for various purposes, including at multiple big firms. At this point, I'm
not surprised by the amount of learning and surprises to expect from C++.

It provides a lot of freedom, perhaps too much for its own good. That makes it
dangerously easy to write bad code or hack around problems. But that's a topic
for another blog post.

I like to keep myself up to date with C++ language standard and new features by
reading [cppreference](https://en.cppreference.com/) and sometimes
[ISO C++ proposals](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/).
However, the compilers are another thing entirely. They rapidly evolve and have
their own sets of specifications and quirks.

The language standard acts like a contract that defines what happens when given
code is written while leaving the compiler free to do whatever it wants to
achieve that, as long as the observable behavior matches. For instance, signed
integer overflow is undefined behavior: if `int x = INT_MAX; ++x;` occurs, the
standard says nothing about what happens next; one compiler may wrap around,
another may optimize the code away entirely, and both would still be conforming.

One of the most important roles of the compiler is, thus, optimization. As long
as the resulting program behaves as the written code specifies, the compiler can
rearrange, remove, or add instructions to make it faster or smaller. You'd be
surprised how far it goes.

Over time, C++ compilers have ended up with a list of so-called compiler
optimizations that they apply to a program. For example, _inlining functions_
means the compiler might replace a function call with the actual body of the
function to avoid the overhead of the call. _Loop unrolling_ means the compiler
might duplicate the body of a loop multiple times to reduce the number of
iterations and branching. And so on.

To make it easier for users to apply these optimizations, most compilers provide
optimization flags like `-finline-functions` or `-funroll-loops`. I will use GCC
and Clang as examples, but other compilers have similar flags. And these
compilers also provide optimization presets like `-O0`, `-O1`, `-O2`, `-O3`, and
`-Ofast` that enable a set of optimizations at once. There are also flags like
`-Os` and `-Oz` that optimize for size instead of speed.

> **Note:** These shortcut flags are not pure presets and might end up doing
> more than just enabling individual flags. To quote from GCC documentation:
> "Not all optimizations are controlled directly by a flag."

The higher the optimization level, the more optimizations are applied. `-O0` is
the default and applies no optimizations, while `-O3` applies the most
optimizations. `-Ofast` goes even further by enabling optimizations that might
break strict compliance with the language standard, such as assuming that
floating-point math is associative. I recommend skimming through the GCC
optimization options
[here](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html) to get a sense
of the variety of optimizations available.

Now, naturally, one would expect that higher optimization levels would always
lead to better performance. And in almost all cases, they do. However, there are
some surprising cases more optimizations might actually lead to worse
performance. Even Red Hat and Fedora used to compile Python with `O2` for ~1%
speedup
([source](https://github.com/faster-cpython/ideas/issues/97#issuecomment-957870398)).

Below, I will show a couple examples where `O3` performs worse than `O2` in
modern compilers (as of 2025), and dig into the reasons behind it as a learning
experience. An older famous example is the
[bubble sort benchmark](https://news.ycombinator.com/item?id=28895896) from 10
years ago, but that's already fixed in modern compilers.

---

<div id="examples"/>

All code is compiled and run using `gcc (GCC) 15.2.1` and/or
`clang version 21.1.4` on my `6.17.1-arch1-1 x86_64` system. No battery-saving
or efficiency modes are enabled. Feel free to try the examples on your own
system and compiler installation.

## Example 1: Recursive Fibonacci

Consider the following code:

```cpp
#include <iostream>

int fib(int n) {
    if (n <= 1) {
        return n;
    }
    return fib(n - 2) + fib(n - 1);
}

int main() {
    std::cout << fib(42) << "\n";
    return 0;
}
```

Benchmark command:

```bash
for o in 0 1 2 3; do g++ fibo.cpp -O$o -o exe_fibo$o; done
hyperfine ./exe_fibo*
```

Results:

```bash small
Benchmark 1: ./exe_fibo0
  Time (mean ± σ):      1.537 s ±  0.002 s    [User: 1.532 s, System: 0.001 s]
  Range (min … max):    1.535 s …  1.540 s    10 runs

Benchmark 2: ./exe_fibo1
  Time (mean ± σ):      1.033 s ±  0.006 s    [User: 1.030 s, System: 0.001 s]
  Range (min … max):    1.023 s …  1.040 s    10 runs

Benchmark 3: ./exe_fibo2
  Time (mean ± σ):     335.0 ms ±   4.2 ms    [User: 333.0 ms, System: 1.2 ms]
  Range (min … max):   328.0 ms … 343.5 ms    10 runs

Benchmark 4: ./exe_fibo3
  Time (mean ± σ):     378.6 ms ±   5.1 ms    [User: 376.8 ms, System: 0.9 ms]
  Range (min … max):   372.5 ms … 387.8 ms    10 runs

Summary
  ./exe_fibo2 ran
    1.13 ± 0.02 times faster than ./exe_fibo3
    3.08 ± 0.04 times faster than ./exe_fibo1
    4.59 ± 0.06 times faster than ./exe_fibo0
```

As we can see, `-O3` performs a significant 13% worse than `-O2`. Why is that?

There are usually two ways to investigate such performance surprises: looking at
the generated assembly code or selectively disabling O3-only flags to see which
ones cause the slowdown. For such small example, looking at perf reports
wouldn't be useful as there aren't many instructions to analyze.

### Assembly Analysis

Looking at [the assembly code](https://godbolt.org/z/K8qGsarvM), we can see that
`-O3` version has 279 instructions while `-O2` has only 247. Number of
instructions is not necessarily a good indicator of performance, but it means
there's more going on to investigate. We also see that the only diff happens
inside `main` function.

While `-O2` simply calls `fib(42)`, `-O3` does something pretty impressive. It
runs the following sum instead and adds 1 at the end:

$$\sum_{i=0}^{40} \text{fib}(i) $$

Why that works is, we have an identity that states: $ \text{fib}(n) = 1 +
\sum\_{i=0}^{n-2} \text{fib}(i) $ for $ n \geq 2 $.

This means there must be some optimization in `-O3` that analyzes the recursion
and derives this formula to "speed up" the computation.

### Flag Analysis

It's certainly possible that the difference is caused by multiple flags working
together, or an implicitly enabled optimization (as mentioned earlier, `-O3` is
not just a preset of flags and might do a bit more). But we can still try our
chances with single flags.

I coded a
[quick script](https://gist.github.com/BarishNamazov/61b5829c1ec53eda35084ba9604b774a)
to compile the code with `-O2` and `-O3` as baselines, and then added each `-O3`
flag one by one on top of `-O2` to see if any of them causes a slowdown. The
script also checks generated assembly avoid unnecessary benchmarking when the
assembly is identical to either baseline.

```bash tiny
$  python find_culprit.py fibo.cpp
Analyzing optimization flags for: fibo.cpp

Found 13 additional flags in O3 compared to O2
Flags: -fgcse-after-reload, -fipa-cp-clone, -floop-interchange, -floop-unroll-and-jam, -fpeel-loops, -fpredictive-commoning, -fsplit-loops, -fsplit-paths, -ftree-loop-distribution, -ftree-partial-pre, -funroll-completely-grow-size, -funswitch-loops, -fversion-loops-for-strides

Generating baseline assemblies...
Analyzing flags by assembly comparison...

Results:
  Same assembly with O2: -fgcse-after-reload, -floop-interchange, -floop-unroll-and-jam, -fpeel-loops, -fpredictive-commoning, -fsplit-loops, -fsplit-paths, -ftree-loop-distribution, -ftree-partial-pre, -funroll-completely-grow-size, -funswitch-loops, -fversion-loops-for-strides
  Same assembly with O3: None
  Different assembly: -fipa-cp-clone

Compiling 3 binaries for benchmarking...

Running benchmarks...

Benchmark 1: O2
  Time (mean ± σ):     283.9 ms ±  11.3 ms    [User: 282.1 ms, System: 1.0 ms]
  Range (min … max):   263.6 ms … 294.5 ms    11 runs

Benchmark 2: O3
  Time (mean ± σ):     324.8 ms ±  15.8 ms    [User: 322.9 ms, System: 1.0 ms]
  Range (min … max):   306.5 ms … 344.8 ms    10 runs

Benchmark 3: O2+-fipa-cp-clone
  Time (mean ± σ):     301.1 ms ±  15.5 ms    [User: 298.7 ms, System: 1.4 ms]
  Range (min … max):   284.0 ms … 323.0 ms    10 runs

Summary
  O2 ran
    1.06 ± 0.07 times faster than O2+-fipa-cp-clone
    1.14 ± 0.07 times faster than O3
```

So we do notice that adding `-fipa-cp-clone` on top of `-O2` causes a slowdown,
and looking at the new [assembly diff](https://godbolt.org/z/3Gh9xKME6), we can
confirm that the a derived formula for Fibonacci is used as well. Ironically, O3
is still slower than O2 with just this flag added, meaning the other added
optimizations still hurt.

### What is `-fipa-cp-clone`?

To quote GCC documentation:

> `-fipa-cp-clone`
>
> Perform function cloning to make interprocedural constant propagation
> stronger. When enabled, interprocedural constant propagation performs function
> cloning when externally visible function can be called with constant
> arguments. Because this optimization can create multiple copies of functions,
> it may significantly increase code size (see --param
> ipa-cp-unit-growth=value).

In simpler terms, if a function `foo(int mode)` is usually called with
`mode = 1`, the compiler using `-fipa-cp-clone` may create a specialised
version, e.g. `foo_const_1()`, where mode is treated as a constant. This allows
the compiler to remove unnecessary branches and optimise the code inside that
version for faster execution.

Our Fibonacci function indeed is called with constant values. However, don't be
fooled into thinking our performance hurts only because we use `42` as a
constant input. If you take a look at a
[version](https://godbolt.org/z/eE746drrn) where we feed `n` from stdin, `O3`
version is still doing the sum trick and is still slower than `O2`.

It seems that the compiler is smart enough to simulate the `fib` function with
constant inputs and derive the sum formula using some recursion analysis.
`-fipa-cp-clone` is not the sole responsible, but it seems to be the trigger
that makes the compiler do this extra work.

I'm certainly not an expert in compilers, so the above is my best guess. If you
have more insights, please send me an email!

### Order of recursion calls

Before moving on, one last interesting observation. Changing the return value
from `fib(n-2) + fib(n-1)` to `fib(n-1) + fib(n-2)` changes the performance as
well.

With this change, `O3` gets a bit faster but `O2` gets a bit slower. The
previous `O2` is still the winner overall. And `O3` here still uses the sum
trick but in a slightly different way. I will leave this as an exercise to the
reader to investigate!

## Example 2: Tricking the compiler

In this example, I am going to play a little bit dirty. Consider the following
code:

```cpp small
#include <cstdint>
#include <iostream>
#include <vector>

uint32_t compute_checksum(const uint8_t* data, size_t len) {
    uint32_t sum = 0;
    for (size_t i = 0; i < len; i++) {
        sum += data[i];
    }
    return sum;
}

int main() {
    const size_t SIZE       = 1024 * 1024 * 10; // 10MB
    const int    ITERATIONS = 51;

    std::vector<uint8_t> data(SIZE);
    for (size_t i = 0; i < SIZE; i++) {
        data[i] = (i * 137 + 41) % 256; // Pseudo-random pattern
    }

    uint32_t result = 0;
    for (int iter = 0; iter < ITERATIONS; iter++) {
        result ^= compute_checksum(data.data(), SIZE);
    }

    std::cout << "Checksum: " << std::hex << result << std::dec << std::endl;
    return 0;
}
```

Here I'm actually doing `xor` over the same checksum. But `xor` has a property
that `a ^ a = 0`, so the final result is always a single call to
`compute_checksum` as 51 is an odd number.

For the example above, neither GCC nor Clang uses that property and recalculates
the result for every iteration. As a result, both `-O2` and `-O3` versions
perform similarly, even though Clang is significantly faster than GCC. Here are
the benchmark results:

```bash small
Benchmark 1: ./exe_gcc_checksum_O2
  Time (mean ± σ):      76.1 ms ±   3.6 ms    [User: 71.4 ms, System: 4.3 ms]
  Range (min … max):    69.1 ms …  82.6 ms    39 runs

Benchmark 2: ./exe_gcc_checksum_O3
  Time (mean ± σ):      77.6 ms ±   4.4 ms    [User: 72.7 ms, System: 4.4 ms]
  Range (min … max):    70.6 ms …  86.2 ms    41 runs

Benchmark 3: ./exe_clang_checksum_O2
  Time (mean ± σ):      30.3 ms ±   5.1 ms    [User: 25.7 ms, System: 4.2 ms]
  Range (min … max):    20.7 ms …  41.3 ms    100 runs

Benchmark 4: ./exe_clang_checksum_O3
  Time (mean ± σ):      30.3 ms ±   4.3 ms    [User: 25.9 ms, System: 4.1 ms]
  Range (min … max):    22.1 ms …  40.9 ms    93 runs
```

But above checksum is pretty weak. Let's write a more realistic version:

```cpp small
uint32_t compute_checksum(const uint8_t* data, size_t len) {
    uint32_t sum1 = 1;
    uint32_t sum2 = 0;

    for (size_t i = 0; i < len; i++) {
        uint8_t byte = data[i];

        if (byte < 32) {
            sum1 = (sum1 + byte) % 65521;
        } else if (byte < 64) {
            sum1 = (sum1 + byte * 2) % 65521;
        } else if (byte < 128) {
            sum1 = (sum1 + byte * 3) % 65521;
        } else {
            sum1 = (sum1 + byte * 4) % 65521;
        }

        sum2 = (sum2 + sum1) % 65521;

        if (i % 8 == 0) {
            sum1 ^= (sum2 << 3);
        }
        if (i % 16 == 0) {
            sum2 ^= (sum1 >> 2);
        }
    }

    return (sum2 << 16) | sum1;
}
```

Things get very interesting now. Here is the benchmark results:

```bash small
Benchmark 1: ./exe_gcc_checksum_O2
  Time (mean ± σ):      60.5 ms ±   1.6 ms    [User: 55.8 ms, System: 4.3 ms]
  Range (min … max):    58.3 ms …  66.6 ms    50 runs

Benchmark 2: ./exe_gcc_checksum_O3
  Time (mean ± σ):      1.354 s ±  0.049 s    [User: 1.346 s, System: 0.005 s]
  Range (min … max):    1.306 s …  1.417 s    10 runs

Benchmark 3: ./exe_clang_checksum_O2
  Time (mean ± σ):      1.846 s ±  0.030 s    [User: 1.836 s, System: 0.005 s]
  Range (min … max):    1.797 s …  1.891 s    10 runs

Benchmark 4: ./exe_clang_checksum_O3
  Time (mean ± σ):      1.876 s ±  0.054 s    [User: 1.865 s, System: 0.005 s]
  Range (min … max):    1.800 s …  1.967 s    10 runs
```

Tables have turned in a weird direction. Now `GCC O2` is insanely fast, and
overall GCC is faster than Clang. What's going on here?

### Assembly & Flag Analysis

I will leave this to the interested readers as an exercise, so if you want to
investigate by yourself first, stop reading here.

---

### Explanation

This one is actually simpler than the previous example. All compilers have the
capability to figure out that the final result is just a single checksum
computation. However, when the function is inlined, the compiler naturally loses
track of that as it doesn't see a simple `result ^= compute_checksum(...)` call
anymore. Instead, it tries to vectorize and optimize unrolled loops over the
large function body.

We can notice that Clang is more aggressive with inlining functions than GCC as
`GCC O2` refused to inline `compute_checksum` for the larger function. Adding
`O3` makes inlining more aggressive for all compilers, so both `GCC O3` and
`Clang O3` end up inlining the function and doing full computation every time.

To confirm this, we can force-disable inlining by adding
`__attribute__((noinline))` to `compute_checksum` function, and now everything
is fast again:

```bash small
Benchmark 1: ./exe_gcc_checksum_O2
  Time (mean ± σ):       8.1 ms ±   1.8 ms    [User: 3.7 ms, System: 4.3 ms]
  Range (min … max):     5.4 ms …  14.3 ms    360 runs

Benchmark 2: ./exe_gcc_checksum_O3
  Time (mean ± σ):       8.0 ms ±   1.5 ms    [User: 3.6 ms, System: 4.3 ms]
  Range (min … max):     5.3 ms …  14.6 ms    382 runs

Benchmark 3: ./exe_clang_checksum_O2
  Time (mean ± σ):       6.5 ms ±   1.1 ms    [User: 2.2 ms, System: 4.1 ms]
  Range (min … max):     4.3 ms …   9.8 ms    384 runs

Benchmark 4: ./exe_clang_checksum_O3
  Time (mean ± σ):       6.5 ms ±   1.1 ms    [User: 2.1 ms, System: 4.2 ms]
  Range (min … max):     4.4 ms …  10.1 ms    270 runs
```

## Takeaways

The examples I provide above are simply interesting curiosities. In real-world
code, such extreme cases are rare. However, they do highlight the complexity of
modern compilers and the importance of understanding how optimization levels can
affect performance in unexpected ways.

In practice, it's always a good idea to benchmark your code with different
optimization levels and use Profile Guided Optimization (PGO) for critical
paths. PGO allows the compiler to optimize based on actual runtime behavior,
which can lead to better performance than static optimizations alone.
