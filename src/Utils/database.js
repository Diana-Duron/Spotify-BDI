import oracledb from 'oracledb';
import dotenv from 'dotenv';

const dbConfig = {
    user: 'C##usuariospotify',
    password: '1234',
    connectString: '192.168.196.128:1521/xe',
};

let pool;

async function createPool() {
    try {
        pool = await oracledb.createPool(dbConfig);
        return pool;
    } catch (err) {
        console.error("Error al crear el pool de conexiones: ", err);
        throw err;
    }
}

process.on('SIGINT', async () => {
    try {
        await pool.close();
        console.log("Pool de conexiones cerrado");
    } catch (err) {
        console.error("Error al cerrar el pool de conexiones: ", err);
    } finally {
        process.exit(0);
    }
});

export default createPool;