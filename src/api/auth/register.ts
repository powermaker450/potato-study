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
  EmailExistsError,
  generateToken,
  REGISTRATION_DISABLED,
  RegistrationDisabledError,
  UsernameExistsError,
} from "../../util";
import bcrypt from "bcrypt";

const register = Router();
register.use(ValidateBody);

register.post("/register", async (req, res) => {
  const {
    username,
    email,
    password: unhashed,
  } = await req.validate!("UserRegister");

  if (REGISTRATION_DISABLED) {
    throw new RegistrationDisabledError();
  }

  const [emailExists, usernameExists] = await Promise.all([
    await DB.user.findFirst({ where: { email } }),
    await DB.user.findFirst({ where: { username } }),
  ]);

  if (emailExists) {
    throw new EmailExistsError();
  }

  if (usernameExists) {
    throw new UsernameExistsError();
  }

  const password = await bcrypt.hash(unhashed, 10);
  await DB.user.create({
    data: { username, email, password },
  });

  const token = generateToken({ email, username });
  res.status(201).json({ token });
});

export default register;
