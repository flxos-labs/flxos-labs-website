export interface SidebarLink {
  id: string;
  label: string;
}

export interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

export const sidebarData: SidebarSection[] = [
  {
    title: "Getting Started",
    links: [
      { id: "installation", label: "Installation" },
      { id: "quick-start", label: "Quick Start" },
      { id: "prerequisites", label: "Prerequisites" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { id: "overview", label: "System Overview" },
      { id: "directory", label: "Directory Structure" },
      { id: "modules", label: "Core Modules" },
    ],
  },
  {
    title: "Development",
    links: [
      { id: "building", label: "Building" },
      { id: "configuration", label: "Configuration" },
      { id: "apps", label: "Creating Apps" },
    ],
  },
  {
    title: "Reference",
    links: [
      { id: "api", label: "API Reference" },
      { id: "troubleshooting", label: "Troubleshooting" },
    ],
  },
];
