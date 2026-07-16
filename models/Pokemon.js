import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pokemon = sequelize.define('pokemon', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  hp: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  atk: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  def: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  atk_spe: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  def_spe: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

export default Pokemon;