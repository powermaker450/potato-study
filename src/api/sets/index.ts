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
import { FlashcardSet as DBFlashcard } from "@prisma/client";
import { FlashcardSet } from "@povario/potato-study.js/models";
import { ValidateQuery } from "../middlewares";
import { Logger } from "@povario/logger";

const route = "/sets";
export const sets = Router();

sets.use(ValidateQuery);

sets.get(route, async (req, res) => {
  let sets: DBFlashcard[];
  const data: FlashcardSet[] = [];

  // If there are request parameters, check them
  if (Object.keys(req.query).length) {
    if (typeof req.query.creator === "string") {
      const { creator, name } = await req.validateQuery!(
        "FlashcardSetSingleQuery",
      );

      sets = await DB.flashcardSet.findMany({
        where: {
          creator,
          name: {
            contains: name,
          },
        },
      });
    } else {
      const { creators, name } = await req.validateQuery!(
        "FlashcardSetMultiQuery",
      );

      sets = await DB.flashcardSet.findMany({
        where: {
          name: {
            contains: name,
          },
          OR: creators?.map((creator) => ({ creator })),
        },
      });
    }
  } else {
    sets = await DB.flashcardSet.findMany();
  }

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
