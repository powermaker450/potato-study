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
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT);
const REGISTRATION_DISABLED = process.env.REGISTRATION_DISABLED === "true";
const { SECRET_KEY } = process.env;

if (!SECRET_KEY || SECRET_KEY.length < 32) {
  Logger.error(
    "A SECRET_KEY must be provided and at least 32 characters in length.",
  );
  process.exit(1);
}

export { PORT, SECRET_KEY, REGISTRATION_DISABLED };
