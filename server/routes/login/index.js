import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.post("/", async (req, reply) => {
    console.log(req.body.login);

    const params = new URLSearchParams();
    params.append("login", req.body.login);
    params.append("password", req.body.password);
    req.body.captchaInput &&
      params.append("captchaInput", req.body.captchaInput);

    const aboba = await fetch("https://sms.pvl.nis.edu.kz/root/Account/LogOn", {
      method: "POST",
      body: params,
      //cookie: 'accessToken=1234abc; userId=1234'
    }).catch((err) => {
      console.log(err);
    });
    const body = await aboba.json();
    const cookies = parseCookies(aboba);

    cookies.forEach((cock) =>
      reply.setCookie(cock.name, cock.value, {
        path: process.env.FRONTEND_URI,
        httpOnly: true,
      })
    );
    reply.code(200).send(body);
  });

  function parseCookies(res) {
    const raw = res.headers.raw()["set-cookie"];
    return raw.map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0].split("=");

      return {
        name: cookiePart[0],
        value: cookiePart[1],
      };
    });
  }
}
