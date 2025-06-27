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
import { Authentication, ValidateParams } from "../../../../middlewares";
import { DB, NoSetAccessError } from "../../../../../util";
import { Flashcard } from "@povario/potato-study.js/models";

const route = "/:cardId";
export const id = Router({ mergeParams: true });

id.use(ValidateParams);

id.get(route, async (req, res) => {
  const { setId, cardId } = await req.validateParams!("CardId");

  const flashcard: Flashcard = await DB.flashcard.findFirstOrThrow({
    where: { setId, id: cardId },
  });

  res.json(flashcard);
});

id.patch(route, Authentication, async (req, res) => {
  const { setId, cardId } = await req.validateParams!("CardId");
  const { email } = req.jwtData!;
  const set = await DB.flashcardSet.findFirstOrThrow({ where: { id: setId } });
  const user = await DB.user.findFirstOrThrow({ where: { email } });

  if (set.creator !== user.id) {
    throw new NoSetAccessError();
  }

  const data = await req.validate!("FlashcardEdit");
  const updatedCard = await DB.flashcard.update({
    where: { id: cardId },
    data,
  });

  res.json(updatedCard);
});

id.delete(route, Authentication, async (req, res) => {
  const { setId, cardId } = await req.validateParams!("CardId");
  const { email } = req.jwtData!;
  const set = await DB.flashcardSet.findFirstOrThrow({ where: { id: setId } });
  const user = await DB.user.findFirstOrThrow({ where: { email } });

  if (set.creator !== user.id) {
    throw new NoSetAccessError();
  }

  await DB.flashcard.delete({ where: { id: cardId } });

  res.status(204).send();
});
