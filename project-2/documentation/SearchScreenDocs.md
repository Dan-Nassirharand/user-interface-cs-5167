# Search Screen Documentation

The search screen puts the listing images, prices, and filters in one place. The main purpose is to help users compare items and narrow down the results without moving between several pages. The screen is mainly implemented in `SearchResults.svelte`, with the shared search input in `SearchBar.svelte` and the search mode dropdown in `SearchModeSelect.svelte`.

### Main Components

- **Search bar:** Users can enter keywords and submit a new search. The dropdown has Search and Location modes. Location mode opens the selected city's location page when the city is supported.
- **Filter sidebar:** Users can select a main category, subcategory, condition, color, and minimum or maximum price. The subcategory dropdown appears after selecting a main category. Reset all clears these filters, but keeps the search keywords and current sorting option.
- **Results toolbar:** The toolbar shows the number of currently displayed cards and lets users show or hide the filters. It also shows the number of active filters. Hiding the sidebar gives more space to the listing cards.
- **Listing cards:** Each card shows an image, category, price, title, short description, neighborhood, and posting age. The heart button saves or unsaves the card. Clicking the image or title opens the listing details.
- **Listing details:** A dialog shows a larger image and the item's information. It includes Favorite, Hide, Flag, Share, and Reply actions, along with a mock location map.
- **Back-to-top button:** This button appears after scrolling down and brings the user back to the top of the page.

### Search and Browsing Behavior

Keyword matching is case-insensitive. Every word in the search must appear somewhere in the listing's title, main category, subcategory, description, or color. Filters update the results immediately. Users can sort by newest first, price from low to high, or price from high to low.

The screen first displays 12 cards. More cards are added when the user approaches the bottom of the results, and a Load more listings button is also available. The demo stops at 36 cards. When there are no results, the screen suggests changing the search or filters and provides options to clear active filters or browse all listings.

### Layout and Accessibility

The desktop layout places the filters on the left and listing cards on the right. The toolbar and sidebar stay visible while scrolling, and the sidebar can scroll separately when its content is taller than the available space. The card grid changes to fewer columns on smaller screens. The listing dialog also changes from a side-by-side layout to a stacked layout on smaller screens.

The implementation includes labels for inputs, accessible names for icon buttons, visible keyboard focus styles, and pressed states for favorite and flag buttons. Result counts and action messages use live announcements. Opening Reply moves focus to the message field. The reply transition and back-to-top scrolling respect the reduced-motion preference.

### Demo Limitations

The listings come from the local `listings.js` file. The screen repeats matching sample listings with numbered titles to demonstrate loading more results, so the displayed count is not a count of unique items. All current sample listings belong to For sale, even though other main categories are available in the filters.

Favorite, Hide, and Flag only update the current search screen's state. They are not saved to an account and reset when the screen is recreated or refreshed. Reply accepts a message and shows a demo confirmation, but does not send anything to a seller. Share copies a keyword search link rather than a permanent link to an individual listing. The map is an illustration, and the selected city does not filter the sample data geographically.

### AI Disclosure

I used ChatGPT to help write this documentation in English. ChatGPT, through Codex, referred to `HomeScreenDocs.md` for the writing style and reviewed the current search screen code to describe its features and limitations. The original development prompts, model, and division between AI-assisted and manual implementation work were not provided, so they are not described here.
