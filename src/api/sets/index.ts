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
import { id } from "./:id";
import create from "./create";
import { DB } from "../../util";
import { FlashcardSet } from "@povario/potato-study.js/models";

const route = "/sets";
export const sets = Router();

sets.get(route, async (_, res) => {
  const sets = await DB.flashcardSet.findMany();
  const data: FlashcardSet[] = [];

  for (const set of sets) {
    const flashcards = await DB.flashcard.findMany({
      where: { setId: set.id },
    });

    data.push({
      ...set,
      flashcards,
    });
  }

  res.json(data);
});

sets.use(route, id, create);
