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

import * as models from "@povario/potato-study-types";
import * as params from "./util/models";
import type { JwtPayload } from "jsonwebtoken";

type Validator = keyof typeof models;
type ValidatorReturnType<V extends Validator> = ReturnType<
  (typeof models)[V]["validate"]
>;

type ParamValidator = keyof typeof params;
type ParamValidatorReturnType<V extends ParamValidator> = ReturnType<
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
      validate?: <V extends Validator, R extends ValidatorReturnType<V>>(
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
