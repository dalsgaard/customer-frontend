import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import { Router } from "@vaadin/router";
import "./components/app-root.js";
import "./pages/home-page.js";
import "./pages/customers-page.js";
import "./pages/not-found-page.js";

setBasePath("/shoelace/assets");

const router = new Router(document.getElementById("outlet"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/customers", component: "customers-page" },
  { path: "(.*)", component: "not-found-page" },
]);
