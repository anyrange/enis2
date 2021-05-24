# enis-proxy
## Simple proxy for enis app  

This proxy is created in order to circumvent CORS policy in browsers. This problem is caused by EIOS servers themselves (~~it is not public API~~)

There were some [attempts](https://github.com/kekland/nis-server) to create custom APIs (as an interlayer) but proxy is a better way to build a client for EIOS

### Usage:

Use as regular EIOS API but with server address in the beginning:

**For example:**

Instead of `http://pvl.nis.edu.kz/Pavlodar/ImkoDiary/Students/` you should use `http://YOURPROXYURL/Pavlodar/ImkoDiary/Students/`

### Warning!

Pass body of a request as a query string parameters! Otherwise it will not work!

### List of cities:

- Aktau
- Aktobe
- Almaty_Fmsh
- Almaty_Hbsh
- Astana_Fmsh
- Atyrau
- Karaganda
- Kokshetau
- Kostanay
- Kyzylorda
- Pavlodar
- Petropavlovsk
- Semey_FMSH
- Taldykorgan
- Taraz
- Uralsk
- Oskemen
- Shymkent_Fmsh
- Shymkent_Hbsh