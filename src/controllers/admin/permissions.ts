import { Request, Response } from "express";

import Permission from "../../models/Permission";

import { wrapAsync } from "../../helpers/wrap-async";
import { throwPermissionNotFoundError } from "../../utils/throwError";

/**
 * Permission list
 *
 * @Method GET
 * @URL /api/admin/permissions
 *
 */
export const index = wrapAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const permissions = await Permission.find();

    res.json({
      success: true,
      data: {
        permissions
      }
    });
  }
);

/**
 * Add permission
 *
 * @Method POST
 * @URL /api/admin/permissions
 *
 */
export const addPermission = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, nameCn } = req.body;

    const newPermission = new Permission({
      name,
      nameCn
    });

    const resPermission = await newPermission.save();

    res.json({
      success: true,
      data: {
        permission: resPermission,
        message: "created successfully"
      }
    });
  }
);

/**
 * Update permission
 *
 * @Method PUT
 * @URL /api/admin/permissions/:id
 *
 */
export const updatePermission = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { name, nameCn } = req.body;

    const { id } = req.params;

    const permission = await Permission.findById(id);

    if (permission) {
      const resPermission = await Permission.findByIdAndUpdate(
        id,
        { name, nameCn },
        { new: true }
      );

      res.json({
        success: true,
        data: {
          permission: resPermission,
          message: "updated successfully"
        }
      });
    } else {
      throwPermissionNotFoundError();
    }
  }
);

/**
 * Delete permission
 *
 * @Method DELETE
 * @URL /api/admin/permissions/:id
 *
 */
export const deletePermission = wrapAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const permission = await Permission.findById(id);

    if (permission) {
      await Permission.findByIdAndDelete(id);

      res.json({
        success: true,
        data: {
          message: "deleted successfully"
        }
      });
    } else {
      throwPermissionNotFoundError();
    }
  }
);
