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

export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute, commandPaletteRoute]),
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
