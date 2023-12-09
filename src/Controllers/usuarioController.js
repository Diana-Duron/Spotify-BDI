import pkg from 'express';
import { StatusCodes } from 'http-status-codes';

import createPool from '../Utils/database.js';

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener todos los usuarios
export async function getUsuarios(req, res) {
    const pool = await createPool();
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute("SELECT U.CODIGO_USUARIO, P.NOMBRE, P.APELLIDO, P.CORREO, P.FECHA_NACIMIENTO FROM SYS.TBL_USUARIOS U INNER JOIN SYS.TBL_PERSONAS P ON U.CODIGO_PERSONA = P.CODIGO_PERSONA");
        const metaData = result.metaData;
        const rows = result.rows;

        // Mapear las filas y agregar los nombres de las columnas
        const formattedResult = rows.map(row => {
            const formattedRow = {};
            metaData.forEach((column, index) => {
                formattedRow[column.name] = row[index];
            });
            return formattedRow;
        });

        res.json(formattedResult);
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    } finally {
        await connection.close();
    }
}

// Obtener un usuario
export async function getUsuario(req, res) {
    const { id } = req.params;
    const pool = await createPool();
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute("SELECT U.CODIGO_USUARIO, P.NOMBRE, P.APELLIDO, P.CORREO, P.FECHA_NACIMIENTO FROM SYS.TBL_USUARIOS U INNER JOIN SYS.TBL_PERSONAS P ON U.CODIGO_PERSONA = P.CODIGO_PERSONA WHERE U.CODIGO_USUARIO = :id", [id]);
        const metaData = result.metaData;
        const rows = result.rows;

        // Mapear las filas y agregar los nombres de las columnas
        const formattedResult = rows.map(row => {
            const formattedRow = {};
            metaData.forEach((column, index) => {
                formattedRow[column.name] = row[index];
            });
            return formattedRow;
        });

        res.json(formattedResult);
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error al obtener el usuario" });
    }
    finally {
        await connection.close();
    }

}

//registrar un usuario
export async function registrarUsuario(req, res) {
    const { nombre, apellido, correo, fechaNacimiento} = req.body;
    const pool = await createPool();
    const connection = await pool.getConnection();

    try {
        await connection.execute(`
        INSERT INTO SYS.TBL_PERSONAS (NOMBRE, APELLIDO, CORREO, FECHA_NACIMIENTO)
        VALUES (:nombre, :apellido, :correo, TO_DATE(:fechaNacimiento, 'YYYY-MM-DD'))
        `, [nombre, apellido, correo, fechaNacimiento]);
        res.status(201).json({ message: "Usuario registrado correctamente" });
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    } finally {
        await connection.close();
    }
}

export default {
    getUsuarios,
    getUsuario,
    registrarUsuario
}