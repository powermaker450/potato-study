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

import express from "express";
import { DB, PORT } from "./util";
import { Logger } from "@povario/logger";
import { api } from "./api";
import {
  ErrorHandler,
  NotFound,
  RedirectToPage,
  RequestLogger,
} from "./api/middlewares";

const app = express();
const port = Number(PORT) || 8081;
const logger = new Logger("Main");

app.use(express.json());
app.use(RedirectToPage);
app.use(api);
app.use(NotFound);
app.use(RequestLogger);
app.use(ErrorHandler);

app.listen(port, () => {
  logger.log(`Server started on http://localhost:${port}`);
});

process.on("SIGTERM", async () => {
  const forceQuit = () => {
    logger.error("Force quitting without safe shutdown of the database...");
    process.exit(1);
  };

  setTimeout(forceQuit, 10_000);

  try {
    await DB.$disconnect();
    process.exit(0);
  } catch {
    forceQuit();
  }
});
