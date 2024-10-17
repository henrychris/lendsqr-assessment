import Joi from "joi";

export const fundAccountSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a valid number.",
        "number.positive": "Amount must be greater than zero.",
        "any.required": "Amount is required.",
    }),
});

export const transferFundsSchema = Joi.object({
    recipientEmail: Joi.string().email().required().messages({
        "string.email": "Recipient email must be a valid email address.",
        "any.required": "Recipient email is required.",
    }),
    amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a valid number.",
        "number.positive": "Amount must be greater than zero.",
        "any.required": "Amount is required.",
    }),
});

export const withdrawFundsSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a valid number.",
        "number.positive": "Amount must be greater than zero.",
        "any.required": "Amount is required.",
    }),
});
