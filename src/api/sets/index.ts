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
import setId from "./:setId";
import { DB } from "../../util";
import { FlashcardSet } from "@povario/potato-study.js/models";
import {
  Authentication,
  ValidateBody,
  ValidateParams,
  ValidateQuery,
} from "../middlewares";

const route = "/sets";
const sets = Router();

sets.use(ValidateQuery);
sets.use(ValidateBody);
sets.use(ValidateParams);

sets.get(route, async (req, res) => {
  let sets: { id: number; name: string; creator: number }[];
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
          OR: creators?.map(creator => ({ creator })),
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

sets.post(route, Authentication);

sets.post(route, async (req, res) => {
  const set = await req.validate!("FlashcardSetCreate");
  const { email } = req.jwtData!;
  const user = (await DB.user.findFirst({ where: { email } }))!;

  const createdSet = await DB.flashcardSet.create({
    data: {
      creator: user.id,
      name: set.name,
    },
  });

  const flashcards = await DB.flashcard.createManyAndReturn({
    data: set.flashcards.map(flashcard => ({
      ...flashcard,
      creator: user.id,
      setId: createdSet.id,
    })),
  });

  const data: FlashcardSet = {
    ...createdSet,
    flashcards,
  };

  res.status(201).json(data);
});

sets.use(route, setId);

export default sets;
