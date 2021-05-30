import fetch from "node-fetch";

export default async function(fastify) {
  fastify.get("/", async (req, reply) => {
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

      if (!schoolYears.success)
        return reply.code(400).send({ message: schoolYears.message });
      const actualYear = schoolYears.data.find((year) => year.Data.IsActual);

      params.append("schoolYearId", actualYear.Id);

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

      const students = await fetch(`https://${domain}/reportcard/GetStudents`, {
        method: "POST",
        body: params,
        headers: { cookie },
      }).then((res) => res.json());

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

      reply.code(200).send(grades);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ message: "Что-то пошло не так!" });
    }
  });
}

const yearsAPI = async (cookie, domain) => {
  return await fetch(`https://${domain}/Ref/GetSchoolYears`, {
    method: "POST",
    headers: { cookie },
  }).then((res) => res.json());
};

const orgsAPI = async (cookie, domain) => {
  return await fetch(`https://${domain}/reportcard/GetOrganizations`, {
    method: "POST",
    headers: { cookie },
  }).then((res) => res.json());
};
