import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get(
    "/",
    {
      schema: {
        querystring,
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

        const city = req.query.city;

        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const periods = await periodAPI(cookie, req.params.id, city);

        if (!periods.success)
          return reply.code(400).send({ message: periods.message });

        const periodsData = await Promise.all(
          periods.data.map((period) =>
            periodDateAPI(cookie, period, reply, city)
          )
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

const periodAPI = async (cookie, year, city) => {
  const params = new URLSearchParams();
  params.append("schoolYearId", year);

  return await fetch(`https://${city}/Ref/GetPeriods`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());
};

const periodDateAPI = async (cookie, period, reply, city) => {
  const params = new URLSearchParams();
  params.append("periodId", period.Id);

  const parallel = await fetch(`https://${city}/JceDiary/GetParallels`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());

  if (!parallel.success) throw new Error(parallel.message);

  params.append("parallelId", parallel.data[0].Id);

  const klasses = await fetch(`https://${city}/JceDiary/GetKlasses`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());

  if (!klasses.success) throw new Error(klasses.message);

  params.append("klassId", klasses.data[0].Id);

  const student = await fetch(`https://${city}/JceDiary/GetStudents`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());

  if (!student.success) throw new Error(student.message);

  params.append("studentId", student.data[0].Id);

  const diaryLink = await fetch(`https://${city}/JceDiary/GetJceDiary`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());

  const smsCookie = await fetch(diaryLink.data.Url, {
    method: "POST",
    headers: { cookie },
    body: params,
  });

  const newCookie = smsCookie.headers.raw()["set-cookie"][0].split(";")[0];

  if (newCookie.split("=")[0] !== "lang") {
    cookie = cookie + "; " + newCookie;

    reply.setCookie(newCookie.split("=")[0], newCookie.split("=")[1], {
      httpOnly: true,
      sameSite: "none",
      path: "/",
      secure: true,
    });
  }

  const diary = await fetch(`https://${city}/Jce/Diary/GetSubjects`, {
    method: "POST",
    headers: { cookie },
    body: params,
  }).then((res) => res.json());

  diary.period = period.Name;

  return diary;
};
