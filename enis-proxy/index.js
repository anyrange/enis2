const express = require("express");
const app = express();
const proxy = require("http-proxy-middleware");
const parser = require("body-parser");
let port = process.env.PORT || 3003;

app.use(
  parser.urlencoded({
    extended: false,
  })
);

app.use(parser.json());

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

app.use(express.static("static"));

app.use(
  "/spotiworm",
  proxy({
    target: "http://127.0.0.1:8888/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Aktau",
  proxy({
    target: "http://sms.akt.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Aktobe",
  proxy({
    target: "http://sms.akb.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Almaty_Fmsh",
  proxy({
    target: "http://sms.fmalm.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Almaty_Hbsh",
  proxy({
    target: "http://sms.hbalm.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Astana_Fmsh",
  proxy({
    target: "http://sms.ast.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Atyrau",
  proxy({
    target: "http://sms.atr.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Karaganda",
  proxy({
    target: "http://sms.krg.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Kokshetau",
  proxy({
    target: "http://sms.kt.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Kostanay",
  proxy({
    target: "http://sms.kst.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Kyzylorda",
  proxy({
    target: "http://sms.kzl.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/root",
  proxy({
    target: "http://sms.pvl.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Petropavlovsk",
  proxy({
    target: "http://sms.ptr.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Semey_FMSH",
  proxy({
    target: "http://sms.sm.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Taldykorgan",
  proxy({
    target: "http://sms.tk.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Taraz",
  proxy({
    target: "http://sms.trz.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Uralsk",
  proxy({
    target: "http://sms.ura.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Oskemen",
  proxy({
    target: "http://sms.ukk.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Shymkent_Fmsh",
  proxy({
    target: "http://sms.fmsh.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.use(
  "/Shymkent_Hbsh",
  proxy({
    target: "http://sms.hbsh.nis.edu.kz/",
    changeOrigin: true,
    protocolRewrite: "http",
    secure: false,
  })
);

app.listen(port, () => console.log("Server is listening on port " + port));
