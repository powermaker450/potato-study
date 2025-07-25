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

import { Router } from "express";
import { Authentication } from "../middlewares";
import { DB } from "../../util";

const route = "/me";
const me = Router();

me.get(route, Authentication);
me.get(route, async (req, res) => {
  const user = await DB.user.findFirstOrThrow({
    where: { email: req.jwtData!.email },
  });

  res.json({
    id: user.id,
    email: user.email,
    username: user.username,
  });
});

export default me;
