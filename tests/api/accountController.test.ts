import request from "supertest";
import { app } from "../../src/server";
import {
    fundAccountAsync,
    transferFundsAsync,
    withdrawFundsAsync,
} from "../../src/services/accountService";
import {
    getUserByEmailAsync,
    getUserByIdAsync,
} from "../../src/services/userService";
import { vi, describe, it, expect, afterEach } from "vitest";
import { User } from "../../src/db/models/user";

vi.mock("../../src/services/accountService");
vi.mock("../../src/services/userService");

describe("Account Controller", () => {
    const mockUser: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        password: "hashed-password",
        balance: 1000,
    };
    const mockUserToken = "token-1-1729105169268";

    const recipient: User = {
        id: 2,
        name: "John Receiver",
        email: "receiver@example.com",
        password: "hashed-password",
        balance: 1000,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe("fundAccount", () => {
        it("should fund the account successfully", async () => {
            const AMOUNT = 1000;
            const response = await request(app)
                .post("/account/fund")
                .send({
                    amount: AMOUNT,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(response.status).toBe(200);
            expect(fundAccountAsync).toHaveBeenCalledWith(mockUser.id, AMOUNT);
        });

        it("should return 422 if the amount is negative", async () => {
            const AMOUNT = -1000;
            const response = await request(app)
                .post("/account/fund")
                .send({
                    amount: AMOUNT,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(response.status).toBe(422);
        });
    });

    describe("transferFunds", () => {
        it("should transfer funds successfully", async () => {
            const AMOUNT = 1000;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);
            vi.mocked(getUserByEmailAsync).mockResolvedValueOnce(recipient);

            const res = await request(app)
                .post("/account/transfer")
                .send({
                    amount: AMOUNT,
                    recipientEmail: "jane@example.com",
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(transferFundsAsync).toHaveBeenCalledWith(
                mockUser.id,
                recipient.id,
                AMOUNT
            );
            expect(res.status).toBe(200);
        });

        it("should return 400 if sender is not found", async () => {
            const AMOUNT = 50;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(undefined);

            const res = await request(app)
                .post("/account/transfer")
                .send({
                    amount: AMOUNT,
                    recipientEmail: "jane@example.com",
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
        });

        it("should return 400 if recipient is not found", async () => {
            const AMOUNT = 50;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);
            vi.mocked(getUserByEmailAsync).mockResolvedValueOnce(undefined);

            const res = await request(app)
                .post("/account/transfer")
                .send({
                    amount: AMOUNT,
                    recipientEmail: "jane@example.com",
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
        });

        it("should return 400 if sender has insufficient funds", async () => {
            const AMOUNT = 2000; // greater than balance

            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);
            vi.mocked(getUserByEmailAsync).mockResolvedValueOnce(recipient);

            const res = await request(app)
                .post("/account/transfer")
                .send({
                    amount: AMOUNT,
                    recipientEmail: "jane@example.com",
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Insufficient funds" });
        });

        it("should fail if sender and recipient are the same", async () => {
            const AMOUNT = 1000; // greater than balance

            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);
            vi.mocked(getUserByEmailAsync).mockResolvedValueOnce(mockUser);

            const res = await request(app)
                .post("/account/transfer")
                .send({
                    amount: AMOUNT,
                    recipientEmail: mockUser.email,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                error: "Invalid Recipient - you may not transfer funds to yourself.",
            });
        });
    });

    describe("withdrawFunds", () => {
        it("should withdraw funds successfully", async () => {
            const AMOUNT = 1000;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);

            const res = await request(app)
                .post("/account/withdraw")
                .send({
                    amount: AMOUNT,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(withdrawFundsAsync).toHaveBeenCalledWith(
                mockUser.id,
                AMOUNT
            );
            expect(res.status).toBe(200);
        });

        it("should return 400 if user is not found", async () => {
            const AMOUNT = 1000;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(undefined);

            const res = await request(app)
                .post("/account/withdraw")
                .send({
                    amount: AMOUNT,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "User not found." });
        });

        it("should return 400 if insufficient funds", async () => {
            const AMOUNT = 5000;
            vi.mocked(getUserByIdAsync).mockResolvedValueOnce(mockUser);

            const res = await request(app)
                .post("/account/withdraw")
                .send({
                    amount: AMOUNT,
                })
                .auth(mockUserToken, { type: "bearer" });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: "Insufficient funds" });
        });
    });
});
