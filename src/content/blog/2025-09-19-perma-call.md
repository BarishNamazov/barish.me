---
title: "Perma-Call: Permanently On-Call"
publishedDate: 2025-09-19
description:
  "When the system owner becomes the default contact, regardless of who's
  actually on-call."
---

We had an on-call rotation. Most days were typical: retries, late-running tasks,
nothing critical. But when crucial flows failed—often due to upstream
hiccups—the phone ignored the schedule. It went straight to whoever could fix
things without making them worse. I had the geniunely useful learning
opportunity to experience what I now call "perma-call."

## Why Perma-Call Happens

Perma-call is when the system owner becomes the de facto contact, regardless of
the roster. In a crisis, people call whoever knows the system best. Research on
the bystander effect shows that naming a specific person increases
follow-through compared with addressing a group [[1]](#ref1). That bias maps
neatly to incidents.

And it snowballs. Fix one critical issue, and you become the go-to person. Not
because of your title, but because people need answers fast. Before you know it,
there's an unofficial rotation running underneath the official one.

## Is there a world without it?

Probably not. Knowledge is uneven, and responsibility follows expertise. The
goal is not to deny this, but to stop it from becoming invisible, unlimited, or
centered on one person.

## The Impact (Including Life Outside Work)

Your calendar says "off," but your brain stays in standby mode. You plan
weekends with a quiet contingency. You "just check logs." The load is not the
page itself; it is maintaining the mental model of brittle edges while you try
to be elsewhere.

That has a real cost. Recovery depends on mental detachment, not only physical
distance. When detachment never happens, strain accumulates even during calm
periods, which is well documented in recovery research [[2]](#ref2).

How much it hurts depends on how much you care. Caring makes you reachable. It
also tempts you to trade boundaries for faster fixes because you identify with
the system and the people depending on it. Pride and pressure often coexist:
teams value being effective, yet relaxation shrinks to short windows.

## What Helped

**Document the weird paths.** Capture not just steps, but reasons (for example,
“restart only after their maintenance window ends at 03:00”). Transfer judgment,
not only commands.

**Let others drive during calm periods.** Have them hold the pager while you sit
nearby. Only jump in when asked. Shadowing works when the shadow carries real
responsibility. I appreciate my managers/mentors who did this for me.

**Make ownership visible.** Map who actually gets called and for what. With
visibility, you can plan time, training, and relief.

**Fix routing by changing defaults.** Page channels before individuals. Add both
the expert and the rostered on-call to high-severity pages. Shift habits
gradually.

**Remove sharp edges.** If one flaky feature causes half your pages, fix it or
remove it. One less brittle dependency removes many “just ping me” moments.

**Turn fixes into buttons, built for worst-case scenarios.** Convert repeatable
interventions into gated automations with privilege limits, time-bound access,
prechecks/dry runs, canaries, automatic rollback, and full audit. Attach these
to alerts and runbooks so the on-call can act safely without relying on the
expert.

None of these fully solve perma-call. They redistribute it, and over time
hopefully reduce it. I do believe it can become fully manageable given enough
time and effort.

## Closing

On-call rotations are what we plan; muscle memory is what actually happens.
Teams remember who saved the day, and systems remember the fastest path to
resolution. Perma-call is that memory made real. We may not stop it completely,
but we can spread it so more people know the tricks, and everyone gets their
time off.

---

**References:**

<span id="ref1">[1]</span> Darley, J. M., & Latané, B. (1968). Bystander
intervention in emergencies: Diffusion of responsibility. _Journal of
Personality and Social Psychology_, 8(4), 377-383.
<https://doi.org/10.1037/h0025589>

<span id="ref2">[2]</span> Sonnentag, S., & Fritz, C. (2007). The Recovery
Experience Questionnaire: Development and validation of a measure for assessing
recuperation and unwinding from work. _Journal of Occupational Health
Psychology_, 12(3), 204-221. <https://doi.org/10.1037/1076-8998.12.3.204>
