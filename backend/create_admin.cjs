// backend/create_admin.js (Topo do arquivo)

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // 🚨 NOVO IMPORT

// 🚨 CORREÇÃO DE SINTAXE PARA ESM 🚨
// Obtém o diretório atual de forma segura no ambiente de módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ajuste o caminho se necessário.
import User from './models/user.model.js'; 

// 🚨 CORREÇÃO DEFINITIVA DO DOTENV 🚨
// O .env está na pasta 'backend'
dotenv.config({ path: path.resolve(__dirname, '.env') }); 
// ...