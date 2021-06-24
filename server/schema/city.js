import fp from "fastify-plugin";

export default fp(async function plugin(fastify) {
  fastify.addSchema({
    $id: "city",
    type: "string",
    pattern:
      "^(sms.akt.nis.edu.kz|sms.akb.nis.edu.kz|sms.fmalm.nis.edu.kz|sms.hbalm.nis.edu.kz|sms.ast.nis.edu.kz|sms.atr.nis.edu.kz|sms.krg.nis.edu.kz|sms.kt.nis.edu.kz|sms.kst.nis.edu.kz|sms.kzl.nis.edu.kz|sms.pvl.nis.edu.kz|sms.ptr.nis.edu.kz|sms.sm.nis.edu.kz|sms.tk.nis.edu.kz|sms.trz.nis.edu.kz|sms.ura.nis.edu.kz|sms.ukk.nis.edu.kz|sms.fmsh.nis.edu.kz|sms.hbsh.nis.edu.kz)$",
  });
});
