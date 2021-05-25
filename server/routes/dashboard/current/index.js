import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get("/", async (req, reply) => {
    try {
      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const dates = await dateAPI(cookie);

      if (typeof dates === "string")
        return reply.code(400).send({ message: dates });

      if (!dates.success)
        return reply.code(400).send({ message: dates.message });

      const periods = await periodAPI(
        cookie,
        dates.data?.find((date) => date.Data.IsActual).Id
      );

      if (!periods.success)
        return reply.code(400).send({ message: periods.message });

      const periodsData = await Promise.all(
        periods.data.map((period) => periodDateAPI(cookie, period, reply))
      );

      periodsData.forEach((periodData) => {
        if (!periodData.success) throw new Error("Что-то не пришло");
      });

      reply.code(200).send(periodsData);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Что-то пошло не так!" });
    }
  });
}

const dateAPI = async (cookie) => {
  return await fetch(
    "https://sms.pvl.nis.edu.kz/Ref/GetSchoolYears?fullData=true",
    {
      headers: { cookie },
    }
  )
    .then(async (res) => {
      const sessionExpiredText = await res.text();
      if (sessionExpiredText) return JSON.parse(sessionExpiredText);
      return res.json();
    })
    .catch((err) => {
      throw err;
    });
};

const periodAPI = async (cookie, year) => {
  const params = new URLSearchParams();
  params.append("schoolYearId", year);

  return await fetch("https://sms.pvl.nis.edu.kz/Ref/GetPeriods", {
    method: "POST",
    headers: { cookie },
    body: params,
  })
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });
};

const periodDateAPI = async (cookie, period, reply) => {
  const params = new URLSearchParams();
  params.append("periodId", period.Id);

  const parallel = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetParallels",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  ).then((res) => res.json());

  params.append("parallelId", parallel.data[0].Id);

  const klasses = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetKlasses",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  ).then((res) => res.json());

  params.append("klassId", klasses.data[0].Id);

  const student = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetStudents",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  ).then((res) => res.json());

  params.append("studentId", student.data[0].Id);

  const diaryLink = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetJceDiary",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  ).then((res) => res.json());

  const smsCookie = await fetch(diaryLink.data.Url, {
    method: "POST",
    headers: { cookie },
    body: params,
  });

  const newCookie = smsCookie.headers.raw()["set-cookie"][0].split(";")[0];

  if (newCookie.split("=")[0] === "sms_Pavlodar_jce_SessionID") {
    cookie = cookie + "; " + newCookie;

    reply.setCookie(newCookie.split("=")[0], newCookie.split("=")[1], {
      httpOnly: true,
    });
  }

  const diary = await fetch(
    "https://sms.pvl.nis.edu.kz/Jce/Diary/GetSubjects",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  ).then((res) => res.json());

  diary.period = period.Name;

  return diary;
};
