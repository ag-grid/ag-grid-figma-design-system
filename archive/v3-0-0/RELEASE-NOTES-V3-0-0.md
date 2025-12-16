# AG Grid Figma Design System Version 3.0.0 - Release Notes

Targeting: **AG Grid version 35.0.0** and **AG Charts version 13.0.0**
Release Date: **19th December 2025**

In this release, the AG Grid cell component has been re-engineered to improve performance and maintainability. Deep nesting and excess layers have been reduced, and a slot-based structure has been introduced for clearer, more flexible content composition. Core behaviours and states remain the same—this change primarily simplifies how cells are built and customised going forward.

## What's New

#### Cell Indent Component 
We added a new “cell indent” component and a [tutorial video](https://www.youtube.com/watch?v=ilvd6o7PgMk) to assist in its use.

## Breaking Changes 

#### Default grid component updates
The following panels have been hidden by default in the Grid component; the footer, the grouping panel and the tool panel. The can be revealed through a toggle switch in the properties panel

#### Cell Component Performance improvements
We replaced the cell component with a simplified new cell component reducing layers and improving performance.

## Bug Fixes

No bug fixes in this release