import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

const Database = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("DATABASE Already Connected");
  }

  //   --------------------------------------------

  try {
    const db = await mongoose.connect(process.env.DATABASE_URI! || "");

    connection.isConnected = db.connections[0].readyState;

    console.log("DATABASE Connected Successfully");
  } catch (error) {
    console.log("DATABASE Connection Failed");
    process.exit(1);
  }
};

export default Database;
