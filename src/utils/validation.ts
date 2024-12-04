import * as z from "zod";


export const UserRegistrationSchema=z.object({
      fullName: z
              .string({ required_error: "This field is required!" })
              .min(1, "This field is required!"),
      email: z
             .string({ required_error: "This field is required!" })
             .email("Enter a valid email!"),
      phNumber: z
             .string({ required_error: "This field is required!" })
             .min(1, "This field is required!")
             .min(10, "Phone number must be of 10 digits!")
             .max(10,"Phone number must be of 10 digits!")
})