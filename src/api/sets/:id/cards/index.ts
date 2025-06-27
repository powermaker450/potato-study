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
import { ValidateParams } from "../../../middlewares";
import { Flashcard } from "@povario/potato-study.js/models";
import { DB, NotFoundError } from "../../../../util";
import { id } from "./:id";

const route = "/cards";
export const cards = Router({ mergeParams: true });

cards.use(ValidateParams);

cards.get(route, async (req, res) => {
  const { setId } = await req.validateParams!("SetId");

  const set = await DB.flashcardSet.findFirst({ where: { id: setId } });

  if (!set) {
    throw new NotFoundError();
  }

  const flashcards: Flashcard[] = await DB.flashcard.findMany({
    where: { setId },
  });
  res.json(flashcards);
});

cards.use(route, id);
