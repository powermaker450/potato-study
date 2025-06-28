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

import schema from "@povario/potato-study.js/schema";
import * as params from "./util/params";
import * as queries from "./util/query";
import type { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export type BodyValidator = keyof typeof schema;
export type BodyValidatorReturnType<V extends Validator> = ReturnType<
  (typeof schema)[V]["validate"]
>;

export type ParamValidator = keyof typeof params;
export type ParamValidatorReturnType<V extends ParamValidator> = ReturnType<
  (typeof params)[V]["validate"]
>;

export type QueryValidator = keyof typeof queries;
export type QueryValidatorReturnType<V extends QueryValidator> = ReturnType<
  (typeof queries)[V]["validate"]
>;

export interface JwtData extends JwtPayload {
  email: string;
  username: string;
}

export type MiddlewareFunction<T = void> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => T;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;

      SECRET_KEY?: string;
      REGISTRATION_DISABLED?: string;
    }
  }

  namespace Express {
    interface Request {
      validate?: <
        V extends BodyValidator,
        R extends BodyValidatorReturnType<V>,
      >(
        validator: V,
      ) => Promise<R>;

      validateParams?: <
        V extends ParamValidator,
        R extends ParamValidatorReturnType<V>,
      >(
        validator: V,
      ) => Promise<R>;

      validateQuery?: <
        V extends QueryValidator,
        R extends QueryValidatorReturnType<V>,
      >(
        validator: V,
      ) => Promise<R>;

      jwtData?: JwtData;
    }

    interface Response {
      json: (body: object) => Response<any, Record<string, any>>;
    }
  }
}
