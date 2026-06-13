import express from "express";
import path from "path";
import { z } from "zod";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Order Validation Schema
  const OrderSchema = z.object({
    items: z.array(z.object({
      id: z.string(),
      variant: z.object({
        sku: z.string(),
        color: z.string(),
        size: z.string()
      }),
      quantity: z.number().min(1),
      price: z.number()
    })).min(1),
    shippingDetails: z.object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(10),
      address: z.string().min(5),
      city: z.string(),
      area: z.string().optional(),
    }),
    paymentMethod: z.enum(["cod", "esewa", "khalti"]),
    total: z.number()
  });

  // API for orders
  const orders: any[] = [];
  
  app.post("/api/orders", (req, res) => {
    try {
      const orderData = OrderSchema.parse(req.body);
      const order = {
        id: `AB-${Math.floor(Math.random() * 1000000)}`,
        ...orderData,
        status: "pending",
        createdAt: new Date(),
      };
      
      orders.push(order);
      console.log("New Order Received:", order);

      // Handle specific payment methods for external redirection if needed
      if (orderData.paymentMethod === "esewa") {
        return res.status(201).json({
          ...order,
          paymentInfo: {
            url: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
            merchantCode: "EPAYTEST"
          }
        });
      }

      res.status(201).json(order);
    } catch (error) {
       if (error instanceof z.ZodError) {
         return res.status(400).json({ error: "Validation failed", details: error.issues });
       }
       res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Arlo Boudha Backend running on http://localhost:${PORT}`);
  });
}

startServer();
