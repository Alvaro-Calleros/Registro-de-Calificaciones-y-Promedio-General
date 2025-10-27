import inquirer from "inquirer";
import { Alumno, Grupo, loadData, saveData } from "./pom.js";

function parseGradeInput(value, fallback = 0) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

async function mainMenu() {
  let { alumnos, grupos } = loadData();
  let continuar = true;

  while (continuar) {
    console.clear();
    console.log("=== Sistema de Registro de Calificaciones (3 cortes) ===\n");

    const { opcion } = await inquirer.prompt([
      {
        type: "list",
        name: "opcion",
        message: "Selecciona una opción:",
        choices: [
          "1. Ver grupos y promedios (incluye promedios individuales)",
          "2. Agregar alumnos a un grupo (ingresa cuántos)",
          "3. Mostrar alumnos aprobados y reprobados",
          "4. Agregar grupo",
          "5. Salir",
        ],
      },
    ]);

    switch (opcion) {
      case "1. Ver grupos y promedios (incluye promedios individuales)":
        if (grupos.length === 0) {
          console.log("No hay grupos registrados aún.");
          break;
        }
        for (const g of grupos) {
          console.log(`\nGrupo ${g.numero} - Promedio general: ${g.promedioGrupo()}`);
          if (g.alumnos.length === 0) {
            console.log("  No hay alumnos en este grupo.");
            continue;
          }
          for (const a of g.alumnos) {
            console.log(
              `  - ${a.nombre} ${a.apellido} | cortes: ${a.calificaciones.join(
                ", "
              )} | promedio: ${a.calcularPromedio()}`
            );
          }
        }
        break;

      case "2. Agregar alumnos a un grupo (ingresa cuántos)":
        if (grupos.length === 0) {
          console.log("No hay grupos. Crea uno primero.");
          break;
        }

        const { targetGrupo, cantidad } = await inquirer.prompt([
          { name: "targetGrupo", message: "Número del grupo donde ingresarás alumnos:" },
          { name: "cantidad", message: "¿Cuántos alumnos vas a ingresar?", validate: (v) => (parseInt(v) > 0 ? true : "Ingresa un número mayor a 0") },
        ]);

        const grupo = grupos.find((g) => g.numero === parseInt(targetGrupo));
        if (!grupo) {
          console.log("Grupo no encontrado.");
          break;
        }

        const count = parseInt(cantidad);
        for (let i = 0; i < count; i++) {
          console.log(`\n--- Alumno ${i + 1} de ${count} ---`);
          const resp = await inquirer.prompt([
            { name: "nombre", message: "Nombre:" },
            { name: "apellido", message: "Apellido:" },
            { name: "c1", message: "Corte I (0-100):", validate: (v) => (!isNaN(v) && v !== "" ? true : "Ingresa un número") },
            { name: "c2", message: "Corte II (0-100):", validate: (v) => (!isNaN(v) && v !== "" ? true : "Ingresa un número") },
            { name: "c3", message: "Corte III (0-100):", validate: (v) => (!isNaN(v) && v !== "" ? true : "Ingresa un número") },
          ]);

          const califs = [
            parseGradeInput(resp.c1),
            parseGradeInput(resp.c2),
            parseGradeInput(resp.c3),
          ];

          const nuevo = new Alumno(resp.nombre, resp.apellido, califs, grupo.numero);
          grupo.agregarAlumno(nuevo);
          console.log(`Alumno ${resp.nombre} ${resp.apellido} agregado con promedio ${nuevo.calcularPromedio()}.`);
        }

        saveData(grupos);
        console.log("\nTodos los alumnos fueron guardados.");
        break;

      case "3. Mostrar alumnos aprobados y reprobados":
        if (grupos.length === 0) {
          console.log("No hay grupos registrados aún.");
          break;
        }
        for (const g of grupos) {
          const aprobados = g.alumnosAprobados();
          const reprobados = g.alumnosReprobados();
          console.log(`\nGrupo ${g.numero}`);
          console.log("  Aprobados:", aprobados.map((a) => `${a.nombre} ${a.apellido} (${a.calcularPromedio()})`).join(", ") || "ninguno");
          console.log("  Reprobados:", reprobados.map((a) => `${a.nombre} ${a.apellido} (${a.calcularPromedio()})`).join(", ") || "ninguno");
        }
        break;

      case "4. Agregar grupo":
        const { nuevoNumero } = await inquirer.prompt([{ name: "nuevoNumero", message: "Número del nuevo grupo:" }]);
        const existe = grupos.some((g) => g.numero === parseInt(nuevoNumero));
        if (existe) {
          console.log(`El grupo ${nuevoNumero} ya existe.`);
          break;
        }
        const nuevoGrupo = new Grupo(parseInt(nuevoNumero), []);
        grupos.push(nuevoGrupo);
        saveData(grupos);
        console.log(`Grupo ${nuevoNumero} agregado correctamente.`);
        break;

      case "5. Salir":
        continuar = false;
        break;
    }

    if (continuar) {
      await inquirer.prompt([{ name: "continuar", message: "\nPresiona ENTER para continuar..." }]);
    }
  }
}

mainMenu();
