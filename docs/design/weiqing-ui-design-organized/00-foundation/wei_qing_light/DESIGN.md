---
name: Wei Qing Light
colors:
  surface: '#f9f9fe'
  surface-dim: '#d9dade'
  surface-bright: '#f9f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f8'
  surface-container: '#ededf2'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e7'
  on-surface: '#1a1c1f'
  on-surface-variant: '#414755'
  inverse-surface: '#2e3034'
  inverse-on-surface: '#f0f0f5'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc1'
  primary: '#0058bc'
  on-primary: '#ffffff'
  primary-container: '#0070eb'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#4c4aca'
  on-secondary: '#ffffff'
  secondary-container: '#6664e4'
  on-secondary-container: '#fffbff'
  tertiary: '#5a5c60'
  on-tertiary: '#ffffff'
  tertiary-container: '#737479'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c2c1ff'
  on-secondary-fixed: '#0c006a'
  on-secondary-fixed-variant: '#3631b4'
  tertiary-fixed: '#e2e2e7'
  tertiary-fixed-dim: '#c6c6cb'
  on-tertiary-fixed: '#1a1c1f'
  on-tertiary-fixed-variant: '#45474b'
  background: '#f9f9fe'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e7'
  system-background: '#FFFFFF'
  secondary-background: '#F2F2F7'
  tertiary-background: '#E5E5EA'
  label-primary: '#000000'
  label-secondary: '#3C3C4399'
  label-tertiary: '#3C3C434D'
  brand-light: '#E1F0FF'
  success-soft: '#30D158'
  warning-soft: '#FF9F0A'
  danger: '#FF3B30'
typography:
  weight-display:
    fontFamily: SF Pro Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.5px
  large-title:
    fontFamily: SF Pro Display
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 41px
    letterSpacing: 0.4px
  title-1:
    fontFamily: SF Pro Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  card-title:
    fontFamily: SF Pro Text
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 25px
  headline:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
  body:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
  callout:
    fontFamily: SF Pro Text
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 21px
  subheadline:
    fontFamily: SF Pro Text
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
  caption-1:
    fontFamily: SF Pro Text
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  button-label:
    fontFamily: SF Pro Text
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  margin-page: 16px
  gutter-card: 12px
---

## Brand & Style

The design system is rooted in the philosophy of **"Healing Companionship"** and **"Content Deference."** It aims to provide a lightweight, stress-free experience for weight tracking, moving away from the anxiety-driven metrics common in fitness apps. The aesthetic is professional yet empathetic, designed to feel like a first-party Apple utility that has been softened for a more personal, supportive touch.

The chosen style is **Corporate / Modern** with a focus on **iOS Native Deference**. It prioritizes extreme legibility, generous whitespace, and system-native patterns to ensure the UI recedes, leaving the user's data as the primary focus. Key characteristics include:

- **Restraint:** No unnecessary decorative elements or complex animations.
- **Calmness:** A palette of soft grays and a single, gentle brand blue.
- **Privacy-First:** Visual affordances designed to protect sensitive data at a glance.
- **Clarity:** A strict hierarchy where navigation "frames" the content using standard iOS blurs, while data remains on solid, readable surfaces.

## Colors

