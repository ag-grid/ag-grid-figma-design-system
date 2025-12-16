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