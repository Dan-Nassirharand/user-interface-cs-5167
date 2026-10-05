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

### Technical Stack

This project was developed using Svelte 5 and JavaScript (ES modules), bundled
and served with Vite. There is no backend; the app is a static single-page
application hosted on GitHub Pages.

| Tool / Library                                                                   | Role                                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Svelte 5](https://svelte.dev/)                                                  | Component framework; reactivity via runes (`$state`, `$derived`, `$effect`, `$props`, `$bindable`)      |
| [Vite](https://vitejs.dev/)                                                      | Dev server (hot reload) and production bundler                                                          |
| [`@sveltejs/vite-plugin-svelte`](https://github.com/sveltejs/vite-plugin-svelte) | Compiles `.svelte` files within Vite                                                                    |
| [`@iconify/svelte`](https://iconify.design/docs/icon-components/svelte/)         | Icon component; icons are loaded on demand from the Iconify icon sets (`at-icons`, `boxicons`, `basil`) |
| GitHub Actions + GitHub Pages                                                    | CI build and public hosting (see below)                                                                 |

### Styling

No CSS framework is used. Styling is plain CSS scoped to each component, with
shared colors defined as CSS custom properties in `App.svelte`.

Page layout uses CSS Grid for the overall structure (header above main content)
and Flexbox for arranging controls within it. The layout targets desktop
screens and is not responsive.

### Code Structure

```
src/
├── main.js            # mounts <App />
├── App.svelte         # page layout, shared state, simulation logic
├── app.css            # global styles
├── assets/            # placement sketches
└── lib/
    ├── SockLinerSwitch.svelte    # sock liner on/off control
    ├── ShoeColorSelector.svelte  # 2D hue/lightness color picker
    ├── PowerControl.svelte       # battery ring + power mode control
    ├── MobileDevice.svelte       # phone-style frame for secondary device view
    ├── ActivityButtons.svelte    # simulate walking / running
    └── SimulationControl.svelte  # simulation panel for setting state directly
```

Each smart-shoe feature is its own component in `src/lib/`. `App.svelte` is the
only place that composes them, and each control is rendered twice: once as the
on-shoe control and once inside a `MobileDevice` frame as the companion-app
equivalent.

### Design Patterns

- Modularity: each control is its own self-contained component.
- Centralized state: shared state lives in `App.svelte` and is passed down to
  components, so the on-shoe and mobile views of a control stay in sync.
- Two-way binding: components update shared state through `$bindable` props.
- Derived state: values computed from other state (e.g., the power ring fill)
  are derived rather than stored.
- Isolated side effects: timers and state syncing live in `$effect` blocks.
- Data-driven behavior: battery drain/charge rates come from a lookup table
  rather than branching logic.
- Abstraction and composition: `MobileDevice` is a generic frame that takes its
  contents as snippets, and is reused for every control.
- Accessibility: native elements with `aria-*` attributes where state is not
  visible in text.

### Build and Deployment

The site is built with Vite and deployed to GitHub Pages by a GitHub Actions
workflow ([deploy-project-1.yml](../.github/workflows/deploy-project-1.yml))
on each push to `main` that changes this project. Production builds set Vite's
`base` to the repository name, because GitHub Pages serves the site at
`/<repo-name>/` rather than the domain root.

## Future Steps

### Design Work

Given more time and resources, the designer would revisit the earliest stages
of the design process and conduct more interviews. The designer would select a
specific audience to curate the product to, and interview a large, representative sample of users.

More work being done this early in the design process will prove laborious and expensive, but it is necessary to create a product that will generate revenue for a business and make a difference in the world.

Once interviews are conducted, the same general design process here will be followed. Design constraints will be established from interviews, the designer will ideate, then, finally, implement a mock-up of the UI components for the object.

### Business Needs

To address additional design constraints, the user would research and scope more non-technical work, such as sourcing, manufacturing, finance, and marketing, to contribute to the overall success of the commercialization of the object.

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
- Creating documentation around implementation
  - Verify and recall design patterns, state management, and dependencies

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
