import fetch from "node-fetch";

export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
        response: {
          200: {
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
        tags: ["dashboard"],
      },
    },
    async (req, reply) => {
      const baseUrl = `https://sms.${req.query.city}.nis.edu.kz`;

      const params = new URLSearchParams();
      const cookie = fastify.cookieStringify(req.cookies);

      const [schoolYears, organization] = await Promise.all([
        fastify.api({
          method: "POST",
          cookie,
          url: `${baseUrl}/Ref/GetSchoolYears`,
        }),
        fastify.api({
          method: "POST",
          cookie,
          url: `${baseUrl}/reportcard/GetOrganizations`,
        }),
      ]);

      const actualYear = schoolYears.data.find((year) => year.Data.IsActual);
      params.append("schoolYearId", actualYear.Id);
      params.append("organizationId", organization.data[0].Id);
      params.append("organizationInternalId", organization.data[0].Id);

      const parallels = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetParallels`,
      });

      params.append("parallelId", parallels.data[0].Id);

      const klasses = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetKlasses`,
      });

      params.append("klassId", klasses.data[0].Id);

      const students = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetStudents`,
      });

      params.append("personId", students.data[0].Id);
      params.append("isEditable", true);
      params.append("group", { property: "ComponentId", direction: "ASC" });

      const { data: url } = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/reportcard/GetUrl`,
      });

      await fetch(url, {
        headers: { cookie },
      });

      const grades = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `${baseUrl}/ReportCardByStudent/GetData`,
      });

      reply.send(
        grades.data.filter(
          (grade) =>
            grade.IsNotChosen &&
            grade.ComponentName === "Инвариантный компонент"
        )
      );
    }
  );
}
