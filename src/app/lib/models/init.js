// src/app/lib/models/init.js
import { DataTypes } from 'sequelize';
import {sequelize} from '@/app/lib/sequelize';
import { initModels } from './index.js';

const models = initModels(sequelize, DataTypes);
export default models;
