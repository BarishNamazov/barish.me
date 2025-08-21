---
layout: ../layouts/Layout.astro
titlePrefix: About
---

<style>
  h1 {
    text-align: center;
  }
  p {
    text-align: justify;
  }

  img {
    display: block;
    margin: 0 auto;
    border-radius: 50%;
    max-width: 12em;
    object-fit: cover;
  }

  .head {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    & h1 {
      flex: 1 1;
    }
  }

  .activities {
    margin-top: 2rem;
  }

  .category {
    margin-bottom: 2rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;

    & summary {
      background: #f8f9fa;
      padding: 1rem;
      cursor: pointer;
      list-style: none;
      color: var(--accent-color);
      font-weight: 600;
      border-bottom: 2px solid var(--accent-color);
      user-select: none;

      &::-webkit-details-marker {
        display: none;
      }

      &::before {
        content: '▶';
        margin-right: 0.5rem;
        transition: transform 0.2s ease;
        display: inline-block;
      }
    }

    &[open] summary::before {
      transform: rotate(90deg);
    }

    & .content {
      padding: 1rem;
      background: white;

      & ul {
        margin: 0;
        padding-left: 1.2rem;

        & li {
          margin-bottom: 0.8rem;
          line-height: 1.4;
        }
      }
    }
  }
</style>

<div class="head">
  <img src="/media/barish.jpg" alt="Abutalib-Barish Namazov" />
  <h1>Abutalib-Barish Namazov</h1>
</div>

Hey there! My name is Abutalib, but I usually go by Barish in casual
settings. I graduated from MIT in May 2024 with an undergraduate degree in
Computer Science and Engineering. Even though I try to educate myself in all
areas of computer science, these days I am mostly interested in solving the
problems of software modularity and web development. I enjoy teaching
others, as well as creating educational content.

Other than academics and related work, I enjoy playing video games and
watching TV series. The latest show I watched was The Sopranos (before that, The Wire),
and it was absolutely fantastic. Lately, I spend a good amount of time at the gym lifting.

Currently, I am working on a few projects that are not ready to be announced.
The things I have done in the near past include:

<div class="activities">
  <details class="category" open>
    <summary>Work & Academic</summary>
    <div class="content">
      <ul>
        <li>Work at <a href="https://www.citadel.com/">Citadel / GQS</a> as a full-time research engineer from July 2024 to August 2025.</li>
        <li>Work on <a href="https://github.com/BarishNamazov/kodless">Kodless</a> as part of my <a href="https://superurop.mit.edu/scholars/abutalib-namazov/?scholar-cohort=648&scholar-page=1">SuperUROP</a> in Spring 2024.</li>
        <li>Work with <a href="https://people.csail.mit.edu/dnj/">Daniel Jackson</a> on applying <a href="https://sdg.csail.mit.edu/projects/conceptual">concepts</a> into web development.</li>
        <li>Work at <a href="https://www.citadel.com/">Citadel / GQS</a> as a software engineering intern during Summer 2023.</li>
        <li>Work with <a href="https://github.com/LeaVerou/">Lea Verou</a> on HCI-related projects during Fall 2022 and Spring 2023.</li>
        <li>Work at <a href="https://www.microsoft.com/">Microsoft</a> as a software engineering intern during Summer 2022.</li>
        <li>Work with <a href="http://www.lns.mit.edu/~winklehn/">Daniel Winklehner</a> on building a <a href="https://doi.org/10.1016/j.nima.2023.168590">control system for an ion source experiment</a>.</li>
        <li>Do competitive programming in <a href="https://codeforces.com/profile/toonewbie">various</a> <a href="https://www.codechef.com/users/toonewbie">online</a> <a href="https://www.hackerrank.com/toonewbie">competition</a> <a href="https://atcoder.jp/users/toonewbie">platforms</a>. I don't do these anymore, but I still enjoy solving problems from time to time.</li>
      </ul>
    </div>
  </details>

  <details class="category" open>
    <summary>Teaching</summary>
    <div class="content">
      <ul>
        <li>Teach <a href="https://py.mit.edu/spring24">6.101/6.009</a> in Spring 2024.</li>
        <li>Teach <a href="https://tedbilik.github.io/kamp2024/">Winter Camp 2024</a> with voluntary support from more people, continuing the tradition I started in 2023.</li>
        <li>Teach <a href="https://61040-fa23.github.io/">6.1040/6.170</a> during Fall 2023.</li>
        <li>Teach <a href="https://web.mit.edu/6.102/">6.102/6.031</a> and <a href="https://designftw.mit.edu/">6.S063</a> during Spring 2023.</li>
        <li>Teach C++ and algorithms to high school students in Azerbaijan — <a href="https://tedbilik.github.io/kamp/">Winter Camp 2023</a>. <a href="https://www.youtube.com/playlist?list=PLbIa3q-p8rjpkmlD-K_BN6kKB3M9IjjA3">Here's a playlist</a>.</li>
        <li>Teach <a href="https://py.mit.edu">6.101/6.009</a> during Fall 2021, Spring 2022, and Fall 2022.</li>
      </ul>
    </div>
  </details>

  <details class="category" open>
    <summary>Community & Misc</summary>
    <div class="content">
      <ul>
        <li>Lead <a href="https://opencode-mit.gitlab.io/">OpenCode @ MIT</a> with my friend <a href="https://adhami.me">Adhami</a>.</li>
        <li>Live in <a href="https://burton5.netlify.app/">Burton 5</a> and serve as the floor chair and captain of the IM tennis team.</li>
        <li>Be a member of the <a href="https://tsa.mit.edu/">MIT Turkish Students Association</a>.</li>
        <li>Serve as vice-president of <a href="https://vga.mit.edu/">VGA</a> from 2021 to 2023.</li>
      </ul>
    </div>
  </details>
</div>

I am very grateful to have worked with all these people and organizations. It would be very hard to maintain a list of all the people I have learned from, but I am thankful to all of them.
