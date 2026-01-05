import express from "express";
import { getTables, getTableById, createTable, updateTableStatus, mergeTables, splitTables, deleteTable } from "../controllers/tableController.js";
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

// Live Table Availability (Feature 1)
router.get("/", protectRoute(['staff']), getTables);
router.get("/:id",protectRoute(['staff']), getTableById);
router.post("/", protectRoute(['staff']), createTable);
router.put("/:id/status", protectRoute(['staff']), updateTableStatus);
router.post("/merge", protectRoute(['staff']), mergeTables);
router.post("/split", protectRoute(['staff']), splitTables);
router.delete("/:id", protectRoute(['staff']), deleteTable);
// Export the router

export default router;


