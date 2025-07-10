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
import {
  Authentication,
  ValidateParams,
  VerifyOwner,
} from "../../../../middlewares";
import { DB } from "../../../../../util";
import { Flashcard } from "@povario/potato-study.js/models";

const route = "/:cardId";
const cardId = Router({ mergeParams: true });

cardId.use(ValidateParams);

cardId.get(route, async (req, res) => {
  const { setId, cardId } = await req.validateParams!("CardId");

  const flashcard: Flashcard = await DB.flashcard.findFirstOrThrow({
    where: { setId, id: cardId },
  });

  res.json(flashcard);
});

cardId.patch(route, Authentication, VerifyOwner);
cardId.patch(route, async (req, res) => {
  const { cardId } = await req.validateParams!("CardId");

  const data = await req.validate!("FlashcardEdit");
  const updatedCard = await DB.flashcard.update({
    where: { id: cardId },
    data,
  });

  res.json(updatedCard);
});

cardId.delete(route, Authentication, VerifyOwner);
cardId.delete(route, async (req, res) => {
  const { cardId } = await req.validateParams!("CardId");

  await DB.flashcard.delete({ where: { id: cardId } });

  res.status(204).send();
});

export default cardId;
