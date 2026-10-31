export const PAYMENT_STATUSES = ["pending", "confirmed", "rejected"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/** What an applicant submits, already validated and normalised. */
export type MemberApplication = {
  fullName: string;
  /** 6 digits */
  studentId: string;
  /** lowercase, @strathmore.edu */
  email: string;
  /** 254XXXXXXXXX */
  phone: string;
  course: string;
  /** 1–5 */
  year: number;
  communities: string[];
  /** 10 uppercase letters or digits */
  mpesaCode: string;
};

/** One row of the Members sheet. */
export type Member = MemberApplication & {
  /** SC- plus 8 characters */
  reference: string;
  amountKes: number;
  paymentStatus: PaymentStatus;
  confirmedBy: string;
  confirmedAt: string;
  addedToWhatsapp: boolean;
  source: "website" | "google-form";
  /** ISO 8601 with +03:00 */
  createdAt: string;
};

/** The few columns the duplicate and status checks read. */
export type MemberRecord = Pick<Member, "reference" | "studentId" | "mpesaCode"> & { paymentStatus: string };
