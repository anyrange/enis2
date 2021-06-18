export function parseCookies(res) {
  const raw = res.headers.raw()["set-cookie"];

  if (!raw) return null;

  return raw.map((entry) => {
    const parts = entry.split(";");
    const cookiePart = parts[0].split("=");

    return {
      name: cookiePart[0],
      value: cookiePart[1],
    };
  });
}
