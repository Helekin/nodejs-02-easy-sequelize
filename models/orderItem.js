import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  qty: {
    type: DataTypes.INTEGER,
  },
});

export default OrderItem;
