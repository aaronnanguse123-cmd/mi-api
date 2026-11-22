import { Elysia, t } from "elysia";
import { prisma } from "./lib/prisma";

const app = new Elysia()
  .get("/", () => "¡Mi API funciona! 🎉")

  // GET: ver todas las tareas
  .get("/tareas", () => prisma.tarea.findMany())

  // GET: ver UNA tarea
  .get(
    "/tareas/:id",
    async ({ params, status }) => {
      const tarea = await prisma.tarea.findUnique({ where: { id: params.id } });
      if (!tarea) return status(404, { error: "Esa tarea no existe" });
      return tarea;
    },
    { params: t.Object({ id: t.Numeric() }) }
  )

  // POST: crear una tarea
  .post("/tareas", ({ body }) => prisma.tarea.create({ data: body }), {
    body: t.Object({ titulo: t.String({ minLength: 1 }) }),
  })

  // PUT: cambiar una tarea
  .put(
    "/tareas/:id",
    ({ params, body }) =>
      prisma.tarea.update({ where: { id: params.id }, data: body }),
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Object({
        titulo: t.Optional(t.String({ minLength: 1 })),
        completada: t.Optional(t.Boolean()),
      }),
    }
  )

  // DELETE: borrar una tarea
  .delete(
    "/tareas/:id",
    ({ params }) => prisma.tarea.delete({ where: { id: params.id } }),
    { params: t.Object({ id: t.Numeric() }) }
  )

  .listen(3000);

console.log(`🦊 API lista en http://localhost:${app.server?.port}`);