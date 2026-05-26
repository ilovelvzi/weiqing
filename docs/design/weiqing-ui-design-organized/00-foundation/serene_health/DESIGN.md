---
name: Serene Health
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3dae9'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce3f2'
  on-surface: '#151c27'
  on-surface-variant: '#424751'
  inverse-surface: '#2a313c'
  inverse-on-surface: '#ebf1ff'
  outline: '#727782'
  outline-variant: '#c2c6d2'
  surface-tint: '#205fa5'
  primary: '#205fa5'
  on-primary: '#ffffff'
  primary-container: '#7eb3ff'
  on-primary-container: '#004481'
  inverse-primary: '#a6c8ff'
  secondary: '#3d6751'
  on-secondary: '#ffffff'
  secondary-container: '#bfedd1'
  on-secondary-container: '#436d57'
  tertiary: '#725b2b'
  on-tertiary: '#ffffff'
  tertiary-container: '#caad75'
  on-tertiary-container: '#554013'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#004786'
  secondary-fixed: '#bfedd1'
  secondary-fixed-dim: '#a4d1b6'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#254f3a'
  tertiary-fixed: '#fedfa3'
  tertiary-fixed-dim: '#e1c389'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#584416'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce3f2'
typography:
  display-num:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  margin-mobile: 20px
  margin-desktop: 64px
  gutter: 16px
---

## Brand & Style

The design system is anchored in a "Healing Minimalism" philosophy, specifically tailored for a light health and companionate user experience. It avoids the sterile coldness of traditional clinical apps, opting instead for an "Airy" aesthetic that reduces cognitive load and visual pressure.

Drawing inspiration from the best of Apple’s design language, the style utilizes generous white space, subtle depth, and a refined "Gray-white" palette. The personality is gentle and supportive—functioning as a quiet companion rather than an aggressive coach. Every interface element is designed to feel soft to the touch, evoking a sense of calm and accessibility that appeals to a modern, health-conscious female demographic without relying on gendered color tropes.

## Colors

The palette is centered around "Cloud Blue" (#7EB3FF), a desaturated and lightened evolution of standard system blue. This primary hue is intended to guide the user's eye with a soft touch, appearing in key actionable elements and progress indicators.

The background uses a custom variation of Apple’s grouped background style, injected with a hint of warmth to prevent "screen fatigue." 

- **Primary (Cloud Blue):** Used for primary actions and highlights. It is energetic enough to be clear but soft enough to remain "low pressure."
- **Secondary (Soft Sage):** Reserved for success states and health milestones, offering a natural, healing alternative to harsh greens.
- **Tertiary (Warm Amber):** Used for gentle warnings or non-urgent notifications.
- **Neutrals:** We avoid pure black (#000000) entirely. The darkest text color is a deep Slate Gray (#2C2E33), ensuring high legibility for large numerical data while maintaining a soft visual contrast against the warm white backgrounds.

## Typography

This design system utilizes **Manrope** for its exceptional balance between geometric precision and organic warmth. It feels modern and professional yet approachable.

The typographic hierarchy prioritizes "Large Numbers" through the `display-num` token. These should be used for primary health metrics (steps, heart rate, minutes), utilizing a heavy weight and tight letter-spacing to create a focal point without cluttering the screen. All body text is set with generous line-height to maintain the "Airy" feel and ensure readability for users of all ages.

## Layout & Spacing

The layout is built on a strict 8pt grid system to ensure mathematical harmony. We utilize a **Fluid Grid** model that adapts to the viewport while maintaining significant outer margins to preserve the "Airy" aesthetic.

- **Mobile:** 4-column layout with 20px side margins. 
- **Desktop:** 12-column layout centered within a max-width container of 1200px.

Whitespace is treated as a first-class citizen. Components are never cramped; vertical rhythm is maintained using `md` (24px) or `lg` (40px) increments to create "breathing room" between functional sections, reinforcing the low-pressure objective.

## Elevation & Depth

Depth is achieved through a combination of **Tonal Layering** and **Ambient Shadows**. We move away from heavy, dark shadows in favor of "Airy" shadows—very high blur (20px+) and very low opacity (4-6%), often tinted with a hint of the primary blue or the warm background color.

Surfaces should feel like light layers of paper floating over a soft base. For high-priority cards, a subtle 1px inner stroke (border) with low opacity is used to provide definition without the harshness of a standard border. Backdrop blurs (Glassmorphism) are used sparingly on navigation bars and floating action buttons to maintain a sense of context and depth.

## Shapes

The shape language is "Rounded" (Radius: 0.5rem / 8px base). This aligns with the iOS HIG while leaning into the "Healing" personality. Sharp corners are avoided entirely as they evoke tension.

Larger containers like health cards use `rounded-xl` (1.5rem / 24px) to create a soft, "pill-like" enclosure for data. Interactive elements like buttons utilize a medium rounding that feels comfortable and inviting to tap.

## Components

### Buttons
Primary buttons use the "Cloud Blue" with white text. Secondary buttons are "Ghost" style with a subtle gray-white fill and blue text. All buttons feature a 16px vertical padding to ensure a large, accessible hit area.

### Cards
Cards are the primary vessel for information. They feature a white background, the "Airy" ambient shadow, and 24px internal padding. Numbers inside cards should use the `display-num` typography level.

### Inputs
Text fields use a soft gray background (`background-grouped`) rather than a border. On focus, they transition to a white background with a 1px "Cloud Blue" soft glow.

### Chips & Tags
Used for health categories or filters. These should be semi-transparent versions of the primary color with 10% opacity, ensuring they feel "light" and do not compete with primary actions.

### Progress Bars
Utilize a rounded-cap design. The track is a very pale gray, while the indicator is a smooth gradient of Cloud Blue, giving a sense of fluid movement and growth.