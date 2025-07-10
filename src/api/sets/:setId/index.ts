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
import { DB } from "../../../util";
import { FlashcardSet } from "@povario/potato-study.js/models";
import cards from "./cards";
import { Authentication, VerifyOwner } from "../../middlewares";

const route = "/:setId";
const setId = Router();

setId.get(route, async (req, res) => {
  const { setId } = await req.validateParams!("SetId");
  const set = await DB.flashcardSet.findFirstOrThrow({ where: { id: setId } });
  const flashcards = await DB.flashcard.findMany({ where: { setId } });

  const data: FlashcardSet = {
    ...set,
    flashcards,
  };

  res.json(data);
});

setId.patch(route, Authentication, VerifyOwner);
setId.patch(route, async (req, res) => {
  const { setId } = await req.validateParams!("SetId");
  const { name } = await req.validate!("FlashcardSetEdit");

  await DB.flashcardSet.update({
    where: {
      id: setId
    },
    data: { name }
  });

  res.status(204).send();
});

setId.put(route, Authentication, VerifyOwner)
setId.put(route, async (req, res) => {
  const { setId } = await req.validateParams!("SetId");
  const user = await DB.user.findFirstOrThrow({ where: { email: req.jwtData!.email } });
  const { name, flashcards } = await req.validate!("FlashcardSetUpdate");

  await DB.flashcardSet.update({
    where: {
      id: setId
    },
    data: { name }
  });

  await DB.flashcard.deleteMany({ where: { setId } });

  await DB.flashcard.createManyAndReturn({
    data: flashcards.map(flashcard => ({
      ...flashcard,
      creator: user.id,
      setId
    }))
  });

  res.status(204).send();
})

setId.use(route, cards);

export default setId;
