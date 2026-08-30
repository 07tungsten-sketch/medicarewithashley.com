// Keep one route from each important page family in the build gates.
// Both static validation and production-serving verification consume this list.
export const representativeInnerRoutes = Object.freeze([
  "/about",
  "/medicare-basics",
  "/blog/best-medicare-options-san-diego-county",
  "/medicare-broker-la-jolla",
  "/sharp-healthcare-medicare-san-diego",
]);