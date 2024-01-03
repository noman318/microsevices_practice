import { Request, Response, Express } from "express";
import * as express from "express";

import * as cors from "cors";
import { createConnection } from "typeorm";
import { Product } from "./entity/Product";

const PORT = 8000;

createConnection()
  .then((db) => {
    const app: Express = express();

    const productRepository = db.getRepository(Product);

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

    app.get("/", (req: Request, res: Response): void => {
      res.status(200).json({ message: "Root Route Working Of MYSQL" });
    });

    app.get("/api/products", async (req: Request, res: Response) => {
      const allProducts = await productRepository.find();
      return res.json(allProducts);
    });

    app.post("/api/products", async (req: Request, res: Response) => {
      // console.log("req.body", req.body);
      const product = await productRepository.create(req.body);
      // console.log("product", product);
      const result = await productRepository.save(product);
      // console.log("result", result);

      return res.send(result);
    });

    app.get("/api/products/:id", async (req, res) => {
      // console.log("id", id);
      try {
        const product = await productRepository.findOneBy({
          id: parseInt(req.params.id, 10),
        });
        if (!product)
          return res.json({ message: "No Product with given ID found" });
        return res.json(product);
      } catch (error) {
        console.log("error", error);
        return error.message;
      }
    });

    app.put("/api/products/:id", async (req, res) => {
      try {
        const product = await productRepository.findOneBy({
          id: parseInt(req.params.id, 10),
        });
        if (!product)
          return res.json({ message: "No Product with given ID found" });

        const updatedData = await productRepository.merge(product, req.body);
        // console.log("updatedData", updatedData);
        const result = await productRepository.save(updatedData);

        return res.json(result);
      } catch (error) {
        console.log("error", error);
        return error.message;
      }
    });

    app.delete("/api/products/:id", async (req, res) => {
      try {
        const product = await productRepository.findOneBy({
          id: parseInt(req.params.id, 10),
        });
        if (!product)
          return res.json({ message: "No Product with given ID found" });
        const deletedProduct = await productRepository.delete(req.params.id);
        return res.json(deletedProduct);
      } catch (error) {
        console.log("error", error);
        return error.message;
      }
    });

    app.post("/api/products/:id/like", async (req, res) => {
      try {
        const product = await productRepository.findOneBy({
          id: parseInt(req.params.id, 10),
        });
        if (!product)
          return res.json({ message: "No Product with given ID found" });
        product.likes++;
        const result = await productRepository.save(product);

        return res.json(result);
      } catch (error) {
        console.log("error", error);
        return error.message;
      }
    });

    app.listen(PORT, () => {
      console.log(`Listening to PORT of ${PORT}`);
    });
  })
  .catch((err) => console.log("ERROR: ", err));
