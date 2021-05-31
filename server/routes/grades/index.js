import fetch from "node-fetch";

export default async function(fastify) {
  const querystring = fastify.getSchema("domain");
  fastify.get(
    "/",
    {
      schema: {
        querystring,
        response: {
          200: {
            type: "object",

            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    SubjectName: { type: "string" },
                    FirstPeriod: { type: "string" },
                    SecondPeriod: { type: "string" },
                    FirstHalfYear: { type: "string" },
                    ThirdPeriod: { type: "string" },
                    ForthPeriod: { type: "string" },
                    SecondHalfYear: { type: "string" },
                    Exam: { type: "string" },
                    Year: { type: "string" },
                    Final: { type: "string" },
                    IsNotChosen: { type: "boolean" },
                  },
                },
              },
            },
          },
        },
      },
      attachValidation: true,
    },
    async (req, reply) => {
      try {
        if (req.validationError)
          return reply.code(404).send({ message: "Invalid data" });

        const domain = req.query.city;
        const params = new URLSearchParams();
        const cookie = Object.entries(req.cookies)
          .map((cookie) => cookie.join("="))
          .join("; ");

        const [schoolYears, organization] = await Promise.all([
          yearsAPI(cookie, domain),
          orgsAPI(cookie, domain),
        ]);

        if (typeof schoolYears === "string")
          return reply.code(400).send({ message: schoolYears });
        if (!schoolYears.success)
          return reply.code(400).send({ message: schoolYears.message });
        const actualYear = schoolYears.data.find((year) => year.Data.IsActual);

        params.append("schoolYearId", actualYear.Id);

        if (typeof organization === "string")
          return reply.code(400).send({ message: organization });
        if (!organization.success)
          return reply.code(400).send({ message: organization.message });

        params.append("organizationId", organization.data[0].Id);
        params.append("organizationInternalId", organization.data[0].Id);

        const parallels = await fetch(
          `https://${domain}/reportcard/GetParallels`,
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        ).then((res) => res.json());

        if (!parallels.success)
          return reply.code(400).send({ message: parallels.message });

        params.append("parallelId", parallels.data[0].Id);

        const klasses = await fetch(`https://${domain}/reportcard/GetKlasses`, {
          method: "POST",
          body: params,
          headers: { cookie },
        }).then((res) => res.json());

        if (!klasses.success)
          return reply.code(400).send({ message: klasses.message });

        params.append("klassId", klasses.data[0].Id);

        const students = await fetch(
          `https://${domain}/reportcard/GetStudents`,
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        ).then((res) => res.json());

        if (!students.success)
          return reply.code(400).send({ message: students.message });

        params.append("personId", students.data[0].Id);
        params.append("isEditable", true);
        params.append("group", { property: "ComponentId", direction: "ASC" });

        const url = await fetch(`https://${domain}/reportcard/GetUrl`, {
          method: "POST",
          body: params,
          headers: { cookie },
        }).then((res) => res.json());

        await fetch(url.data, {
          headers: { cookie },
        });

        const grades = await fetch(
          `https://${domain}/ReportCardByStudent/GetData`,
          {
            method: "POST",
            body: params,
            headers: { cookie },
          }
        ).then((res) => res.json());
        if (!grades.success)
          return reply.code(400).send({ message: grades.message });
        grades.data = grades.data.filter(
          (grade) =>
            grade.IsNotChosen &&
            grade.ComponentName === "Инвариантный компонент"
        );

        reply.code(200).send(grades);
      } catch (err) {
        console.log(err);
        reply.code(500).send({ message: "Что-то пошло не так!" });
      }
    }
  );
}

const yearsAPI = async (cookie, domain) => {
  return await fetch(`https://${domain}/Ref/GetSchoolYears`, {
    method: "POST",
    headers: { cookie },
  }).then(async (res) => {
    const sessionExpiredText = await res.text();
    if (!sessionExpiredText.includes("{")) return sessionExpiredText;
    return JSON.parse(sessionExpiredText);
  });
};

const orgsAPI = async (cookie, domain) => {
  return await fetch(`https://${domain}/reportcard/GetOrganizations`, {
    method: "POST",
    headers: { cookie },
  }).then(async (res) => {
    const sessionExpiredText = await res.text();
    if (!sessionExpiredText.includes("{")) return sessionExpiredText;
    return JSON.parse(sessionExpiredText);
  });
};
