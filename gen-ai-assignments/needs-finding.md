# Gen AI and Needs Finding

## Executive Summary

I would use Gen AI for needs gathering.  I would ensure to establish the underlying principles that make a good question and parse generated questions with a high level of scrutiny, but would ultimately use the tool to ideate after doing an initial first pass myself.


## Can generative AI help you in needs finding activities, to identify user needs, design goals/requirements?
Yes.  Applied with the correct constraints to preserve creativity, eliminate bias, and avoid tunnel-vision, generative AI can help an individual or organization be more efficient in needs gathering and defining requirements.  These constraints will be discussed in greater detail below.

## In what ways might AI be useful or not, beneficial or harmful for this task?
- Useful
    - Lessen tedium, allowing an engineer to focus on higher-level, abstract tasks
        - Grammar checking, formatting, etc.
    - Allow an engineer to understand their own process better in designing requirements for AI
        - Defining what "good" questions are, if there is a general list of questions to answer at a high level, regardless of design topic, and documenting domain-specific knowledge.
- Harmful
    - Used incorrectly, as the primary source for creativity and judgment, for example, will strip a project of novelty and innovation in its earliest phase, making the burden of recovery later in the design process insurmountable.
    - Introduce misinformation, anti-patterns, and bad practices into the foundation of a project.
## What are the risks in using genAI in this stage?
The risks described above, when considered in abstract, are instances where misalignment with best practices, creativity, and sound judgment insert cracks in the foundation of a project at a time where it is particularly most vulnerable, as definition and requirements making set the tone of the entire project.  Gone uncaught, these cracks are expensive and timely to recover from and will hinder the project exponentially the further along it is in the design process.

## How did you mitigate these risks, or how might someone mitigate those risks?
The best ways to mitigate these risks is by deciding on an appropriate, ethical use of an AI tool and defining standards for high-quality results before prompting.  By establishing what success looks like before attempting to solve a problem, will of course result in more robust results when using any tool, including generative AI.  In the case of AI tools, these definitions can often be used as guardrails when engineering a prompt.

## Try using genAI to generate or revise interview questions

### Document the prompts you try

