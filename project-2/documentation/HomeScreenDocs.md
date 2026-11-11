# Home Screen Documentation
by Cameron

Becuase I was using Claude to write my code, I was able to do a lot more extra component creation. The extra components are: Theme Selector, Scrolling Word Background, and Dictionary Word Card Components. All of these are optional and when our team comes together to make a final design, will (optionally) be included. 

### AI Disclosure
This is the first time I ever used a CLI coding agent (Claude Code).
I did a majority of the development with the agent with the following rules
- Pick one component to work on at a time
- Make the first prompt either very specific or blank. 
- Slowly ask to add features or attributes to each component and make each one configurable
- Once completed, edit the component manually until it it's exactly what I envisioned

#### Example Workflow
I followed the same general set of steps for creating any component.
This is the exact worflow I followed when creating the Title Component, `Title.svelte`.

1. Before prompting, I downloaded the Craigslist Logo and move it into static assets. I also researched what the font of the real Craiglist logo is and noted the size.

2. Pasted prompts:
```
Make a new component called Title.svelte for the title. For now just put it in the center of the screen, make it Times new roman font
okay now make it so that whenever you click this component, you go home
Okay, add a parameter that when true will put /static/logo.ico or png whichever is better to the left of the text
"""I did not like this output so I reprompted the AI in plan mode."""
lets do this a simple way. Ask questions when needed. Add a parameter that when true will put /static/logo.ico or png whichever is better to the left of the text
```

3. After prompting claude, I went in and manually edited the `gap` between the title and the logo. 

#### Other GenAI Notes: 
When I first started the project, claude would kinda go rouge and do way more than I asked it to. I had to prompt it to only do what I ask for and nothing extra. This really kept the design choices up to me which I really liked. 
I decided to prompt it with that because when I started out in the project, I asked Claude to make a theme file and it did way too much. I kept the output (which birthed the optional dark mode), but that is the only instance of Claude doing anything at all that I did not specifically ask for.
I used this model: `azure/claude-opus-5-5`.

## AI-Free work
I wrote all of the sentences found in the definitions / home background. 
Here and there layout tweaks
Finding all of the assets
Selecting the primary (actually used) colors
Project Setup
