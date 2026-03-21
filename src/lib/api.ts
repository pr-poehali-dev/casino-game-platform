const AUTH_URL = "https://functions.poehali.dev/1bbbd251-3538-464a-8103-ec30150da832";
const LOTO_URL = "https://functions.poehali.dev/34e6acc7-7ae7-46c1-b112-bdd67172ad4f";

function getToken(): string | null {
  return localStorage.getItem("dcoin_token");
}

export function setToken(token: string) {
  localStorage.setItem("dcoin_token", token);
}

export function clearToken() {
  localStorage.removeItem("dcoin_token");
}

async function request(baseUrl: string, action: string, method: "GET" | "POST" = "GET", body?: unknown) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${baseUrl}?action=${action}`;
  const res = await fetch(url, {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(body || {}) : undefined,
  });

  const data = await res.json();
  if (!res.ok && data.error) throw new Error(data.error);
  return data;
}

export const authApi = {
  register: (name: string, email: string, password: string) =>
    request(AUTH_URL, "register", "POST", { name, email, password }),
  login: (email: string, password: string) =>
    request(AUTH_URL, "login", "POST", { email, password }),
  me: () => request(AUTH_URL, "me", "GET"),
  logout: () => request(AUTH_URL, "logout", "POST"),
};

export const lotoApi = {
  status: () => request(LOTO_URL, "status", "GET"),
  buy: (quantity: number) => request(LOTO_URL, "buy", "POST", { quantity }),
  draw: () => request(LOTO_URL, "draw", "POST"),
  myTickets: () => request(LOTO_URL, "my-tickets", "GET"),
  history: () => request(LOTO_URL, "history", "GET"),
};

export default { authApi, lotoApi };
