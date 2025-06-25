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

import schema from "@povario/potato-study.js/schema";
import * as params from "./util/models";
import type { JwtPayload } from "jsonwebtoken";

export type BodyValidator = keyof typeof schema;
export type BodyValidatorReturnType<V extends Validator> = ReturnType<
  (typeof schema)[V]["validate"]
>;

export type ParamValidator = keyof typeof params;
export type ParamValidatorReturnType<V extends ParamValidator> = ReturnType<
  (typeof params)[V]["validate"]
>;

export interface JwtData extends JwtPayload {
  email: string;
  username: string;
}

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
      validate?: <V extends BodyValidator, R extends BodyValidatorReturnType<V>>(
        validator: V,
      ) => Promise<R>;

      validateParams?: <V extends ParamValidator, R extends ParamValidatorReturnType<V>>(
        validator: V
      ) => Promise<R>;

      jwtData?: JwtData;
    }

    interface Response {
      json: (body: object) => Response<any, Record<string, any>>;
    }
  }
}
