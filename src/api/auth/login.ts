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
import { ValidateBody } from "../middlewares";
import {
  DB,
  generateToken,
  IncorrectPasswordError,
  UserNotExistError,
} from "../../util";
import bcrypt from "bcrypt";

const login = Router();
login.use(ValidateBody);

login.use("/login", async (req, res) => {
  // Assertion because we are using ValidateBody
  const { email, password } = await req.validate!("UserLogin");

  const user = await DB.user.findFirst({ where: { email } });
  if (!user) {
    throw new UserNotExistError();
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    throw new IncorrectPasswordError();
  }

  const token = generateToken({
    email: user.email,
    username: user.username,
  });

  res.json({ token });
});

export default login;
