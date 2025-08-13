const API_BASE = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

async function request(path, { method = "GET", headers = {}, body } = {}) {
  const res = await fetch(`${API_BASE}${path}` , {
    method,
    headers: (() => {
      const isForm = body instanceof FormData;
      const hdrs = { ...headers };
      if (!isForm) hdrs["Content-Type"] = "application/json";
      return hdrs;
    })(),
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    let errMsg = `Request failed (${res.status})`;
    try { const j = await res.json(); errMsg = j.error || errMsg; } catch {}
    throw new Error(errMsg);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const api = {
  offers: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/offers${qs ? `?${qs}` : ""}`);
    },
    create: (payload) => request(`/api/offers`, { method: "POST", body: payload }),
    update: (id, payload) => request(`/api/offers/${id}`, { method: "PUT", body: payload }),
    remove: (id) => request(`/api/offers/${id}`, { method: "DELETE" }),
    bulk: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/api/offers/bulk`, { method: "POST", body: fd });
    },
    template: () => request(`/api/offers/template`),

  },
  categories: {
    list: () => request(`/api/categories`),
  },
  feedback: {
    questions: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/feedback/questions${qs ? `?${qs}` : ""}`);
    },
    submit: (payload) => request(`/api/feedback/submit`, { method: "POST", body: payload }),
  },
  analytics: {
    scan: (payload) => request(`/api/analytics/scan`, { method: "POST", body: payload }),
    overview: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/api/analytics/overview${qs ? `?${qs}` : ""}`);
    },
  },
  sales: {
    upload: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      return request(`/api/sales/upload`, { method: "POST", body: fd });
    },
    template: () => request(`/api/sales/template`),
  },
  auth: {
    signup: (payload) => request(`/api/auth/signup`, { method: "POST", body: payload }),
    verify: (payload) => request(`/api/auth/verify`, { method: "POST", body: payload }),
  },
};
