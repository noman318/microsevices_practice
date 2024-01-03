import { Request, Response, Express } from "express";
import * as express from "express";
import { DataSource, getRepository } from "typeorm";
import ormConfig from "../ormconfig";
import * as ampq from "amqplib/callback_api";

// console.log("ormconf", ormConfig);

import * as cors from "cors";
import { Product } from "./entity/Product";

const AppDataSource = new DataSource({ ...ormConfig });

AppDataSource.initialize()
  .then((db) => {
    console.log("DB CONNECTED");

    const productRepository = db.getRepository(Product);
    // console.log("productRepository", productRepository);
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

          channel.consume(
            "product_created",
            async (message) => {
              const eventProduct: Product = JSON.parse(
                message.content.toString()
              );
              // console.log("eventProduct", eventProduct);
              const productData = new Product();
              productData.admin_id = parseInt(eventProduct.id);
              productData.title = eventProduct.title;
              productData.image = eventProduct.image;
              productData.likes = eventProduct.likes;
              await productRepository.save(productData);
              console.log(`product created`);
            },
            { noAck: true }
          );

          channel.consume(
            "product_updated",
            async (message) => {
              const eventProduct: Product = JSON.parse(
                message.content.toString()
              );
              const product = await productRepository.findOne({
                //@ts-expect-error
                admin_id: parseInt(eventProduct.id),
              });
              console.log("product", product);
              // console.log("eventProduct", eventProduct);
              productRepository.merge(product, {
                title: eventProduct.title,
                image: eventProduct.image,
                likes: eventProduct.likes,
              });
              await productRepository.save(product);
              console.log(`product updated`);
            },
            { noAck: true }
          );

          channel.consume(
            "product_deleted",
            async (message) => {
              const admin_id = message.content.toString();
              // console.log("admin_id", admin_id);
              // @ts-expect-error
              await productRepository.delete({ admin_id });
              console.log(`product deleted`);
            },
            { noAck: true }
          );

          channel.consume(
            "product_liked",
            async (message) => {
              const admin_id = message.content.toString();
              // console.log("admin_id", admin_id);
              // @ts-expect-error
              await productRepository.delete({ admin_id });
              console.log(`product deleted`);
            },
            { noAck: true }
          );

          app.get("/api/products", async (req: Request, res: Response) => {
            const products = await productRepository.find();
            return res.send(products);
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
