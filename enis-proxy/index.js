const express = require("express");
const app = express();

const fetch = require("node-fetch");
const { URLSearchParams } = require("url");
let port = process.env.PORT || 3003;

app.use(express.json());

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

app.post("/root", async (req, res) => {
  console.log(req.body);

  const params = new URLSearchParams();
  params.append("login", req.body.login);
  params.append("password", req.body.password);

  const aboba = await fetch("https://sms.pvl.nis.edu.kz/root/Account/LogOn", {
    method: "POST",
    body: params,
  })
    .then((res) => res.json())
    .catch((err) => {
      console.log(err);
    });

  res.json(aboba);
});

app.listen(port, () => console.log("Server is listening on port " + port));
