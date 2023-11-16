import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "db_expenses",
  process.env.DB_USER as string,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: require("mysql2"),
    dialectOptions:
      process.env.SERVER_ENV !== "development"
        ? {
            ssl: {
              rejectUnauthorized: true,
            },
          }
        : {},
  }
);

module.exports = sequelize;
