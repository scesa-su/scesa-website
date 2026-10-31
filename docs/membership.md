# Membership: /join and the Members sheet

Students apply at **scesa.co.ke/join**. They fill in their details, pick communities, pay the one-time
**KES 500** to **Paybill 4098097, Account 0242402209001**, and type in their M-Pesa code. The site adds
a row to the `Members` tab with `payment_status = pending` and gives them a reference such as `SC-AB12CD34`.

The committee checks the payment and marks the row `confirmed`. The student then opens
**scesa.co.ke/join/status**, enters their reference and student ID, and sees the WhatsApp invite link.
Nobody sees the invite before they are confirmed.

The fee, Paybill and account number live in `src/lib/constants.ts`. The browser never sends the amount.

## One-time setup

### 1. The sheet

The sheet is **SCESA Membership Form v2026** in the SCESA folder of the Strathmore Shared Drive, where the
group `scesa@strathmore.edu` is Content Manager. The drive owns the file, so it survives board changes.

1. Add a tab named exactly `Members`.
2. Put this header in row 1, one name per column, A to P:

   `reference, full_name, student_id, email, phone, course, year, communities, mpesa_code, amount_kes, payment_status, confirmed_by, confirmed_at, added_to_whatsapp, source, created_at`

3. Make column K (`payment_status`) a dropdown of `pending, confirmed, rejected` with "Reject the input" on.
   The site only knows those three words: anything else (`paid`, `declined`, blank) reads as `pending`, and
   still blocks the student from reapplying. Make column N (`added_to_whatsapp`) checkboxes, and format
   columns C (`student_id`) and E (`phone`) as plain text so Sheets keeps them as typed.

The site never reads or edits the old Google Form responses tab.

### 2. The Google Cloud service account

1. In Google Cloud, open the `scesa-hub` project. Under IAM, the group `scesa@strathmore.edu` should
   hold `roles/owner`. Don't give it to a person.
2. Enable the **Google Sheets API**.
3. Create a service account just for the website, for example `scesa-website`. Give it no project roles.
4. Under the account's **Keys**, create a JSON key and download it. Keep it off the repo and delete the
   download once the env vars are set.
5. Open the sheet, press **Share**, add the service account's `…@…iam.gserviceaccount.com` address as
   **Editor** of this one file. Don't share the folder.

**Fallback.** If Strathmore policy blocks service-account keys or sharing with an
`@iam.gserviceaccount.com` address, make the sheet in a dedicated SCESA Gmail account instead, share it
with the service account, and change only `MEMBERS_SHEET_ID`. No code changes.

### 3. Vercel environment variables

Set these in Vercel → Project → Settings → Environment Variables, **Production only**:

| Name | Value |
| --- | --- |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` from the JSON key |
| `GOOGLE_PRIVATE_KEY` | `private_key` from the JSON key, including the BEGIN/END lines. Literal `\n` is fine. |
| `MEMBERS_SHEET_ID` | The long ID in the sheet's URL, between `/d/` and `/edit` |
| `WHATSAPP_INVITE_URL` | The members' WhatsApp community invite link |

Redeploy after changing them. While any of the first three is missing, `/join` answers
"Registration is temporarily closed". `/join/status` also needs `WHATSAPP_INVITE_URL`.

Never put these values, the sheet ID or a member export in the repo. `*.csv` is git-ignored for that reason.

## Confirming payments (committee routine)

Do this every day or two:

1. Open the M-Pesa statement for Paybill 4098097 and the `Members` tab, filtered to `payment_status = pending`.
2. For each pending row, find the transaction whose code matches `mpesa_code`. Check the amount is KES 500.
3. If it matches: set `payment_status` to `confirmed`, `confirmed_by` to your name, `confirmed_at` to
   today's date. The student can now see the invite on `/join/status`.
4. If there is no match after a few days, or the amount is wrong: set `payment_status` to `rejected` and
   put your name in `confirmed_by`. The student is told to contact `scesa@strathmore.edu` or apply again
   with the correct code. A rejected row does not block a new application with a different code.
5. Once a confirmed member has joined the WhatsApp community, tick `added_to_whatsapp`.
6. If two rows share an `mpesa_code` or `student_id` (two submissions sent at the same moment can both get
   through), confirm the earlier row and reject the later one.

Students who lost their reference, or joined through the Google Form (their migrated rows have references
they were never sent), email `scesa@strathmore.edu`. Look up their row by student ID and reply with the
WhatsApp invite once their row is `confirmed`.

Don't edit `reference`, `student_id` or `mpesa_code`: the site uses them for duplicate checks and status lookups.

## Moving the old Google Form responses

1. Open the old responses sheet, then File → Download → Comma-separated values.
2. In a clone of this repo with `npm install` done, on Node 22.18 or newer (the script imports a `.ts` file),
   run `node scripts/migrate-members.mjs responses.csv members-clean.csv`. It prints counts only.
   It keeps the newest response per student ID, skips responses without a 6-digit student ID, and marks
   every row `confirmed`, `confirmed_by = legacy`, `added_to_whatsapp = TRUE`, `source = google-form`.
3. In the membership sheet, File → Import → Upload `members-clean.csv` → **Insert new sheet(s)**, and
   **untick "Convert text to numbers, dates, and formulas"**. Left on, Sheets turns student IDs and codes into
   numbers and runs any cell starting with `=` as a formula. Check the rows, then paste them (without the
   header) below the last row of `Members` with Paste special → Values only.
4. Delete both CSV files from your computer.

If a count looks wrong (for example, many rows skipped), a form question was probably worded differently.
Adjust the matching pattern in `FIELDS` at the top of the script and run it again.

## The Google Form this term

The Google Form stays open this term. Add this to the top of its description:

> **We have moved.** Please join SCESA at **scesa.co.ke/join** instead. It takes three minutes and you get
> your WhatsApp invite as soon as your payment is confirmed.

Next term, close the form (Responses → turn off "Accepting responses").

## Board handover checklist

When a new board takes over:

- [ ] In Google Groups, update the members of `scesa@strathmore.edu`: add the incoming board, remove the outgoing one.
      The sheet and the Cloud project belong to the drive and the group, so nothing else needs to move.
- [ ] Rotate the service-account key: in Cloud, create a new key for the website service account, update
      `GOOGLE_PRIVATE_KEY` in Vercel, redeploy, check `/join` works, then delete the old key.
- [ ] Check outgoing members have lost access: they no longer appear in the group, the sheet's
      Share dialog or the Cloud project's IAM page, and the Vercel team.
- [ ] If the WhatsApp invite link was shared outside the committee, reset it in WhatsApp and update `WHATSAPP_INVITE_URL`.
