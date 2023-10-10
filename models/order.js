import { DataTypes } from "sequelize";

import sequelize from "../config/db.js";

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  shippingAddress: {
    type: DataTypes.JSON,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentResult: {
    type: DataTypes.JSON,
  },
  itemsPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  taxPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  shippingPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
});

export default Order;
