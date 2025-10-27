# Proyecto: Gestión de Alumnos (JS)

Proyecto sencillo para practicar programación orientada a objetos en JavaScript y un patrón de organización de código tipo Page Object Model (POM), usando un modelo de datos local basado en archivos JSON.

## Características
- Uso de Programación Orientada a Objetos (clases `Alumno` y `Grupo`).
- Organización inspirada en Page Object Model para separar lógica y accesos a datos.
- Modelo de datos local: persistencia simple usando archivos JSON (`alumnos.json`, `grupos.json`).
- Funcionalidades básicas: cálculo de promedios, evaluación de aprobados/reprobados y manejo de grupos.

## Archivos principales
- `pom.js` — clases y lógica principal (Alumno, Grupo, carga/guardado).
- `menu.js` — interfaz de ejecución (menú/entrada).
- `alumnos.json`, `grupos.json` — datos locales (no deberían versionarse si contienen información real).
- `package.json`, `package-lock.json` — dependencias y metadatos del proyecto.

## Uso
1. Tener instalado Node.js.
2. Desde la carpeta del proyecto:
   - Instalar dependencias (si las hay): `npm install`
   - Ejecutar la aplicación: `node menu.js` (o `node pom.js` según el flujo)

## Buenas prácticas
- Ignorar los archivos de datos locales en `.gitignore` (`alumnos.json`, `grupos.json`, `package-lock.json`) para no subir información innecesaria al repositorio.
- Mantener la separación entre la lógica de negocio (clases) y el acceso a datos (lectura/escritura JSON).

## Licencia
Proyecto de ejemplo para estudios. Úsalo y modifícalo libremente.