- Prompt
```
I'm gathering requirements for a UI on a pair of smart shoes.  Generate a list of interview questions I can use for needs gathering
```
- Response
```
Great prompt—this is exactly the kind of thing where strong questions = better product decisions. I’ll organize these so you can actually run a clean interview and not just ask random stuff.

---

# 🧠 1. Context & Lifestyle (Start broad)

You’re trying to understand *when and why shoes matter* in their life.

* Walk me through a typical day on your feet.
* When do you notice your shoes the most?
* What activities do you primarily use your shoes for? (walking, running, gym, work, etc.)
* Have you ever had issues with your feet, posture, or comfort?
* What’s the longest you’re on your feet in a day?

---

# 👟 2. Current Shoe Experience

Anchor everything in what they already do.

* What do you like most about your current shoes?
* What frustrates you about them?
* How often do you replace your shoes?
* Have you ever used “smart” or fitness-related wearables?
* Do you think about performance (speed, distance, form), or just comfort?

---

# 📊 3. Awareness & Feedback Needs

This is where smart shoes start to differentiate.

* What kinds of feedback about your walking/running would actually be useful?
* Would you care about things like:

  * Step count?
  * Posture/form?
  * Impact on joints?
  * Fatigue levels?
* When would you want that feedback—during activity or after?
* What’s something about your movement you *wish you understood better*?

---

# 📱 4. UI & Interaction Preferences

This is core to your UI design.

* Where would you expect to see information from smart shoes?

  * On the shoe itself?
  * Phone app?
  * Watch?
* How often would you realistically check it?
* What’s the *maximum* amount of information you’d want at once?
* Do you prefer:

  * Simple summaries
  * Detailed metrics
* How do you feel about notifications from wearable devices?

---

# 🔔 5. Alerts & Real-Time Guidance

This can make or break usability.

* Would you want real-time alerts while walking/running?
* What kind of alerts would be helpful vs annoying?
* How should alerts be delivered?

  * Vibration
  * Sound
  * Visual cue
* When should the system *stay silent*?

---

# ⚙️ 6. Customization & Control

Power users vs casual users.

* How much control do you want over what’s tracked?
* Would you customize goals or just follow defaults?
* Do you like setting targets (steps, posture, mileage)?
* How important is personalization to you?

---

# 🔋 7. Practical Constraints

These often matter more than features.

* How often would you be willing to charge your shoes?
* Would added weight or bulk bother you?
* What concerns would you have about durability?
* How important is battery life vs features?

---

# 🔐 8. Privacy & Data

Often overlooked but critical.

* Would you be comfortable with your movement data being stored?
* What would make you uncomfortable?
* Would you share this data with apps (e.g., fitness platforms)?

---

# 💰 9. Value & Purchase Decision

Helps prioritize features.

* What would make smart shoes worth buying for you?
* What features feel unnecessary?
* How much more would you pay compared to regular shoes?
* What would make you *not* buy them?

---

# 🧪 10. Concept Testing (If you have a prototype idea)

Turn ideas into reactions.

* How useful does this concept sound to you?
* What part excites you the most?
* What feels confusing or unnecessary?
* What would you remove immediately?

---

# 🎯 Pro Tip (important)

Don’t just ask—**dig one layer deeper every time**:

If they say: *“I want posture feedback”*
→ Ask: *“What would you actually do with that information?”*

That’s where real requirements come from.

---

## If you want to go deeper

I can help you:

* Turn this into a structured interview script (30–45 min)
* Map answers → actual UI requirements
* Or sketch what the UI should look like based on likely responses

---
```
- Prompt
```
I will give you a list of interview questions I will use for needs gathering on the development of a smart shoe. Make adjustments and new suggestions as necessary:

- Tell me about your shoes
- What do you look for in a shoe?
- How many pairs of shoes do you own?
- What has prevented you from purchasing a shoe in the past?
- Tell me about a time, if any, that you regretted wearing a specific pair of shoes
```
- Response
```
You’re off to a solid start, but right now your questions skew a bit *surface-level and retail-focused*. For a **smart shoe**, you want to dig deeper into **behavior, pain points, and openness to tech**—not just preferences.

Here’s a tightened + expanded version that keeps your intent but makes each question more useful:

---

### 🔧 Refined Versions of Your Questions

* **Tell me about the shoes you wear most often.**
  *(More specific → gets actual behavior, not vague answers)*

* **What factors matter most when choosing a shoe? (e.g., comfort, style, durability, performance)**
  *(Adds structure and comparability)*

* **How many pairs of shoes do you regularly rotate through?**
  *(“Own” vs “use” is a big difference)*

* **Can you describe a time you decided *not* to buy a shoe? What stopped you?**
  *(Pushes for a story instead of a generic answer)*

* **Tell me about a time you regretted wearing a specific pair of shoes. What happened?**
  *(Good—just slightly tightened)*

---

### 🧠 Critical Gaps for a *Smart Shoe* (Add These)

You’re currently missing the *“smart”* part. These are essential:

#### 🏃 Usage & Context

* **What activities do you primarily use your shoes for? (walking, running, work, etc.)**
* **How long are you typically on your feet each day?**

#### ⚠️ Pain Points

* **What frustrates you most about your current shoes?**
* **Have you ever experienced discomfort or injury related to footwear?**

#### 📊 Data & Awareness

* **Do you track any health or activity data (steps, workouts, posture, etc.)? How?**
* **What kind of information about your movement or health would be useful to you, if any?**

#### 📱 Tech Adoption

* **Do you use wearable tech (e.g., smartwatches, fitness trackers)? What do you like/dislike about them?**
* **How would you feel about shoes that collect data or connect to an app?**

#### 🔋 Practical Constraints

* **How often would you realistically be willing to charge a device in your shoes?**
* **Would added weight or bulk from technology be a concern?**

#### 💰 Value Perception

* **What would make a “smart shoe” feel worth paying more for?**
* **What concerns would you have before buying one? (privacy, durability, cost, etc.)**

---

### 🎯 One Strategic Add (High Value)

* **If your ideal shoe could do *one extra thing* beyond a normal shoe, what would it be?**

This question is gold—it reveals **user-prioritized features without biasing them**.

---

### If you want to sharpen this further:

Answering those will let me tailor this into a *tight, high-signal interview script* (like something you’d actually take into a 30-min session).
```

### Identify something that worked.
Overall, the generative AI responses were focused on user experience through a a variety of domains (privacy, finances, etc.)  An appropriate number of substantive questions were generated that I would use in an interview.

### Identify something that did not work well.
The overall framing of the questions seemed to contain bias and many specific questions were presumptive.

By establishing a list of domains to ask questions around, the opportunity to establish domains derived from patterns seen in more open-ended user responses is lost.  Security, finances, etc. seem important, however, it should be up to the user to establish these concerns to avoid tunnel-vision on part of the designer.
