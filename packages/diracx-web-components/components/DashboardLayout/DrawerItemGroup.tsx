"use client";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import React, { useEffect } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { UserSection } from "@/types/UserSection";
import DrawerItem from "./DrawerItem";

/**
 * Represents a group of items in a drawer.
 *
 * @component
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The rendered DrawerItemGroup component.
 */
export default function DrawerItemGroup({
  group: { title, extended: expanded, items },
  setSections,
  handleContextMenu,
}: {
  /** The group object containing the title, expanded state, and items. */
  group: UserSection;
  /** The function to set the sections state. */
  setSections: React.Dispatch<React.SetStateAction<UserSection[]>>;
  /** The function to handle the context menu. */
  handleContextMenu: (
    type: "group" | "item" | null,
    id: string | null,
  ) => (event: React.MouseEvent<HTMLElement>) => void;
}) {
  // Ref to use for the drag and drop target
  const dropRef = React.useRef(null);
  // State to track whether the user is hovering over the item during a drag operation
  const [hovered, setHovered] = React.useState(false);

  useEffect(() => {
    if (!dropRef.current) return;
    const dropItem = dropRef.current;

    // Makes the element a valid drop target, sets up the data transfer and manage the hovered state
    return dropTargetForElements({
      element: dropItem,
      getData: () => ({ title }),
      onDragStart: () => setHovered(true),
      onDrop: () => {
        setHovered(false);
        handleChange(title)(null, true);
      },
      onDragEnter: () => setHovered(true),
      onDragLeave: () => setHovered(false),
    });
  });

  // Handles expansion of the accordion group
  const handleChange = (title: string) => (event: any, isExpanded: any) => {
    // Set the extended state of the accordion group.
    setSections((sections) =>
      sections.map((section) =>
        section.title === title
          ? { ...section, extended: isExpanded }
          : section,
      ),
    );
  };
  return (
    <Accordion
      sx={{
        width: "100%",
        backgroundColor: hovered ? "rgba(0, 30, 100, 0.3)" : "transparent",
      }}
      expanded={expanded}
      onChange={handleChange(title)}
      disableGutters
      ref={dropRef}
    >
      {/* Accordion summary */}
      <AccordionSummary expandIcon={<ExpandMore />}>{title}</AccordionSummary>
      {/* Accordion details */}
      <AccordionDetails>
        {items.map(({ title: itemTitle, id, icon }, index) => (
          <div onContextMenu={handleContextMenu("item", id)} key={id}>
            <DrawerItem
              item={{ title: itemTitle, id, icon }}
              index={index}
              groupTitle={title}
            />
          </div>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}
