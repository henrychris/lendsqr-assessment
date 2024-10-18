import request from "supertest";
import { app } from "../../src/server";
import { compare, hash } from "../../__mocks__/bcrypt";
import { generateToken } from "../../src/helpers/token";
import { isUserBlacklisted } from "../../src/services/adjutorService";
import {
    getUserByEmailAsync,
    isEmailInUseAsync,
    createUserAsync,
} from "../../src/services/userService";
import { vi, describe, expect, afterEach, it } from "vitest";

// Mock dependencies
vi.mock("../../src/services/userService");
vi.mock("../../src/services/adjutorService");
vi.mock("../../src/helpers/token");
vi.mock("bcrypt");

// Default token mock
vi.mocked(generateToken).mockReturnValue("mocked-token");

describe("User Controller", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("POST /create-account", () => {
        it("should return 400 if any field is missing", async () => {
            const response = await request(app).post("/users/create").send({
                name: "John Doe",
                email: "john@example.com",
            });

            expect(response.status).toBe(422);
        });

        it("should return 403 if user is blacklisted", async () => {
            vi.mocked(isUserBlacklisted).mockResolvedValueOnce(true);

            const response = await request(app).post("/users/create").send({
                name: "John Doe",
                email: "blacklisted@example.com",
                password: "password123",
            });

            expect(response.status).toBe(403);
            expect(response.body).toEqual({ error: "User is blacklisted" });
        });

        it("should return 400 if email is already in use", async () => {
            vi.mocked(isEmailInUseAsync).mockResolvedValueOnce(true);

            const response = await request(app).post("/users/create").send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: "This email address is taken.",
            });
        });

        it("should return 201 and create an account successfully", async () => {
            vi.mocked(isEmailInUseAsync).mockResolvedValueOnce(false);
            vi.mocked(createUserAsync).mockResolvedValueOnce(1);

            vi.mocked(hash).mockResolvedValueOnce("hashed-password");

            const response = await request(app).post("/users/create").send({
                name: "John Doe",
                email: "john@example.com",
                password: "password123",
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: "Account created",
                userId: 1,
                token: "mocked-token",
            });
        });
    });

    describe("POST /login", () => {
        it("should return 422 if any field is missing", async () => {
            const response = await request(app).post("/users/login").send({
                email: "john@example.com",
            });

            expect(response.status).toBe(422);
        });

        it("should return 401 if user is not found", async () => {
            vi.mocked(getUserByEmailAsync).mockResolvedValue(undefined);

            const response = await request(app).post("/users/login").send({
                email: "unknown@example.com",
                password: "password123",
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "Invalid credentials." });
        });

        it("should return 401 if password is incorrect", async () => {
            vi.mocked(getUserByEmailAsync).mockResolvedValue({
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                password: "hashed-password",
                balance: 100,
            });

            compare.mockResolvedValueOnce(false);

            const response = await request(app).post("/users/login").send({
                email: "john@example.com",
                password: "wrong-password",
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: "Invalid credentials." });
        });

        it("should return 200 and login the user successfully", async () => {
            vi.mocked(getUserByEmailAsync).mockResolvedValue({
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                password: "hashed-password",
                balance: 100,
            });
            compare.mockResolvedValueOnce(true);

            const response = await request(app).post("/users/login").send({
                email: "john@example.com",
                password: "hashed-password",
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                userId: 1,
                name: "John Doe",
                email: "john@example.com",
                balance: 100,
                token: "mocked-token",
            });
        });
    });
});
