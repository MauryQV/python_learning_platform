-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."Rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "public"."UsuarioRol" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "fechaAsignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "public"."Curso" (
    "id_curso" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'activo',

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("id_curso")
);

-- CreateTable
CREATE TABLE "public"."Inscripcion" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activa',

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "public"."Modulo" (
    "id_modulo" SERIAL NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "public"."Topico" (
    "id_topico" SERIAL NOT NULL,
    "id_modulo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id_topico")
);

-- CreateTable
CREATE TABLE "public"."MediaAssets" (
    "id_media" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "MediaAssets_pkey" PRIMARY KEY ("id_media")
);

-- CreateTable
CREATE TABLE "public"."Ejercicio" (
    "id_ejercicio" SERIAL NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nivelDificultad" TEXT,
    "respuestaCorrecta" TEXT,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id_ejercicio")
);

-- CreateTable
CREATE TABLE "public"."Intento" (
    "id_intento" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_ejercicio" INTEGER NOT NULL,
    "fechaIntento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respuesta" TEXT,
    "resultado" TEXT,
    "puntajeObtenido" INTEGER,

    CONSTRAINT "Intento_pkey" PRIMARY KEY ("id_intento")
);

-- CreateTable
CREATE TABLE "public"."Entrega" (
    "id_entrega" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "fechaEntrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivoUrl" TEXT,
    "calificacion" INTEGER,
    "retroalimentacion" TEXT,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("id_entrega")
);

-- CreateTable
CREATE TABLE "public"."ProgresoTopico" (
    "id_progreso" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_topico" INTEGER NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'no_iniciado',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCompletado" TIMESTAMP(3),
    "porcentajeAvance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProgresoTopico_pkey" PRIMARY KEY ("id_progreso")
);

-- CreateTable
CREATE TABLE "public"."Diagnostico" (
    "id_diagnostico" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_curso" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "puntaje" INTEGER,
    "nivelRecomendado" TEXT,

    CONSTRAINT "Diagnostico_pkey" PRIMARY KEY ("id_diagnostico")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "public"."Rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inscripcion" ADD CONSTRAINT "Inscripcion_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Modulo" ADD CONSTRAINT "Modulo_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topico" ADD CONSTRAINT "Topico_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "public"."Modulo"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MediaAssets" ADD CONSTRAINT "MediaAssets_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "public"."Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ejercicio" ADD CONSTRAINT "Ejercicio_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "public"."Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intento" ADD CONSTRAINT "Intento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Intento" ADD CONSTRAINT "Intento_id_ejercicio_fkey" FOREIGN KEY ("id_ejercicio") REFERENCES "public"."Ejercicio"("id_ejercicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entrega" ADD CONSTRAINT "Entrega_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "public"."Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgresoTopico" ADD CONSTRAINT "ProgresoTopico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgresoTopico" ADD CONSTRAINT "ProgresoTopico_id_topico_fkey" FOREIGN KEY ("id_topico") REFERENCES "public"."Topico"("id_topico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnostico" ADD CONSTRAINT "Diagnostico_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnostico" ADD CONSTRAINT "Diagnostico_id_curso_fkey" FOREIGN KEY ("id_curso") REFERENCES "public"."Curso"("id_curso") ON DELETE RESTRICT ON UPDATE CASCADE;
