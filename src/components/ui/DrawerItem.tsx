import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ListItemButton,
  ListItemIcon,
  Icon,
  ListItemText,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import {
  Edge,
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

export default function DrawerItem({
  item: { title, icon, path },
  index,
  groupTitle,
}: {
  item: { title: string; icon: React.ComponentType; path: string };
  index: number;
  groupTitle: string;
}) {
  const dragRef = React.useRef(null);
  const handleRef = React.useRef(null);

  const [closestEdge, setClosestEdge]: any = useState<Edge | null>(null);

  useEffect(() => {
    if (!dragRef.current || !handleRef.current) return;
    const element = dragRef.current;
    const handleItem = handleRef.current;
    const title = groupTitle;

    return combine(
      draggable({
        element: element,
        dragHandle: handleItem,
        getInitialData: () => ({ index, title }),
      }),
      dropTargetForElements({
        element: element,
        getData: ({ input, element }) => {
          return attachClosestEdge(
            { index, title },
            { input, element, allowedEdges: ["top", "bottom"] },
          );
        },
        onDrag({ self, source }) {
          const isSource = source.element === element;
          if (isSource) {
            setClosestEdge(null);
            return;
          }
          const closestEdge = extractClosestEdge(self.data);

          const sourceIndex = source.data.index;
          if (typeof sourceIndex === "number") {
            const isItemBeforeSource =
              index === sourceIndex - 1 && source.data.title === title;
            const isItemAfterSource =
              index === sourceIndex + 1 && source.data.title === title;

            const isDropIndicatorHidden =
              (isItemBeforeSource && closestEdge === "bottom") ||
              (isItemAfterSource && closestEdge === "top");

            if (isDropIndicatorHidden) {
              setClosestEdge(null);
              return;
            }
          }
          setClosestEdge(closestEdge);
        },
        onDragLeave() {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      }),
    );
  }, [index, groupTitle]);

  return (
    <>
      <ListItemButton
        disableGutters
        key={title}
        component={Link}
        href={path}
        sx={{ pl: 2, borderRadius: 2, pr: 1 }}
        ref={dragRef}
      >
        <ListItemIcon>
          <Icon component={icon} />
        </ListItemIcon>
        <ListItemText primary={title} />
        <div>
          <Icon
            component={DragIndicatorIcon}
            sx={{ cursor: "grab" }}
            ref={handleRef}
          />
        </div>
        {closestEdge && <DropIndicator edge={closestEdge} />}
      </ListItemButton>
    </>
  );
}
