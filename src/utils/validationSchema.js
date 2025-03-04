import * as Yup from "yup";

export const bookingSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full Name is required")
    .min(3, "Full Name must be at least 3 characters"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^\d+$/, "Phone number must be numeric")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),

  selectedDate: Yup.mixed().required("Please select a date"),

  selectedDuration: Yup.number().required("Please select a duration"),

  selectedSlot: Yup.string().required("Please select a time slot"),

  selectedMethod: Yup.string().required("Please select a payment method"),
});