The color system utilizes iOS semantic naming to ensure seamless integration and native accessibility. The palette is dominated by **Apple Gray-White (#F2F2F7)** for backgrounds and **Soft System Blue (#007AFF)** for interactive highlights.

- **Primary:** The standard iOS Blue, used for primary actions, active states, and focus indicators.
- **Backgrounds:** Follows the "Grouped" layout style. The page background uses `systemGroupedBackground` (#F2F2F7), while content cards use `secondarySystemGroupedBackground` (#FFFFFF).
- **Semantics:** 
    - **Success/Warning:** Used sparingly and always paired with text or icons to ensure accessibility.
    - **Danger:** Reserved for destructive actions like deleting records.
- **Dark Mode:** The system must automatically map to Apple’s dark semantic equivalents (e.g., `systemBackground` becomes black, `label` becomes white) while maintaining the desaturated quality of the accent colors.

## Typography

This design system uses the **SF Pro** family exclusively to maintain a native iOS feel. It strictly adheres to **Dynamic Type** guidelines, ensuring that layouts reflow gracefully when users adjust their system font size.

- **Display Usage:** `weight-display` is reserved for hero numbers (e.g., current weight on the Home screen).
- **Hierarchy:** `Large Title` is used for top-level navigation headers, while `Card Title` defines the start of content sections.
- **Legibility:** `Body` and `Subheadline` are the workhorses for all data entries and descriptions.
- **Mobile Adjustments:** For screens smaller than 375pt, the `weight-display` size should scale down to 40px to avoid clipping.

## Layout & Spacing

The system follows an **8pt grid** rhythm to ensure mathematical harmony across all iOS device dimensions.

- **Layout Model:** A **Fluid Grid** that respects the Safe Area. Content is typically housed in "Grouped" cards that span the width of the screen minus the `margin-page`.
- **Margins:** Standard 16pt lateral margins for iPhone. For iPad, these margins may increase to 32pt or follow a centered fixed-width column (max-width 600pt) to maintain readability.
- **Rhythm:**
    - **Internal Card Padding:** Use `md` (16px) for standard cards and `lg` (24px) for the Home Hero card.
    - **Section Spacing:** Use `xl` (32px) to separate distinct functional areas.
- **Touch Targets:** A strict minimum of **44x44pt** is enforced for all interactive elements, including chips and small icons.

## Elevation & Depth

Hierarchy is conveyed through **Tonal Layering** and **Subtle Ambient Shadows**, following a "Flat-Plus" philosophy.

- **The Stack:**
    - **Level 0 (Base):** `secondary-background` (#F2F2F7).
    - **Level 1 (Cards):** `system-background` (#FFFFFF) with a very soft shadow (0px 2px 8px, 4% opacity black).
    - **Level 2 (Hero):** Main home card uses slightly higher elevation or a subtle border to denote priority.
    - **Level 3 (Overlay):** Sheets and Modals use the standard system blur and high-elevation shadow.
- **Liquid Glass:** Background blur (UIBlurEffect) is restricted exclusively to the Navigation Bar and Tab Bar. This ensures that the "Frame" feels integrated with the OS, while the "Content" remains stable and easy to read.

## Shapes

The shape language is purposefully **Rounded** to evoke a sense of softness and approachability.

- **Main Hero Cards:** 24pt corner radius.
- **Standard Content Cards:** 16pt corner radius.
- **Input Fields & List Items:** 12pt corner radius.
- **Action Elements:** Primary buttons and Chips use a **Pill (Capsule)** shape to clearly distinguish interactive elements from static content cards.
- **Borders:** Use hairline separators (0.5pt) for lists. Primary cards should not have borders, relying on color contrast and subtle shadows for definition.

## Components

### Buttons
- **Primary Action:** Capsule-shaped, `primary_color_hex` background with white text. 17pt Semibold.
- **Secondary Action:** Capsule-shaped, `brand-light` background with `primary_color_hex` text, or a simple ghost button with a hairline border.

### Chips & Tags
- Used for unit switching (kg/lb) or selecting moods. 
- **Active State:** Capsule shape, `primary_color_hex` background, white text.
- **Inactive State:** Capsule shape, `tertiary-background` background, `label-secondary` text.

### Cards
- **Home Hero Card:** 24pt radius, generous 24pt internal padding. Focuses on a single "Weight Display" number and AI companion text.
- **Data Card:** 16pt radius, 16pt internal padding. Used for charts and history lists.

### Lists
- Use the standard **iOS Grouped List** style. 
- Text is inset 16pt from the edge. 
- Items are separated by a `separator` hairline that does not extend to the left margin under icons.

### Inputs
- **Weight Entry:** Large-scale numeric input with no border, centered on a modal sheet.
- **Standard Fields:** 12pt rounded corners, `secondary-background` fill, 17pt regular text.

### Feedback & Haptics
- **Success:** Haptic "success" notification on weight log completion.
- **Selection:** Light haptic "selection" tap when switching chips or tabs.