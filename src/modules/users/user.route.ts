import { Router } from "express";
import { userControllers } from "./user.controller";
import { pool } from "../../config/db";
import { Request, Response } from "express";

const router = Router();

// admin_access_only middleware needed
router.get("/", userControllers.findAll);

// admin_access_only middleware needed
router.delete("/:userId", async (req: Request, res: Response) => {
  const uid = req.params.userId;
  const result = await pool.query(
    `
        DELETE FROM users WHERE id=$1
        `,
    [uid],
  );

  try {
    if (!result.rowCount) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const userRoutes = router;
