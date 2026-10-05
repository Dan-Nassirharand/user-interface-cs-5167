# Project 1: Interface to a Smart Object

Smart Object: Shoes

## Project Description

The focus of this project is to select a physical object and upgrade it to
a "smart" version with a digital interface. The learning outcomes are focused
on design, needs gathering, ideation, and user interface evaluation, rather than
technical mastery of a language or web application framework.

## Design Work

_Design documentation is available [here](./design/)_

### Pre-Design

Design work began with building an understanding of the chosen object, shoes.
The [affordances and physical descriptions](./design/pre-design-needs-gathering/affordances.md) of the object were defined and explored. After a working understanding of the object was established, [interviews](./design/pre-design-needs-gathering/interviews.md) were conducted to inform [design challenges](./design/sketching/10-plus-10/10-plus-ten-design-challenges.png). Eventually, a list of [needs and requirements](./design/pre-design-needs-gathering/needs-and-requirements.md) were constructed, and were used to inspire ideation.

### Ideation

To ideate, the 10+10 sketching method was used. After sketching was completed,
the designer selected a few ideas that addressed the challenges described in the pre-design phase to include in a vanilla UI sketch and a series of hybrid sketches. The vanilla sketch was evaluated by users to influence implementation
and scope future work.

After sketching was complete, a list of assumptions about the physical
capabilities of the smart device was drafted, and implementation began.

## UI Description

A description of all features and controls, as well
as how they connect back to specific design challenges is available [here](./design/basic-object-ui.md).

## Implementation

## Future Steps

## AI Use Disclosure

In general, AI was used to learn Svelte, refresh on general web-design principles,
and explore different implementation options. With no existing codebase to explore or PRs to review, this was the most efficient way to learn the stack while meeting deadlines.

The developer made design decisions, ideated, and explored scope without the use of AI. AI was not used to replace the developer's judgment.

The below list is included to remain in adherence with the class and university
academic integrity policy.

Generative models were used in the following applications:

- Research industry-standard wireframes for desktop dashboards
- Compare Svelte to a different language/framework, Flutter/Dart, to deepen understanding
- Research Svelte components and their use-cases
  - CSS Grid vs. FlexBox
- Refresh knowledge on HTML and CSS basics
- Researching industry-standard Svelte practices
- Implement main page with accessibility concerns in mind
  - While building the general structure of the page, `aria-*` elements were
    introduced to the developer, which were then researched and incorporated into
    other parts of the project
- Research and use component libraries
- Implement components
  - The developer described the element in detail (shape, behavior, size, etc.) and evaluated the result. The developer would then assess the AI output source code, and repeat the cycle until satisfied, asking clarifying questions about Svelte and implementation strategies along the way. Once satisfied, the developer conducted a code review, addressing smells, anti-patterns, and readability concerns
  - For the color selection component, AI was used to research and implement a method to convert between HSL and RGB.
- Explore available options to host project publicly
- Create a workflow that builds the hosted site on push to Git
  - `YAML` files, GitHub repo settings, and methods to expose documentation
- Add links to existing documentation in the project writeup.

## Demo

<!-- -- todo: Include a 2-3 minute demo video, showing your interface in action -->

## References

- https://www.w3schools.com/css/css_boxmodel.asp
- https://www.reddit.com/r/css/comments/10vbm4u/when_to_use_padding_vs_margin/
- https://icon-sets.iconify.design/

## Project Links

- Publicly hosted application
  - https://dan-nassirharand.github.io/user-interface-cs-5167/
- Source code
  - https://github.com/Dan-Nassirharand/user-interface-cs-5167/tree/main/project-1

<!-- todo: finish general project documentation -->
<!-- todo: mention design/requirement numbers that are addressed via business (manufacturing) as part of next steps -->

## Local Setup

This project is built with [Svelte](https://svelte.dev/) and [Vite](https://vitejs.dev/), and requires [Node.js](https://nodejs.org/) (with `npm`) to be installed.

Install dependencies (run once, and again any time `package.json` changes):

```bash
npm install
```

Run the local dev server (with hot reload) at `http://localhost:5173`:

```bash
npm run dev
```

Other available commands:

```bash
npm run build    # production build, output to dist/
npm run preview  # preview the production build locally
```
