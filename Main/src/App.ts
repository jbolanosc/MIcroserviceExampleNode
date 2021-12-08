import express, { Request, Response, Application } from "express";
import { createConnection } from "typeorm";
import cors from "cors";
import axios from "axios";
import { Product } from "./Entity/Product";

createConnection().then((db) => {
  const productRepository = db.getMongoRepository(Product);
  const app: Application = express();

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

  app.get("/api/products", async (req: Request, res: Response) => {
    const products = await productRepository.find();
    return res.send(products);
  });

  app.post("/api/products/:id/like", async (req: Request, res: Response) => {
    const product = await productRepository.findOne(req.params.id);
    if (product) {
      await axios.post(
        `http://localhost:8000/api/products/${product.admin_id}/like`,
        {}
      );
      product.likes++;
      await productRepository.save(product);
    }
    return res.send(product);
  });

  app.listen(process.env.PORT, () => {
    console.log("app listening on port" + process.env.PORT);
  });

  process.on("beforeClose", () => {
    console.log("closing");
    //connection.close();
  });
});
