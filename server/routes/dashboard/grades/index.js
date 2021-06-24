export default async function(fastify) {
  fastify.get(
    "",
    {
      schema: {
        querystring: fastify.getSchema("domain"),
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
    },
    async (req, reply) => {
      const domain = req.query.city;
      const params = new URLSearchParams();
      const cookie = Object.entries(req.cookies)
        .map((cookie) => cookie.join("="))
        .join("; ");

      const [schoolYears, organization] = await Promise.all([
        fastify.api({
          method: "POST",
          cookie,
          url: `https://${domain}/Ref/GetSchoolYears`,
        }),
        fastify.api({
          method: "POST",
          cookie,
          url: `https://${domain}/Ref/GetOrganizations`,
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
        url: `https://${domain}/reportcard/GetParallels`,
      });

      params.append("parallelId", parallels.data[0].Id);

      const klasses = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `https://${domain}/reportcard/GetKlasses`,
      });

      params.append("klassId", klasses.data[0].Id);

      const students = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `https://${domain}/reportcard/GetStudents`,
      });

      params.append("personId", students.data[0].Id);
      params.append("isEditable", true);
      params.append("group", { property: "ComponentId", direction: "ASC" });

      const { data: url } = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `https://${domain}/reportcard/GetUrl`,
      });

      await fastify.api({
        cookie,
        url,
      });

      const grades = await fastify.api({
        method: "POST",
        body: params,
        cookie,
        url: `https://${domain}/ReportCardByStudent/GetData`,
      });

      grades.data = grades.data.filter(
        (grade) =>
          grade.IsNotChosen && grade.ComponentName === "Инвариантный компонент"
      );

      reply.code(200).send(grades);
    }
  );
}