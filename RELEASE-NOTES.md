# AG Grid Figma Design System Version 3.1.0 - Release Notes

Targeting: **AG Grid version 35.1.0** and **AG Charts version 13.1.0**
Release Date: **2nd March 2026**

This release contains a large number of quality-of-life improvements, and updates to make the Figma more in line with the JavaScript library.

## What's New

#### Component Reorganization & Page Structure

- Moved Cell Data Highlight to the Cell page
- Relocated Tab Panel to the Menus Template page
- Created a new Status Bar page within Components and moved Pagination and Status Bar components there
- Consolidated Pagination Control under the Status Bar page
- Moved Drop Panel to the Tool Bar Template page
- Moved Large Text Input to the Input Filter component page
- Moved sideButtonBar, sideButton-Vert, sideButton-Horiz, Tab Icons, and Tab to the Tool Panel page
- Renamed page “Menus and Popups” to “Menus”
- Moved “Custom Slot” content to the “Grid Cell” page.

#### Menu System Enhancements

- Renamed Menu Container to Menu and relocated it to the Menu page
- Renamed Menu Container component to Column Menu
- Removed nested component properties within Menu components to simplify structure and improve maintainability
- Removed menu and filter background colors to increase flexibility and enable transparency
- Added new Filter Menu component
- Added new Chart Menu component
- Added new Column-Menu-Default component
- Added new Column-Menu component
- Introduced Legacy Tabbed Column Menu component
- Added a Dropdown Menu component to the Menus page

#### Filter & Grid Updates

- Renamed Grid Filter to Multi Filter
- Restructured Text Filter on the Filters page
- Renamed component “Selection Marquee” to “Cell Data Marquee”
- Moved Cell Selection Marquee and Cell Data Marquee to the Grid Cell asset category

#### Component Cleanup

Removed the following deprecated components:

- Grid-Filter-Dropdown-List
- Grid-Filter-Radio-List
- Filter-Menu-Layout
- Filter-Menu-Filter
- Filter-Menu-Column
- Grid-Filter-Dropdown-Custom

## Bug Fixes

- Removed duplicate “Checkbox List” component.
- Corrected the Text Filter component: replaced the incorrect cell input with the proper filter input.
- Fixed the Numbered Rows toggle in the Column-Based Grid.
- Restored the missing rowHeight variable on a row within the Row-Based Grid.
- Resolved auto-layout issues on the header in the Grid Container for both Column-Based and Row-Based grids

---

# AG Grid Figma Design System Version 3.0.1 - Release Notes

Targeting: **AG Grid version 35.0.0** and **AG Charts version 13.0.0**
Release Date: **12th January 2026**

This patch release fixes a regression where the "Features" > "Sticker Sheet" page was removed.

The Sticker Sheet is a single-page view of the design system’s components, giving you a quick, at-a-glance understanding of what the system includes.
It’s organized into three sections, each showing component instances for:

- Grids
- Charts
- Integrated Charts

## What's New

No new features added in this release

## Breaking Changes

No breaking changes in this release

## Bug Fixes

Missing "Features" > "Sticker Sheet" page replaced.

---

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

---

# AG Grid Figma Design System Version 2.3.0 - Release Notes

Targeting: **AG Grid version 34.3.0** and **AG Charts version 12.3.0**
Release Date: **3rd November 2025**

This release adds the new features "Cell and Row Batch Edit", "New Filters Tool Panel", "Find Highlight", and "Row numbers". And fixes several minor bugs.

## What's New

#### Cell and Row Batch Edit

We've added a new "Batch Edit" state to the Cell component to simulate inline editing behaviour for both cells and rows. This state visually indicates when a cell or an entire row is in edit mode, aligning the design more closely with AG Grid's batch editing experience.

#### "New Filter" Tool Panel

We added the new "Add Filter" panel into our tool panel in the design system.

#### Find Highlight

We added a component to mimic "find" highlights in the cell.

#### Row Numbers

We added a component to mimic row numbers in the grid.

## Breaking Changes

#### Left and Right Aligned Cells

We've split the Cell component into two distinct components — Cell-Left and Cell-Right — to improve clarity, consistency, and alignment control across our grids.

## Bug Fixes

#### Updated the Column Header Component

We removed the "Draggable" toggle from the Grid Header component.

#### Quartz Border Radius

We reset the "wrapperBorderRadius" variant on Quartz theme to 8px.
