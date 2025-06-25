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

import * as params from "../../util/models";
import { NextFunction, Request, Response } from "express";
import type { ParamValidator, ParamValidatorReturnType } from "../../custom";

export function ValidateParams(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  req.validateParams = async function <
    V extends ParamValidator,
    R extends ParamValidatorReturnType<V>,
  >(validator: V): Promise<R> {
    return await params[validator].validate(this.params,  {
      abortEarly: false,
    }) as R;
  }

  next();
}
