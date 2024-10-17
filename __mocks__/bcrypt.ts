import { vi } from "vitest";

export const hash = vi.fn().mockResolvedValue("hashed-password");
export const compare = vi.fn().mockResolvedValue(true);
