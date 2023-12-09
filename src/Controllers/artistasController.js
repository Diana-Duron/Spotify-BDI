import pkg from "express";
import { StatusCodes } from "http-status-codes";

import createPool from "../Utils/database.js";

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener todos los artistas
export async function getArtistas(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(`
    SELECT
        SYS.TBL_ARTISTAS.CODIGO_ARTISTA,
        SYS.TBL_PERSONAS.NOMBRE,
        SYS.TBL_PERSONAS.APELLIDO,
        SYS.TBL_ARTISTAS.NOMBRE_ARTISTICO
    FROM
        SYS.TBL_ARTISTAS
    INNER JOIN
        SYS.TBL_PERSONAS ON SYS.TBL_ARTISTAS.CODIGO_PERSONA = SYS.TBL_PERSONAS.CODIGO_PERSONA
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

// Obtener un artista por su codigo
export async function getArtista(req, res) {
  const { id } = req.params;
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `
      SELECT
          SYS.TBL_ARTISTAS.CODIGO_ARTISTA,
          SYS.TBL_PERSONAS.NOMBRE,
          SYS.TBL_PERSONAS.APELLIDO,
          SYS.TBL_ARTISTAS.NOMBRE_ARTISTICO
      FROM
          SYS.TBL_ARTISTAS
      INNER JOIN
          SYS.TBL_PERSONAS ON SYS.TBL_ARTISTAS.CODIGO_PERSONA = SYS.TBL_PERSONAS.CODIGO_PERSONA
      WHERE
          SYS.TBL_ARTISTAS.CODIGO_ARTISTA = :id
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
  } finally {
    await connection.close();
  }
}

// Albumes de un artista
export async function getAlbumesArtista(req, res) {
  const { id } = req.params;
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `
      SELECT
          SYS.TBL_ALBUMES.CODIGO_ALBUM,
          SYS.TBL_ALBUMES.NOMBRE_ALBUM,
          SYS.TBL_ALBUMES.FECHA_PUBLICACION,
          SYS.TBL_ALBUMES.CODIGO_ARTISTA,
          SYS.TBL_ARTISTAS.NOMBRE_ARTISTICO
      FROM
          SYS.TBL_ALBUMES
      INNER JOIN
          SYS.TBL_ARTISTAS ON SYS.TBL_ALBUMES.CODIGO_ARTISTA = SYS.TBL_ARTISTAS.CODIGO_ARTISTA
      WHERE
          SYS.TBL_ARTISTAS.CODIGO_ARTISTA = :id
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
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  } finally {
    await connection.close();
  }
}

// Obtener canciones de todos los albumes de un artista
export async function getCancionesArtista(req, res) {
  const { id } = req.params;
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(
      `
      SELECT
          SYS.TBL_CANCIONES.CODIGO_CANCION,
          SYS.TBL_CANCIONES.NOMBRE_CANCION,
          EXTRACT(DAY FROM SYS.TBL_CANCIONES.DURACION) * 24 * 60 * 60
          + EXTRACT(HOUR FROM SYS.TBL_CANCIONES.DURACION) * 60 * 60
          + EXTRACT(MINUTE FROM SYS.TBL_CANCIONES.DURACION) * 60
          + EXTRACT(SECOND FROM SYS.TBL_CANCIONES.DURACION) AS DURACION,
          SYS.TBL_CANCIONES.CODIGO_ALBUM,
          SYS.TBL_ALBUMES.NOMBRE_ALBUM,
          SYS.TBL_ARTISTAS.NOMBRE_ARTISTICO
      FROM
          SYS.TBL_CANCIONES
      INNER JOIN
          SYS.TBL_ALBUMES ON SYS.TBL_CANCIONES.CODIGO_ALBUM = SYS.TBL_ALBUMES.CODIGO_ALBUM
      INNER JOIN
          SYS.TBL_ARTISTAS ON SYS.TBL_ALBUMES.CODIGO_ARTISTA = SYS.TBL_ARTISTAS.CODIGO_ARTISTA
      WHERE
          SYS.TBL_ARTISTAS.CODIGO_ARTISTA = :id
      `,
      { id }
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
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al obtener el usuario" });
  } finally {
    await connection.close();
  }
}

export default {
  getArtistas,
    getArtista,
    getAlbumesArtista,
    getCancionesArtista,
};
