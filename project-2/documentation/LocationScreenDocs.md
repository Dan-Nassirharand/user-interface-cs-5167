# Location Screen Documentation

[AI Implementation Disclosure](#ai-implementation-disclosure)

The location screen is the starting point for browsing one city. It addresses two of our design plans: moving the location selector to a more visible place, and replacing Craigslist's wall of links with a smaller set of main categories that expand into subcategories. The screen is mainly implemented in `LocationPage.svelte`. Creating a post, viewing saved posts, and changing settings are handled in `PostComposer.svelte`, `MyPosts.svelte`, and `SettingsPanel.svelte`. The icons come from `LocationIcon.svelte`.

### Getting to the Location Screen

- **From the home screen:** Users can switch the search dropdown to Location mode and type a city. Users can enter the city name, with or without its state, or just the beginning of the city name. A few short names, such as NYC, SF, LA, and Cinci, also work. If the city is not supported, the search bar suggests a few supported cities instead.
- **From the search screen:** The city name in the header links back to that city's location screen.
- **Directly by URL:** The page uses `/location?location=<city id>`, for example `/location?location=cincinnati-oh`. The browser's back and forward buttons work between pages.

If no city is given, the screen opens the last city the user viewed. When the app is first opened, this is the favorite location from Settings, or Cincinnati when no favorite has been saved.

### Main Components

- **Header:** The header shows the logo, the current city, a search bar, the account button, and a dark mode toggle. Clicking the city opens the location picker instead of leaving the page. Searching from the header opens the search screen for the current city.
- **Breadcrumb:** A short Home > City trail shows where the user is and gives a quick way back to the home screen.
- **Browsing area card:** The card shows the selected city below a small map illustration. The Change location button opens the location picker.
- **Location picker:** A dialog lists the supported cities. Users can filter the list by typing part of a city name or a state abbreviation. The current city has a check mark. Choosing a city updates the page and the URL.
- **Category tiles:** Nine main categories are shown in a three-by-three grid. Each tile has an icon, a name, and a short description. The categories are Housing, Jobs, Auto, Services, Forums, Shopping, Community, Gigs, and Freebies. Gigs is kept separate from Jobs, which follows our design plan to make jobs and short-term gigs easier to tell apart.
- **Subcategory panel:** Clicking a tile opens its subcategories directly under that row. Only one panel is open at a time. Clicking a subcategory, or Browse all, opens the search screen for the current city with that selection.
- **Post card:** The Create a post button opens the post composer. The My posts link opens the list of posts saved in this browser.
- **Settings tile:** This tile opens the settings panel. The account button in the header opens the same panel.

### Creating a Post

The post composer splits posting into three steps, and a progress indicator at the top shows the current step. This addresses the confusing category selection we saw when participants tried to create a listing on Craigslist.

1. **Category:** Users choose a category and a subcategory, and select whether they are posting as an individual or a business.
2. **Details:** Users enter a title and description. Some fields only appear when they fit the category. Price appears for Housing, Auto, Shopping, and Services. Condition appears for Auto, Shopping, and Freebies. Neighborhood, ZIP code, and up to four photos are optional. A reply email is required, and a phone number is only added when the user checks the option for it.
3. **Preview:** The post is shown the way it would look in a listing. Users can go back and edit it, or save it.

The reply email and phone number are filled in from Settings when they have been saved there. Users can save a draft on the Category and Details steps. Closing the composer with unsaved changes saves the draft automatically, and the draft is restored the next time the composer is opened. After saving, a confirmation message tells the user where to find the post.

### My Posts and Settings

- **My posts:** This dialog lists saved posts from newest to oldest, with the first photo, title, category, city, date, and price. Selecting a post shows its full details, and Back to my posts returns to the list.
- **Settings:** Users can add a profile photo, username, email, and phone number. All of these are optional. Users can also choose a favorite location and turn on dark mode. Saving a new favorite location also switches the current page to that city.

### Layout and Accessibility

The desktop layout places the browsing area card, post card, and settings tile in a sidebar on the left, with the category grid on the right. On tablet-sized screens, the sidebar moves above the categories and its cards sit side by side. On phones, the map illustration and some secondary text are hidden, and the subcategory links change to a single column. The subcategory links use three columns on wide screens and two on medium screens.

The screen includes a Skip to categories link for keyboard users. The category tiles report whether they are expanded, and closing a subcategory panel returns focus to its tile. The location picker, post composer, My posts, and settings panel are all modal dialogs that can be closed with the Escape key. Moving between posting steps moves focus to the new step's heading. Error and confirmation messages use live announcements, and the dark mode control is announced as a switch. The hover animation on the category tiles is turned off when the user prefers reduced motion.

### Demo Limitations

The screen supports ten hard-coded cities. Changing the city updates the city name on the page and the location used for searches, but the categories and map illustration are the same for every city. The screen does not use the browser's location services.

Posts, drafts, and settings are saved in the browser's local storage. They are not connected to an account, they do not appear in the search results, and they are only available in the browser that created them. My posts keeps up to ten recent posts, and posts cannot be edited or deleted after saving. Only one draft is kept at a time.

The location screen's subcategory names do not all match the categories used by the sample listings. Furniture, Electronics, and Bikes open the search screen with matching filters already selected. Other subcategories open the search screen with all categories shown.

### AI Implementation Disclosure

Written by Kiki

I used Codex (model: `GPT-6.1 Sol`) to write the code for the location screen. This allowed me to write more components than our group originally discussed such as creating a post, viewing created posts, and the settings menu with a user profile. 

#### The Workflow

My very first prompt to the coding agent included the following finalized sketch of the [Location Page](https://github.com/Dan-Nassirharand/user-interface-cs-5167/blob/main/project-2/design/sketching-and-feedback/images/location-final.jpg) and a prompt describing how everything should work, and how it should resemble the final sketch. I gave the coding agent specified requirements so it did not go rogue and do something I didn't want. Everything the coding agent generated were based on the prompt's specifications. This was the longest prompt I gave it to give me a good vision of the webpage. Shown below is the snippet of the prompt, not the entire prompt.

Snippet of Initial Prompt:

```
For the location page I need to use the location-final.jpg image. this is the UI I need you to help me make. as you can see in the image there are main tile blocks. the tiles I am thinking to make are:

Housing, Jobs, Auto, Services, Forums, Shopping, etc...

I am thinking once you click a tile subcategories should show in a way. like if you click jobs tile there should be a way to list different jobs like tech, engineer, office/admin, finance, education, skilled trade etc.

Then you can click on the subcategories to take you to the search page. we will not make the search page. another group member will work on that. we are just focused on the location page

There is also a header. we can add a search bar there similar to the one in the homepage that searches for specific things (this search bar does not need a location toggle). The header will also have the craigslist logo. lets use the same logo as the homepage.

On the side bar I am thinking to have a tile for making a post as shown. Also a map tile that tells you where you are and a good way to change it. Maybe a search to search for a location? a settings tile as well that brings you somewhere but lets just leave it as a tile for now.
```

After this prompt, the coding agent provided me the code. I viewed the location page in the browser and found flaws in the design that needed to be addressed. I then provided the agent a list of design flaws that needed to be fixed and how they should be fixed. Prompts like these were done many times throughout the process to get the design how I wanted it to look.

Example Snippet of a "Fixing" Prompt:

```
Some critiques to make the design better. 

1: I noticed the craigslist logo on the top left is cut out. the left side of the logo is cut out. lets fix this
2: settings icon doesn't look standard. it looks strange and needs changed to a more standard gear icon
3: implement the settings. implement simple things, like changing profile pic, account username, account email, account phone number, favorite location, dark mode toggle etc. standard settings UI stuff, nothing extra
4: these new settings and post functionality can maybe be different .svelte files since they are larger components
5: implement a profile icon showing up in the top right. right of the search bar but left of the dark mode toggle. like the icon as shown in the final sketch
6: change the name of the ninth category? make it one word possibly? all other icons are one word so either change name to one word. im talking about the Free & barter tile
7: fix the look of this: Browse categories 09. definitely remove the 09 thing that tells you number of categories that is not needed. browse categories also looks off putting. maybe theres another thing to make it look more simplistic looking like replacing it with "Pick a category to explore" instead?
```

Once this iterative process of checking out the location page in the browser, finding flaws, describing how to fix the flaws, sending flaws/flaw fixes to agent, checking design got me to a design of the location page I liked, the process of making the location page was complete.

The coding agent generated almost the entire code for the location page but it only generated code that I specifically told it to generate. I gave the coding agent specifications on what the design should look like, the structure of the code (what code should go in what files), and how exactly to fix the flaws with the design. The coding agent never produced code that I didn't specifically ask for.

### AI Documentation Disclosure

This documentation was written with Claude Code (model: `claude-opus-5-5`) at a team member's request. Claude read the current location screen code (`LocationPage.svelte`, `PostComposer.svelte`, `MyPosts.svelte`, `SettingsPanel.svelte`, `Header.svelte`, `App.svelte`, and `SearchResults.svelte`) to describe its features and limitations, and followed the format and writing style of `HomeScreenDocs.md` and `SearchScreenDocs.md`. The connections to our research were taken from `design-plans.md`. The original development prompts, model, and division between AI-assisted and manual implementation work for the location screen were not provided, so they are not described here.
