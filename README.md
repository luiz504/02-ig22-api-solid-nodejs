# App

GymPass style app.

## FR (Functional Requirements)

- [x] Should be possible to sign in;
- [x] Should be possible to log in;
- [x] Should be possible to retrieve the profile data from a logged-in user;
- [ ] Should be able to get the number of check-ins made by the logged-in user;
- [ ] Should be able to get the check-in history from a logged-in user;
- [ ] The logged-in user should be able to find nearby gyms;
- [ ] The logged-in user should be able to search for gyms by name;
- [x] The logged-in user should be able to do check-in to a Gym;
- [ ] Should be able to validate a check-in from a user;
- [x] Should be able to register a Gym;

## BR (Business Requirements)

- [x] The user should not be able to sign in with a duplicated email address;
- [x] The user should not be able to do more than two check-ins per day;
- [x] The user cannot do a check-in if they are more than 100 meters away from the gym;
- [ ] The check-in can be validated within a maximum of 20 minutes after its creation;
- [ ] The check-in can only be validated by admins;
- [ ] The gyms can only be registered by admins;

## NFR (Non Functional Requirements)

- [x] The user password must be encrypted;
- [x] The app data should be persisted in a PostgreSQL DB;
- [ ] All lists should be paginated with a maximum of 20 items per page;
- [ ] The user should be identified by a JWT (JSON Web Token);

## Dev Commands

```bash
docker compose up -d
```

```bash
docker compose stop
```

```bash
docker compose down
```

## Design Patterns

### Solid

- D - Dependency Inversion Principe

  -- In this project one good example were this principle was used is at the `use-cases`, where they were builded with classes to receive the dependencies to its constructor, this will enables use to determine witch dependencies/implementations will be used
  when instantiating the use-cases classes, this pattern will help us a lot to do unit testing or changing some dependencies in the future.

### Repository

### Factory

This pattern is used here to abstract the process of instantiation of use-cases that some cases requires many other things.
