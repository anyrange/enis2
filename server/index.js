const express = require("express");
const app = express();
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

let port = process.env.PORT || 8887;

app.use(express.json());
// app.use(express.cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.get("origin"));
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Request-Method", "POST, GET, OPTIONS, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/login", async (req, res) => {
  console.log(JSON.stringify(req.body, "", 2));

  const params = new URLSearchParams();
  params.append("login", req.body.login);
  params.append("password", req.body.password);
  req.body.captchaInput && params.append("captchaInput", req.body.captchaInput);

  const aboba = await fetch("https://sms.pvl.nis.edu.kz/root/Account/LogOn", {
    method: "POST",
    body: params,
    //cookie: 'accessToken=1234abc; userId=1234'
  }).catch((err) => {
    console.log(err);
  });
  const body = await aboba.json();
  const cookies = parseCookies(aboba);
  console.log(JSON.stringify(body, "", 2));
  console.log(JSON.stringify(cookies, "", 2));
  res.cookie("cock", cookies, { maxAge: 900000, httpOnly: true });
  res.json(body);
});

function parseCookies(response) {
  const raw = response.headers.raw()["set-cookie"];
  return raw
    .map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(";");
}

app.listen(port, () => console.log("Server is listening on port " + port));
