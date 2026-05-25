# Kickboxing components

Building blocks for the `/kickboxing` page. Author content in
`../index.mdx` using these components.

All of them are re-exported from `Kickboxing.astro`, so import from there:

```mdx
import {
  Classes,
  Class,
  WarmUp,
  Stretch,
  Technique,
  Drill,
  Cardio,
  CoolDown,
} from "./_components/Kickboxing.astro";
```

## Quick start

```mdx
<Classes>

<Class date="2026-05-27">

Optional intro prose for the session.

<WarmUp timer={2}>Jumping jacks</WarmUp>

<Technique timer="5m">Jab–cross on the pads</Technique>

<Cardio timer="0:45">Burpees</Cardio>

<CoolDown timer={3}>Slow breathing & shoulder rolls</CoolDown>

</Class>

</Classes>
```

## Components

### `<Classes>`

Wraps every `<Class>`. Renders a switcher rail and shows **one class at a
time**. On load it selects today's session (else the next upcoming, else the
most recent) and scroll-centers it in the rail. Tabs are clickable and
arrow-key navigable.

| Prop    | Type     | Default      | Notes                          |
| ------- | -------- | ------------ | ------------------------------ |
| `label` | `string` | `"Sessions"` | Heading shown above the rail.  |

### `<Class>`

One training session. Auto-numbered (`Class 1`, `Class 2`, …) by its order
inside `<Classes>`. Renders a date heading, then its slotted content.

| Prop     | Type               | Default | Notes                                                              |
| -------- | ------------------ | ------- | ------------------------------------------------------------------ |
| `date`   | `string`           | —       | Required. `YYYY-MM-DD`. Drives the heading, tab label, and sorting. |
| `number` | `string \| number` | auto    | Override the auto-assigned number shown in the tab.                |
| `title`  | `string`           | —       | Custom heading; the formatted date moves to a subline.             |

Slot: intro prose and any number of the activity blocks below.

### Activity blocks

`<WarmUp>`, `<Stretch>`, `<Technique>`, `<Drill>`, `<Cardio>`, `<CoolDown>`

Each is a colour-coded card wrapping `KickboxingBlock` with a preset `kind`
and `label`. They share these props:

| Prop    | Type               | Notes                                          |
| ------- | ------------------ | ---------------------------------------------- |
| `timer` | `string \| number` | Optional. Adds a countdown (see below).        |
| `beeps` | `string \| number` | Optional. Interval for repeating cue beeps.    |

Slot: the exercise description.

### `beeps`

An **interval**, in the same format as `timer`: the timer sounds a cue every
that much elapsed time. For example `beeps="30s"` beeps every 30 seconds. The
start and end tones always play; `beeps` only adds the repeating in-between
cues. If omitted, there's no middle beep.

```mdx
<!-- beep every 30 seconds during a 3-minute round (at 0:30, 1:00, … elapsed) -->
<Drill timer="3m" beeps="30s">Combos</Drill>

<!-- every minute -->
<Cardio timer="5m" beeps="1:00">Shadowboxing</Cardio>
```

A bare number is minutes (matching `timer`), so use `"30s"` or `"0:30"` for
seconds. An interval at or beyond the total duration produces no beeps.

## Timer format

The optional `timer` prop accepts several forms:

| Value         | Meaning      |
| ------------- | ------------ |
| `{2}`         | 2 minutes    |
| `"90s"`       | 90 seconds   |
| `"5m"`        | 5 minutes    |
| `"1:30"`      | 1 min 30 sec |
| `"1:00:00"`   | 1 hour       |

When present, the card shows a Start/Resume/Pause + Reset stopwatch with a
progress bar. It plays a tone on start, at the halfway mark, and when done.
Omit `timer` for an untimed entry.

## Internal pieces (don't use directly)

- **`KickboxingBlock.astro`** — the shared card + timer. Use the named
  activity wrappers instead of this.
- **`Kickboxing.astro`** — barrel of re-exports; the import source above.
