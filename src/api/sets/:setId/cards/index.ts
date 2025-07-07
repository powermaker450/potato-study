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
import { Authentication } from "../../../middlewares";
import { Flashcard } from "@povario/potato-study.js/models";
import { DB, NoSetAccessError, NotFoundError } from "../../../../util";
import cardId from "./:cardId";

const route = "/cards";
const cards = Router({ mergeParams: true });

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

cards.post(route, Authentication);
cards.post(route, async (req, res) => {
  const { setId } = await req.validateParams!("SetId");
  const card = await req.validate!("FlashcardCreate");

  const set = await DB.flashcardSet.findFirst({ where: { id: setId } });
  const user = await DB.user.findFirst({
    where: { email: req.jwtData!.email },
  });

  if (!set) {
    throw new NotFoundError();
  }

  if (set.creator !== user!.id) {
    throw new NoSetAccessError();
  }

  const flashcard: Flashcard = await DB.flashcard.create({
    data: {
      ...card,
      setId,
      creator: user!.id,
    },
  });

  res.status(201).json(flashcard);
});

cards.use(route, cardId);

export default cards;
