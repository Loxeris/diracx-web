"use client";
import * as React from "react";
import NextLink from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MonitorIcon from "@mui/icons-material/Monitor";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Icon from "@mui/material/Icon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Stack from "@mui/material/Stack";
import { DiracLogo } from "./DiracLogo";
import { Dashboard, FolderCopy } from "@mui/icons-material";
import { LoginButton } from "./LoginButton";

interface DashboardAppBarProps {
  children: React.ReactNode;
}

// Sections accessible to the users
const userSections: Record<
  string,
  { icon: React.ComponentType; path: string }
> = {
  Dashboard: { icon: Dashboard, path: "/dashboard" },
  "Job Monitor": { icon: MonitorIcon, path: "/dashboard/jobmonitor" },
  "File Catalog": { icon: FolderCopy, path: "/dashboard/filecatalog" },
};

/**
 * Build a side bar on the left containing the available sections as well as a top bar.
 * The side bar is expected to collapse if displayed on a small screen
 *
 * @param props - children
 * @return an dashboard layout
 */
export default function DashboardAppBar(props: DashboardAppBarProps) {
  /** State management for mobile drawer */
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /** State management for selected section in the drawer */
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  /** Drawer width */
  const drawerWidth = 240;

  /** Drawer component: a logo, a list of sections and a link to the documentation */
  const drawer = (
    <div>
      <Toolbar>
        <DiracLogo />
      </Toolbar>
      <List>
        {Object.keys(userSections).map((title: string, index: number) => (
          <ListItem key={title} disablePadding>
            <ListItemButton
              component={NextLink}
              href={userSections[title]["path"]}
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemIcon>
                <Icon component={userSections[title]["icon"]} />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List style={{ position: "absolute", bottom: "0" }}>
        <ListItem key={"Documentation"}>
          <ListItemButton
            target="_blank"
            href="https://dirac.readthedocs.io/en/latest/"
          >
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary={"Documentation"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;

  /** Return an App bar embedding the drawer */
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "white",
        }}
      >
        <Stack direction="row">
          <Toolbar>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          <Toolbar
            sx={{
              justifyContent: "space-between",
              flexGrow: 1,
            }}
          >
            <div />
            <LoginButton />
          </Toolbar>
        </Stack>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="side bar"
      >
        {}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ pt: 10, px: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {props.children}
      </Box>
    </Box>
  );
}