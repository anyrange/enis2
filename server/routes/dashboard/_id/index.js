import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  fastify.get(
    "/",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: { id: { type: "string", minLength: 36, maxLength: 36 } },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid data" });

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const periods = await periodAPI(cookie, req.params.id);

        if (!periods.success)
          return reply.code(400).send({ message: periods.message });

        const periodsData = await Promise.all(
          periods.data.map((period) => periodDateAPI(cookie, period))
        );

        periodsData.forEach((periodData) => {
          if (!periodData.success) throw new Error("Что-то не пришло");
        });

        reply.code(200).send(periodsData);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}

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

const periodDateAPI = async (cookie, period) => {
  const params = new URLSearchParams();
  params.append("periodId", period.Id);

  const parallel = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetParallels",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  if (!parallel.success) throw new Error(parallel.message);

  params.append("parallelId", parallel.data[0].Id);

  const klasses = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetKlasses",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  if (!klasses.success) throw new Error(klasses.message);

  params.append("klassId", klasses.data[0].Id);

  const student = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetStudents",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  if (!student.success) throw new Error(student.message);

  params.append("studentId", student.data[0].Id);

  const diaryLink = await fetch(
    "https://sms.pvl.nis.edu.kz/JceDiary/GetJceDiary",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  const smsCookie = await fetch(diaryLink.data.Url, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).catch((err) => {
    throw err;
  });

  cookie =
    cookie + "; " + smsCookie.headers.raw()["set-cookie"][0].split(";")[0];

  const diary = await fetch(
    "https://sms.pvl.nis.edu.kz/Jce/Diary/GetSubjects",
    {
      method: "POST",
      headers: { cookie },
      body: params,
    }
  )
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });

  diary.period = period.Name;

  return diary;
};
