import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from "@tanstack/react-router";
import App, { PrototypeIndex } from "./app";

const rootRoute = createRootRoute({ component: App });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PrototypeIndex,
});
const commandPaletteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/command-palette",
  component: lazyRouteComponent(() => import("./command-palette-page"), "CommandPalettePage"),
});
const shikiCodeBlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shiki-code-block",
  component: lazyRouteComponent(() => import("./shiki-code-block-page"), "ShikiCodeBlockPage"),
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, commandPaletteRoute, shikiCodeBlockRoute]),
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
