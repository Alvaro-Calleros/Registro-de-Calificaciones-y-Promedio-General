import fs from "fs";

function readJSON(path) {
    try {
        return JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (e) {
        return [];
    }
}

function writeJSON(path, data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}

// --- Classes ---
class Alumno {
    constructor(nombre, apellido, calificaciones = [], grupo = null) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.calificaciones = calificaciones;
        this.grupo = grupo;
    }

    calcularPromedio() {
        if (!Array.isArray(this.calificaciones) || this.calificaciones.length === 0) return 0;
        const cortes = this.calificaciones.slice(0, 3);
        const suma = cortes.reduce((a, b) => a + (Number(b) || 0), 0);
        return Math.round((suma / cortes.length) * 100) / 100;
    }

    estaAprobado() {
        return this.calcularPromedio() >= 70;
    }
}

class Grupo {
    constructor(numero, alumnos = []) {
        this.numero = numero;
        this.alumnos = alumnos.map(
            (a) => new Alumno(a.nombre, a.apellido, a.calificaciones || [], a.grupo ?? numero)
        );
    }

    agregarAlumno(alumno) {
        this.alumnos.push(alumno);
    }

    promedioGrupo() {
        if (this.alumnos.length === 0) return 0;
        const suma = this.alumnos.reduce((sum, a) => sum + a.calcularPromedio(), 0);
        return Math.round((suma / this.alumnos.length) * 100) / 100;
    }

    alumnosAprobados() {
        return this.alumnos.filter((a) => a.estaAprobado());
    }   

    alumnosReprobados() {
        return this.alumnos.filter((a) => !a.estaAprobado());
    }
}

const dataPaths = {
    alumnos: "./alumnos.json",
    grupos: "./grupos.json",
};

function loadData() {
    const alumnosRaw = readJSON(dataPaths.alumnos);
    const gruposRaw = readJSON(dataPaths.grupos);
    const grupos = (gruposRaw || []).map((g) => new Grupo(g.numero, g.alumnos || []));
    return { alumnos: alumnosRaw || [], grupos };
}

function saveData(grupos) {
    const plain = grupos.map((g) => ({
        numero: g.numero,
        alumnos: g.alumnos.map((a) => ({
            nombre: a.nombre,
            apellido: a.apellido,
            calificaciones: a.calificaciones,
            grupo: a.grupo,
        })),
    }));
    writeJSON(dataPaths.grupos, plain);
}

export { Alumno, Grupo, loadData, saveData };
