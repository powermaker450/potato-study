/*
 * potato-study: study and memorize with games and flashcards
 * copyright (c) 2025 povario
 *
 * this program is free software: you can redistribute it and/or modify
 * it under the terms of the gnu affero general public license as published
 * by the free software foundation, either version 3 of the license, or
 * (at your option) any later version.
 *
 * this program is distributed in the hope that it will be useful,
 * but without any warranty; without even the implied warranty of
 * merchantability or fitness for a particular purpose.  see the
 * gnu affero general public license for more details.
 *
 * you should have received a copy of the gnu affero general public license
 * along with this program.  if not, see <https://www.gnu.org/licenses/>.
 */

import { NextFunction, Request, Response } from "express";
import { BodyNotJsonError } from "../../util";

export function VerifyJson(
  req: Request,
  _: Response,
  next: NextFunction,
): void {
  if (
    req.headers["content-type"] &&
    req.headers["content-type"] !== "application/json"
  ) {
    throw new BodyNotJsonError();
  }

  req.headers["content-type"] = "application/json";
  next();
}
