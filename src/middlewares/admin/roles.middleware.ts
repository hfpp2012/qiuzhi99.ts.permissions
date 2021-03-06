import { Request, Response, NextFunction } from "express";
import { FORBIDDEN } from "http-status-codes";
import HttpException from "../../exceptions/HttpException";
import { IPermissionDocument } from "../../models/Permission";

const allow = (allowed: string) => {
  const isAllowed = (permissions: string[]) =>
    permissions.indexOf(allowed) > -1;

  return (req: Request, _res: Response, next: NextFunction) => {
    if (req.currentAdmin!.isAdmin) {
      return next();
    }

    const roles = req.currentAdmin!.roles;

    if (!roles) {
      return next(new HttpException(FORBIDDEN, "Access Denied"));
    }

    if (
      roles.some(role =>
        isAllowed(
          role.permissions.map(
            (permission: IPermissionDocument) => permission.name
          )
        )
      )
    ) {
      next();
    } else {
      next(new HttpException(FORBIDDEN, "Access Denied"));
    }
  };
};

export default allow;
