"use server"

import { registerUserService } from "@/lib/strapi";
import { FormState, SignupFormSchema } from "@/validations/auth";
import { z } from "zod";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieConfig = {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    path: "/",
    domain: process.env.HOST ?? "localhost",
    secure: process.env.NODE_ENV === "production",
}

export async function registerUserAction(prevState: FormState, formData: FormData): Promise<FormState> {

    const fields = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        email: formData.get("email") as string,
    }

    console.log("Registering user with fields:", fields);

    const validatedFields = SignupFormSchema.safeParse(fields);

    if (!validatedFields.success) {
        const flattened = z.flattenError(validatedFields.error)
        console.log("Validation errors:", flattened.fieldErrors);
        return { success: false, message: "Validation error", strapiErrors: null, zodErrors: flattened.fieldErrors, data: fields };
    }

    const response = await registerUserService(validatedFields.data);

    if (!response || response.error) {
        console.log("Strapi registration error:", response.error);
        return { success: false, message: "Registration error", strapiErrors: response.error, zodErrors: null, data: fields };
    }

    console.log("User registered successfully:", response);

    const cookieStore = await cookies();
    cookieStore.set(
        'jwt',
        response.jwt,
        cookieConfig,
    );

    // Redirect to home page after successful registration
    redirect("/dashboard");

    return { success: true, message: "Registration successful", strapiErrors: null, zodErrors: null, data: fields };

}