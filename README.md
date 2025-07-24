# Potato Study

A tool to help memorize definitions and terms with flashcards, games and more

<p>
    <img alt="The potato study homepage, displaying all flashcard sets." src="https://raw.githubusercontent.com/powermaker450/potato-study/refs/heads/main/repo/home.png" width="500">
    <img alt="A single flashcard text" src="https://raw.githubusercontent.com/powermaker450/potato-study/refs/heads/main/repo/set.png" width="500">
    <img alt="A single flashcard answer" src="https://raw.githubusercontent.com/powermaker450/potato-study/refs/heads/main/repo/set-answer.png" width="500">
</p>

## Hosting

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/powermaker450/potato-study
pnpm i
```

2. Create a `.env` file with required variables:

```
DATABASE_URL=file:./data.db

SECRET_KEY= # A secret key 32 characters or more in length!
PORT= # Optional
```

3. Create the database and start the project:

```bash
pnpm prisma migrate dev --name init
pnpm build
pnpm start
```

## Using

To test your instance, set up the [client](https://github.com/powermaker450/potato-study-client)
