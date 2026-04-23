# The Design System: Editorial Wellness & Clinical Precision



## 1. Overview & Creative North Star: "The Clinical Sanctuary"

This design system moves beyond the standard utility of a health app to create an environment that feels like a high-end digital sanctuary. The **Creative North Star** is "The Clinical Sanctuary"—a synthesis of UAM Cuajimalpa’s institutional authority and a modern, airy wellness experience.



We reject the "boxed-in" layout of traditional apps. Instead, we utilize **intentional asymmetry**, wide-tracking typography, and **tonal layering** to guide the user’s eye. The interface should feel like an editorial health journal: clean, authoritative, yet deeply breathing. We achieve this by favoring white space over structural lines and using "Ice Blue" (`#D8E9F3`) as a structural element rather than just a decorative one.



---



## 2. Colors: Tonal Architecture

The palette is rooted in a "Vibrant Blue" (`#2260FF`) that signals trust, supported by a sophisticated range of architectural neutrals.



### Palette Strategy

* **Primary (`#0048d6` / `#2260ff`):** Used for primary actions and signature moments. Use the `primary_container` variant for large hero areas to provide depth.

* **Secondary/Surface (`#d4e5ef`):** This is our "Ice Blue." It serves as the primary tool for sectioning content.

* **The "No-Line" Rule:** 1px solid borders are strictly prohibited for defining sections. Boundaries must be defined through background color shifts. For example, a card (`surface_container_lowest`) sits on a section of `surface_container_low`.

* **Surface Hierarchy & Nesting:** Treat the UI as physical layers.

* **Level 0:** `background` (#f8f9ff)

* **Level 1:** `surface_container_low` (General sectioning)

* **Level 2:** `surface_container_lowest` (White cards/Primary content)

* **The Glass & Gradient Rule:** For floating headers or navigation bars, use `surface` colors at 80% opacity with a `24px` backdrop-blur. This "frosted glass" effect prevents the UI from feeling "pasted on" and creates a seamless, high-end flow.



---



## 3. Typography: Editorial Authority

We pair the technical precision of **Inter** with the rhythmic, premium feel of **Plus Jakarta Sans** for displays.



* **Display & Headlines (Plus Jakarta Sans):** Used for health metrics, titles, and high-level summaries. These should have a slight negative letter-spacing (-0.02em) to feel "tighter" and more custom.

* **Body & Labels (Inter):** Reserved for instructional text and data. Inter’s high x-height ensures readability in a clinical context.

* **The Signature Scale:**

* **Display-LG (3.5rem):** For hero health scores or bold daily greetings.

* **Headline-SM (1.5rem):** Standard for card titles and section headers.

* **Label-MD (0.75rem):** All-caps with 5% letter spacing for "over-the-shoulder" category labels.



---



## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are a fallback, not a standard. We define hierarchy through "The Layering Principle."



* **Ambient Shadows:** When a card must float (e.g., a critical notification), use a shadow of `0 12px 40px rgba(0, 72, 214, 0.06)`. Note the tint: the shadow is a faint blue, not gray, to mimic natural light passing through the "Ice Blue" environment.

* **The Ghost Border:** If a form field or container requires a perimeter for accessibility, use the `outline_variant` token at **15% opacity**. This creates a "suggestion" of a border that disappears into the background.

* **Radius Logic:** A consistent `20px` (or `DEFAULT: 1rem`) radius is applied to all primary containers. For smaller elements like chips or nested buttons, use `sm: 0.5rem` to maintain a "rounded-rect" harmony.



---



## 5. Components



### Buttons

* **Primary:** Background `primary`, Text `on_primary`, Radius `full`. Use a subtle gradient from `primary` to `primary_container` (top-to-bottom) for a premium, tactile feel.

* **Secondary:** Background `secondary_container`, Text `on_secondary_container`. No border.

* **Tertiary:** No background. Text `primary`. Used for low-emphasis actions like "Cancel" or "Learn More."



### Input Fields

* **Style:** Background `secondary_container` (#D8E9F3), Radius `20px`.

* **Interaction:** No border on idle. On focus, the background transitions to a slightly lighter `surface_container_lowest` (White) with a 2px `primary` ghost-border (20% opacity).



### Cards & Lists

* **The Anti-Divider Rule:** Forbid the use of divider lines. Separate list items using `spacing-4` (1rem) of vertical white space or by alternating background tints.

* **Clinical Data Cards:** Use `surface_container_lowest` (White) with a `headline-sm` title. Icons should be Lucide (Fine Line) in `primary` blue.



### Specialty Components: The Health "Pulse"

* **Progress Rings:** Use a stroke-width of 8px with rounded caps. The track should be `secondary_container` and the progress `primary`.

* **Wellness Chips:** For tags like "Nutrition" or "Mental Health," use `surface_container_high` backgrounds with `label-md` typography.



---



## 6. Do’s and Don’ts



### Do

* **Do** use extreme white space. If a layout feels "full," increase the padding using the `spacing-12` or `spacing-16` tokens.

* **Do** align text-heavy content to a strict left-aligned editorial grid while allowing images or icons to break the grid slightly (asymmetry).

* **Do** use Lucide icons at a consistent `1.5px` or `2px` stroke weight to maintain the "fine line" clinical aesthetic.



### Don't

* **Don't** use pure black `#000000` for body text. Use `on_surface_variant` (#434656) to reduce eye strain and maintain the "Ice Blue" softness.

* **Don't** use standard Material Design "elevated" cards with heavy shadows. If it doesn't need to float, keep it flat and use tonal shifts.

* **Don't** use 90-degree corners. Everything from buttons to "Glass" overlays must respect the `20px` or `full` roundedness scale.