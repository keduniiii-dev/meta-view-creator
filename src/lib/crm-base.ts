const CRM_HOST = "crm.twinblueprint.com";

function readHost(): string {
  return typeof window === "undefined" ? "" : window.location.hostname.toLowerCase();
}

export function isCrmHost(): boolean {
  return readHost() === CRM_HOST;
}

const prefix = isCrmHost() ? "" : "/crm";

export function crmPath(path = ""): string {
  if (!path || path === "/") return prefix || "/";
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
}
