export function whereAmI() {
  const currentURL = window.location.href;
  const lastSegment = currentURL.split("/").pop();
  return lastSegment.split("?")[0];
  }
