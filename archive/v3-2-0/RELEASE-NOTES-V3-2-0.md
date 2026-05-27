# AG Grid Figma Design System Version 3.2.0 - Release Notes

Targeting: **AG Grid version 35.3.0** and **AG Charts version 13.3.0**
Release Date: **26th May 2026**

This release contains a large number of quality-of-life improvements, and updates to make the Figma more in line with the JavaScript library.

## What's New

**Collections restructured**

This release cleans up the variable architecture significantly. Four collections (AG-Theme, AG-Density, AG-Mode, AG-Chart) have been reduced to two (AG Theme, AG Chart) with the total variable count dropping from 689 to ~300, with all zombie variable IDs remapped or unbound.

**Ghost variables removed**

On the canvas, zombie boundVariable references have been cleared across nodes, 6 text nodes with external character-level textRangeFills bindings have been fixed, and 86 page-level explicitVariableModes entries removed across 47 pages — leaving zero external variable references across all 56 pages.

**Clean mode switching**

The mode picker is now cleaner too: the AG-Density entry is gone, leaving only AG Theme (Quartz Light, Quartz Dark) and AG Chart (Default, Sheets, Vivid, Polychroma).

#### Variable Collections Consolidated

- Reduced from 4 separate collections (AG-Theme, AG-Density, AG-Mode, AG-Chart) to 2 (AG Theme, AG Chart)
- Merged the AG-Theme and AG-Mode collections into a single unified AG Theme collection
- Removed the AG-Density collection; density variants (standard, compact, comfort) are no longer maintained as a separate variable collection
- Collection names updated: hyphens removed — AG-Theme → AG Theme, AG-Chart → AG Chart

#### Theme & Mode Unification

- Theme variants and light/dark modes are now combined into two descriptive mode names: Quartz Light and Quartz Dark
- Previously, theme selection (quartz / alpine) and light/dark lived in two separate collections and required coordinated mode switches — they are now a single selection
- Alpine theme removed; the AG Grid Design System file now focuses exclusively on the Quartz theme
- Total variable count reduced from 689 to 432, primarily by eliminating the 257 per-theme duplicate variables previously stored under quartz/ and alpine/ prefixes

#### Component-Based Variable Namespacing

- All variables have been reorganised from flat color/ and size/ prefixes into 20 component-based namespaces, making it significantly easier to locate and apply variables for specific UI areas. See our Theme parameters documentation for the complete groupings.

#### Variables Removed

- All quartz/ and alpine/ theme-prefixed duplicate variables removed (formerly stored in the AG-Theme collection)
- All alpine/ variables removed as part of Alpine theme deprecation
- AG-Density collection variables removed (size/standard, size/compact, size/comfort)

## Grid Cell component indentation

- The cell component now features an integrated toggle for indentation, eliminating the need to switch it out for an indented version.
