/*
 * potato-study: Study and memorize with games and flashcards
 * Copyright (C) 2025 povario
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Logger } from "@povario/logger";
import { NextFunction, Request, Response } from "express";
import type { ValidationError } from "yup";
import { PotatoStudyClientError } from "../../util";

type NamedError =
  | "ValidationError"
  | "PotatoStudyClientError"
  | "JsonWebTokenError"
  | "InvalidTokenError"
  | "NotFoundError";

export function ErrorHandler(
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!err) {
    return next();
  }

  switch (err.name as NamedError) {
    case "ValidationError": {
      let error = "";
      const e = err as ValidationError;

      for (let i = 0; i < e.errors.length; i++) {
        error += i !== e.errors.length - 1 ? e.errors[i] + ", " : e.errors[i];
      }

      return void res.status(400).json({ name: err.name, error });
    }

    case "NotFoundError":
      return void res.status(404).json({ name: err.name, error: err.message });

    case "InvalidTokenError":
    case "JsonWebTokenError":
      return void res.status(401).json({ name: err.name, error: err.message });

    default:
      if (err instanceof PotatoStudyClientError) {
        return void res
          .status(400)
          .json({ name: err.name, message: err.message });
      }

      Logger.log(err);
      res.status(500).json({ name: "unknown", error: "unknown error" });
  }
}
