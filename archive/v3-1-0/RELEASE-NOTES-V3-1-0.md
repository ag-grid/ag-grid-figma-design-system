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