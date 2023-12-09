import pkg from "express";
import { StatusCodes } from "http-status-codes";

import createPool from "../Utils/database.js";

const { Request, Response } = pkg;

//########## CRUD ###########//

// Obtener playlists
export async function getPlaylists(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const result = await connection.execute(`
    SELECT
  P.CODIGO_PLAYLIST,
  P.NOMBRE_PLAYLIST,
  U.CODIGO_USUARIO,
  U.CODIGO_PERSONA,
  PR.NOMBRE,
  PR.APELLIDO
FROM
  SYS.TBL_PLAYLISTS P
JOIN
  SYS.TBL_BIBLIOTECA B ON P.CODIGO_PLAYLIST = B.CODIGO_PLAYLIST
JOIN
  SYS.TBL_USUARIOS U ON B.CODIGO_USUARIO = U.CODIGO_USUARIO
JOIN
  SYS.TBL_PERSONAS PR ON U.CODIGO_PERSONA = PR.CODIGO_PERSONA

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

// Obtener playlist por id
export async function getPlaylistById(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const result = await connection.execute(
      `
      SELECT
  P.CODIGO_PLAYLIST,
  P.NOMBRE_PLAYLIST,
  U.CODIGO_USUARIO,
  U.CODIGO_PERSONA,
  PR.NOMBRE,
  PR.APELLIDO
FROM
    SYS.TBL_PLAYLISTS P
JOIN
    SYS.TBL_BIBLIOTECA B ON P.CODIGO_PLAYLIST = B.CODIGO_PLAYLIST
JOIN
    SYS.TBL_USUARIOS U ON B.CODIGO_USUARIO = U.CODIGO_USUARIO
JOIN
    SYS.TBL_PERSONAS PR ON U.CODIGO_PERSONA = PR.CODIGO_PERSONA
WHERE
    P.CODIGO_PLAYLIST = :id
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

//Crear playlist
export async function createPlaylist(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { nombre } = req.body;
    const result = await connection.execute(
      `
      INSERT INTO SYS.TBL_PLAYLISTS
      (NOMBRE_PLAYLIST)
      VALUES
      (:nombre)
      `,
      [nombre]
    );

    res.json({ message: "Playlist creada" });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al crear el usuario" });
  } finally {
    await connection.close();
  }
}

// Actualizar playlist
export async function updatePlaylist(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const result = await connection.execute(
      `
      UPDATE SYS.TBL_PLAYLISTS
      SET NOMBRE_PLAYLIST = :nombre
      WHERE CODIGO_PLAYLIST = :id
      `,
      [nombre, id]
    );

    res.json({ message: "Playlist actualizada" });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  } finally {
    await connection.close();
  }
}

// Eliminar playlist
export async function deletePlaylist(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const result = await connection.execute(
      `
      DELETE FROM SYS.TBL_PLAYLISTS
      WHERE CODIGO_PLAYLIST = :id
      `,
      [id]
    );

    res.json({ message: "Playlist eliminada" });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  } finally {
    await connection.close();
  }
}

//Anadir cancion a playlist
export async function addSongToPlaylist(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id} = req.params;
    const { idCancion} = req.body;
    const result = await connection.execute(
      `
INSERT INTO SYS.TBL_CANCIONES_PLAYLIST (CODIGO_CANCION, CODIGO_PLAYLIST) 
VALUES (:idCancion, :id)
      `, [idCancion, id]);
    res.json({ message: "Cancion agregada" });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ error: "Error al anadir la cancion" });
  } finally {
    await connection.close();
  }
}

//Eliminar cancion de playlist
export async function deleteSongFromPlaylist(req, res) {
  const pool = await createPool();
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;
    const { idCancion } = req.body;
    const result = await connection.execute(
      `
DELETE FROM SYS.TBL_CANCIONES_PLAYLIST
WHERE CODIGO_CANCION = :idCancion AND CODIGO_PLAYLIST = :id
        `, [idCancion, id]);
        res.json({ message: "Cancion eliminada de Playlist" });
    } catch (error) {
        console.error("Error al ejecutar la consulta:", error);
        res.status(500).json({ error: "Error al borrar cancion" });
        }
        finally {
            await connection.close();
        }
}


export default {
    getPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    deleteSongFromPlaylist
};
