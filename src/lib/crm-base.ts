const DEFAULT_CRM_HOSTS = ["crm.twinblueprint.com"];
const DEFAULT_CRM_ORIGIN = "https://crm.twinblueprint.com";
const DEFAULT_MAIN_SITE_ORIGIN = "https://www.twinblueprint.com";
const LOCAL_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "[::1]"];

function currentHost(): string {
  return typeof window === "undefined" ? "" : window.location.hostname.toLowerCase();
}

function parseHosts(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
}

function crmHosts(): Set<string> {
  const hosts = new Set([...DEFAULT_CRM_HOSTS, ...parseHosts(import.meta.env.VITE_CRM_HOSTS)]);
  if (import.meta.env.DEV) LOCAL_HOSTS.forEach((host) => hosts.add(host));
  return hosts;
}

function trimOrigin(value: string | undefined, fallback: string): string {
  return (value ?? fallback).replace(/\/+$/, "");
}

export function isCrmHost(): boolean {
  return crmHosts().has(currentHost());
}

export function isCrmOnlyHost(): boolean {
  return isCrmHost() && !import.meta.env.DEV;
}

export function crmOrigin(): string {
  return trimOrigin(import.meta.env.VITE_CRM_ORIGIN, DEFAULT_CRM_ORIGIN);
}

export function mainSiteOrigin(): string {
  return trimOrigin(import.meta.env.VITE_MAIN_SITE_ORIGIN, DEFAULT_MAIN_SITE_ORIGIN);
}

const prefix = isCrmOnlyHost() ? "" : "/crm";

export function crmPath(path = ""): string {
  if (!path || path === "/") return prefix || "/";
  return `${prefix}${path.startsWith("/") ? path : `/${path}`}`;
}
