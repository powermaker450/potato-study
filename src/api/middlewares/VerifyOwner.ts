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

import { MiddlewareFunction } from "../../custom";
import { DB, NoSetAccessError } from "../../util";

export const VerifyOwner: MiddlewareFunction = async (req, _, next) => {
  const { setId } = await req.validateParams!("SetId");
  const set = await DB.flashcardSet.findFirstOrThrow({ where: { id: setId } });
  const user = await DB.user.findFirstOrThrow({
    where: { email: req.jwtData!.email },
  });

  if (user.id !== set.creator) {
    throw new NoSetAccessError();
  }

  next();
};
