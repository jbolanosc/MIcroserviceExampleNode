import express, { Request, Response } from "express";
import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Product } from "./Entity/Product";

createConnection().then((db) => {
  const productRepository = db.getRepository(Product);

  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:4200",
      ],
    })
  );

  //Routes
  app.get("/api/products/", async (req: Request, res: Response) => {
    const products = await productRepository.find();

    return res.send(products);
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    const product = await productRepository.create(req.body);
    const result = await productRepository.save(product);

    return res.send(result);
  });

  app.get("/api/products/:id", async (req: Request, res: Response) => {
    const product = await productRepository.findOne(req.params.id);
    return res.send(product);
  });

  app.put("/api/products/:id", async (req: Request, res: Response) => {
    const product = await productRepository.findOne(req.params.id);
    if (product) {
      productRepository.merge(product, req.body);
      const result = await productRepository.save(product);
    }
    return res.send(product);
  });

  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const product = await productRepository.findOne(req.params.id);
    if (product) {
      const result = await productRepository.delete(product);
    }
    return res.send(product);
  });

  app.listen(8000, () => {
    console.log("Console listening in port 8000");
  });

  process.on("beforeExit", () => {
    console.log("closing");
    //connection.close();
  });
});
