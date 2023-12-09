import pkg from 'express';
import { StatusCodes } from 'http-status-codes';

import createPool from '../Utils/database.js';

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener todos los usuarios
export async function getPodcasters(req, res) {
    const pool = await createPool();
    const connection = await pool.getConnection();

    try {
        const result = await connection.execute(`
        SELECT
            SYS.TBL_PODCASTERS.CODIGO_PODCASTER,
            SYS.TBL_PODCASTERS.CODIGO_PERSONA,
            SYS.TBL_PERSONAS.NOMBRE,
            SYS.TBL_PERSONAS.APELLIDO,
            FROM
            SYS.TBL_PODCASTERS
            INNER JOIN
            SYS.TBL_PERSONAS ON SYS.TBL_PODCASTERS.CODIGO_PERSONA = SYS.TBL_PERSONAS.CODIGO_PERSONA;

        `);
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
        res.status(500).json({ error: "Error al obtener los podcasters" });
    } finally {
        await connection.close();
    }
}

export default {
    getPodcasters
}