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
import { Authentication, ValidateBody } from "../middlewares";
import { DB } from "../../util";

const route = "/create";
const create = Router();

create.use(Authentication);
create.use(ValidateBody);

create.post(route, async (req, res) => {
  const set = await req.validate!("FlashcardSetCreate");
  const { username } = req.jwtData!;
  const user = (await DB.user.findFirst({ where: { username } }))!;

  const createdSet = await DB.flashcardSet.create({
    data: {
      creator: user.id,
      name: set.name
    }
  });

  const mappedCards = set.flashcards.map(flashcard => {
    return {
      ...flashcard,
      creator: user.id,
      setId: createdSet.id 
    }
  });

  const createdCards = await DB.flashcard.createManyAndReturn({
    data: mappedCards
  });

  res.json({
    ...createdSet,
    flashcards: createdCards
  });
});

export default create;
