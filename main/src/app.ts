import { Request, Response, Express } from "express";
import * as express from "express";
import { DataSource } from "typeorm";
import ormConfig from "../ormconfig";
import * as ampq from "amqplib/callback_api";

// console.log("ormconf", ormConfig);

import * as cors from "cors";
import { error } from "console";
import { channel } from "diagnostics_channel";
import { Product } from "./entity/Product";

const AppDataSource = new DataSource({ ...ormConfig });

AppDataSource.initialize()
  .then(() => {
    console.log("DB CONNECTED");

    ampq.connect(
      "amqps://jngooawy:ezhlKoISJl4g3KdbBVB48-TT1CS-Y6OY@gull.rmq.cloudamqp.com/jngooawy",
      (error, connection) => {
        if (error) {
          throw new Error(error);
        }
        connection.createChannel((error, channel) => {
          if (error) {
            throw new Error(error);
          }
          const app: Express = express();
          const PORT = 6000;

          channel.assertQueue("product_created", { durable: false });
          channel.assertQueue("product_updated", { durable: false });
          channel.assertQueue("product_deleted", { durable: false });
          channel.assertQueue("product_liked", { durable: false });

          app.use(
            cors({
              origin: [
                "http://localhost:3000",
                "http://localhost:8080",
                "http://localhost:4200",
              ],
            })
          );
          app.use(express.json());

          channel.consume("product_created", (message) => {
            const eventProduct: Product = JSON.parse(
              message.content.toString()
            );
            console.log(message.content.toString(), "message");
          });

          app.listen(PORT, () => {
            console.log("server run on", PORT);
          });
        });
        process.on("beforeExit", () => {
          console.log(`Closing`);
          connection.close();
        });
      }
    );
  })
  .catch((err) => console.log(err));
