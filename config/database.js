import 'dotenv/config'
import { Sequelize } from 'sequelize'
const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres'
});

export default sequelize;

try {
    // On essaie de se connecter
    await sequelize.authenticate();
    // Si ça marche, on affiche un message de succès
    console.log('Connexion réussie !');
  } catch (error) {
    // Si ça échoue, on affiche l'erreur
    console.error('Connexion échouée :', error);
  }