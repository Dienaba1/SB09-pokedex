import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Team = sequelize.define('team', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      }
    });
    export default Team;
