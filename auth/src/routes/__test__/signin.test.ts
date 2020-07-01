import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});

it("returns a 200 with a cookie on successful signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

it("returns a 400 with an invalid email", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app)
    .post("/api/users/signin")
    .send({ password: "pass" })
    .expect(400);
});

it("disallows duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "123456",
    })
    .expect(400);
});
