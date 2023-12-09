import pkg from "express";
import { StatusCodes } from "http-status-codes";

import createPool from "../Utils/database.js";

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener playlists
export async function getPodcasts(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(`
    SELECT
  P.CODIGO_PODCAST,
  P.NOMBRE_PODCAST,
  PE.NOMBRE AS NOMBRE_PERSONA,
  PE.APELLIDO AS APELLIDO_PERSONA
FROM
  SYS.TBL_PODCASTS P
JOIN
  SYS.TBL_PODCASTERS PC ON P.CODIGO_PODCASTER = PC.CODIGO_PODCASTER
JOIN
  SYS.TBL_PERSONAS PE ON PC.CODIGO_PERSONA = PE.CODIGO_PERSONA
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

//obtener un podcast
export async function getPodcast(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const result = await connection.execute(
      `
    SELECT
  P.CODIGO_PODCAST,
  P.NOMBRE_PODCAST,
  PE.NOMBRE AS NOMBRE_PERSONA,
  PE.APELLIDO AS APELLIDO_PERSONA
FROM
    SYS.TBL_PODCASTS P
JOIN
    SYS.TBL_PODCASTERS PC ON P.CODIGO_PODCASTER = PC.CODIGO_PODCASTER
JOIN
    SYS.TBL_PERSONAS PE ON PC.CODIGO_PERSONA = PE.CODIGO_PERSONA
WHERE
    P.CODIGO_PODCAST = :id
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

    res.json(formattedResult[0]);
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
}

export default {
    getPodcasts,
    getPodcast
};
