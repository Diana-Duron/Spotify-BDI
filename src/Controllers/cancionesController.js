import pkg from "express";
import { StatusCodes } from "http-status-codes";

import createPool from "../Utils/database.js";

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener canciones
export async function getCanciones(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(`
    SELECT
  C.NOMBRE_CANCION,
  A.NOMBRE_ARTISTICO AS NOMBRE_ARTISTA,
  AL.NOMBRE_ALBUM
FROM
  SYS.TBL_CANCIONES C
INNER JOIN
  SYS.TBL_ALBUMES AL ON C.CODIGO_ALBUM = AL.CODIGO_ALBUM
INNER JOIN
  SYS.TBL_ARTISTAS A ON AL.CODIGO_ARTISTA = A.CODIGO_ARTISTA
        `);
    const metaData = result.metaData;
    const rows = result.rows;

    // Mapear las filas y agregar los nombres de las columnas
    const formattedResult = rows.map((row) => {
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

//obtener canciones por id
export async function getCancionesById(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const result = await connection.execute(
      `
    SELECT
  C.NOMBRE_CANCION,
  A.NOMBRE_ARTISTICO AS NOMBRE_ARTISTA,
  AL.NOMBRE_ALBUM
FROM
    SYS.TBL_CANCIONES C
INNER JOIN
    SYS.TBL_ALBUMES AL ON C.CODIGO_ALBUM = AL.CODIGO_ALBUM
INNER JOIN
    SYS.TBL_ARTISTAS A ON AL.CODIGO_ARTISTA = A.CODIGO_ARTISTA
WHERE
    C.CODIGO_CANCION = :id
        `,
      [id]
    );
    const metaData = result.metaData;
    const rows = result.rows;

    // Mapear las filas y agregar los nombres de las columnas
    const formattedResult = rows.map((row) => {
      const formattedRow = {};
      metaData.forEach((column, index) => {
        formattedRow[column.name] = row[index];
      });
      return formattedRow;
    });

    res.json(formattedResult);
  }
    catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error al obtener los usuarios" });
    } finally {
        await connection.close();
    }
}


export default {
    getCanciones,
    getCancionesById,
};
