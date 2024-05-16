import { Router } from "express";
import {
  capturePayment,
  createPayment,
  cancelPayment,
} from "../controllers/payment.controllers.js";

// Inicializamos el enrutador con el Router que importamos de Express.
const router = Router();

// Creamos las rutas para el pago.
router.post("/create-payment", createPayment);
router.get("/payment-success", capturePayment);
router.get("/payment-cancel", cancelPayment);

export default router;
