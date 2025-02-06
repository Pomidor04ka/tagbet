const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = "super_secret";
const USERS_FILE = "users.json";
const BETS_FILE = "bets.json";

// Загрузка данных
let users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE, "utf8")) : {};
let bets = fs.existsSync(BETS_FILE) ? JSON.parse(fs.readFileSync(BETS_FILE, "utf8")) : {};

// Функции сохранения
function saveUsers() { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); }
function saveBets() { fs.writeFileSync(BETS_FILE, JSON.stringify(bets, null, 2)); }

// Функция расчёта коэффициентов
function calculateOdds() {
    let totalBets = Object.values(bets).reduce((sum, teamBets) => sum + Object.values(teamBets).reduce((a, b) => a + b, 0), 0);
    let odds = {};
    for (let team in bets) {
        let teamTotal = Object.values(bets[team] || {}).reduce((a, b) => a + b, 0);
        odds[team] = teamTotal > 0 ? (totalBets / teamTotal) : 1;
    }
    return odds;
}

// Получение коэффициентов
app.get("/api/odds", (req, res) => {
    res.json(calculateOdds());
});

// Экспортируем обработчик для Vercel
module.exports = app;
