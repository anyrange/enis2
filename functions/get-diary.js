import { URLSearchParams } from "url";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { headers, SECRET } from "./config";
import { api } from "../server/plugins/api";
import { cookieParse } from "../server/plugins/cookieParse";
import { mergeCookies } from "../server/plugins/mergeCookies";

const handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }
  try {
    const auth = event.headers.authorization;

    if (!auth)
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ msg: "Unauthorized" }),
      };

    const authToken = auth.replace("Bearer ", "");

    const { termId: termID, city } = event.queryStringParameters;

    const baseUrl = `https://sms.${city}.nis.edu.kz`;

    let { cookies: cookie, account } = jwt.verify(authToken, SECRET);

    const params = new URLSearchParams();
    params.append("periodId", termID);

    const parallel = await api({
      url: `${baseUrl}/JceDiary/GetParallels`,
      method: "POST",
      body: params,
      cookie,
    });

    params.append("parallelId", parallel.data[0].Id);

    const klasses = await api({
      url: `${baseUrl}/JceDiary/GetKlasses`,
      method: "POST",
      body: params,
      cookie,
    });

    params.append("klassId", klasses.data[0].Id);

    const student = await api({
      url: `${baseUrl}/JceDiary/GetStudents`,
      method: "POST",
      body: params,
      cookie,
    });

    params.append("studentId", student.data[0].Id);

    const diaryLink = await api({
      url: `${baseUrl}/JceDiary/GetJceDiary`,
      method: "POST",
      body: params,
      cookie,
    });

    const cookieResponse = await fetch(diaryLink.data.Url, {
      method: "POST",
      headers: { cookie },
      body: params,
    });

    const newCookies = cookieParse(cookieResponse);

    if (newCookies) cookie = mergeCookies(cookie, newCookies);

    const periodsData = await api({
      url: `${baseUrl}/Jce/Diary/GetSubjects`,
      method: "POST",
      body: params,
      cookie,
    });

    const token = jwt.sign({ cookies: cookie, account }, SECRET);

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        data: periodsData.data.map((el) => ({
          ...el,
          Evaluations: el.Evaluations.map((el2) => el2.Id),
        })),
        token,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};

export { handler };
