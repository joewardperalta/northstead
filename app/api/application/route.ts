import { NextResponse } from "next/server";
import { mailer } from "@/lib/mail";

// Force Node.js runtime so Buffer/Nodemailer work
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 1) Collect "docs" (optional, multiple)
    const docFiles = formData
      .getAll("docs")
      .filter((v): v is File => v instanceof File && v.size > 0);

    // 2) Collect "resume" (required, single)
    const resumeEntry = formData.get("resume");
    const resume =
      resumeEntry instanceof File && resumeEntry.size > 0 ? [resumeEntry] : [];

    // 3) Combine and map to Nodemailer attachments
    const allFiles: File[] = [...resume, ...docFiles];

    const attachments = await Promise.all(
      allFiles.map(async (file) => ({
        filename: file.name,
        content: Buffer.from(new Uint8Array(await file.arrayBuffer())),
        contentType: file.type || "application/octet-stream",
      }))
    );

    const ref = toStr(formData.get("referenceNumber"));
    const appType = toStr(formData.get("applicationType"));
    const first = toStr(formData.get("firstName"));
    const last = toStr(formData.get("lastName"));
    const status = toStr(formData.get("status"));

    const subjectLine = `${ref} | ${appType} | ${first} ${last} | ${status}`;
    const toEmail =
      appType === "Home Childcare Program (HCCP)"
        ? "julie.r@northsteadimmig.com"
        : "ecare@northsteadimmig.com";

    await mailer.sendMail({
      from: process.env.SMTP_USER,
      to: toEmail,
      subject: subjectLine,
      html: buildHtmlBody(formData),
      attachments,
    });

    return NextResponse.json({ ok: true, message: "Email sent successfully!" });
  } catch (err: unknown) {
    // no 'any' here: safely derive a message from unknown
    const message = err instanceof Error ? err.message : "server_error";
    console.error("API /application error:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

function toStr(v: FormDataEntryValue | null) {
  return v == null || v instanceof File ? "" : String(v).trim();
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr><th>${label}</th><td>${value}</td></tr>`;
}

function section(title: string, rowsHtml: string) {
  if (!rowsHtml.trim()) return "";
  return `
    <h2>${title}</h2>
    <table class="kv">${rowsHtml}</table>
  `;
}

function buildExperienceBlocks(fd: FormData) {
  type Kid = { age?: string; condition?: string };
  type Elder = { age?: string; condition?: string };
  type Exp = {
    employer?: string;
    address?: string;
    title?: string;
    careType?: string; // "Child care" | "Elderly care" | "Others"
    otherType?: string; // only when careType === "Others"
    from?: string;
    to?: string;
    responsibilities?: string;
    medicalConditions?: string; // optional free-text you added in the form
    children: Kid[];
    elderly: Elder[];
  };

  // Keys in Exp that are simple strings (so we can safely assign sv)
  type ExpFlatKeys =
    | "employer"
    | "address"
    | "title"
    | "careType"
    | "otherType"
    | "from"
    | "to"
    | "responsibilities"
    | "medicalConditions";

  const exps: Record<number, Exp> = {};

  // Walk all entries once and extract experience[*] fields (including nested arrays)
  for (const [k, v] of fd.entries()) {
    const sv = toStr(v);

    // Flat fields, now including "otherType"
    {
      const m = k.match(
        /^experience\[(\d+)]\.(employer|address|title|careType|otherType|from|to|responsibilities|medicalConditions)$/
      );
      if (m) {
        const idx = Number(m[1]);
        const key = m[2] as ExpFlatKeys;
        exps[idx] = exps[idx] || { children: [], elderly: [] };
        exps[idx][key] = sv; // no 'any' cast needed
        continue;
      }
    }

    // Children array: experience[0].children[1].age / .condition
    {
      const m = k.match(
        /^experience\[(\d+)]\.children\[(\d+)]\.(age|condition)$/
      );
      if (m) {
        const idx = Number(m[1]);
        const j = Number(m[2]);
        const field = m[3] as keyof Kid;
        exps[idx] = exps[idx] || { children: [], elderly: [] };
        exps[idx].children[j] = exps[idx].children[j] || {};
        exps[idx].children[j][field] = sv;
        continue;
      }
    }

    // Elderly array: experience[0].elderly[1].age / .condition
    {
      const m = k.match(
        /^experience\[(\d+)]\.elderly\[(\d+)]\.(age|condition)$/
      );
      if (m) {
        const idx = Number(m[1]);
        const j = Number(m[2]);
        const field = m[3] as keyof Elder;
        exps[idx] = exps[idx] || { children: [], elderly: [] };
        exps[idx].elderly[j] = exps[idx].elderly[j] || {};
        exps[idx].elderly[j][field] = sv;
        continue;
      }
    }
  }

  const blocks = Object.keys(exps)
    .map(Number)
    .sort((a, b) => a - b)
    .map((i) => {
      const e = exps[i]!;
      const childList = (e.children || [])
        .filter((c) => c && (c.age || c.condition))
        .map(
          (c, idx) =>
            `<li><strong>Child ${idx + 1}:</strong> Age: ${c.age || "—"}${
              c.condition ? ` &nbsp;•&nbsp; Condition: ${c.condition}` : ""
            }</li>`
        )
        .join("");

      const elderlyList = (e.elderly || [])
        .filter((z) => z && (z.age || z.condition))
        .map(
          (z, idx) =>
            `<li><strong>Elderly ${idx + 1}:</strong> Age: ${z.age || "—"}${
              z.condition ? ` &nbsp;•&nbsp; Condition: ${z.condition}` : ""
            }</li>`
        )
        .join("");

      // Build rows
      let rows = "";
      rows += row("Employer / Facility", e.employer);
      rows += row("Address", e.address);
      rows += row("Position / Title", e.title);

      // Renamed label + include the "Other Job Type" when applicable
      rows += row("Type of Job", e.careType);
      if (e.careType === "Others") {
        rows += row("Other Job Type", e.otherType);
      }

      rows += row("From", e.from);
      rows += row("To", e.to);
      rows += row("Responsibilities", e.responsibilities);

      if (childList) {
        rows += row(
          "Children (Ages & Conditions)",
          `<ol style="margin:6px 0 0 18px; padding:0;">${childList}</ol>`
        );
      }
      if (elderlyList) {
        rows += row(
          "Elderly (Ages & Conditions)",
          `<ol style="margin:6px 0 0 18px; padding:0;">${elderlyList}</ol>`
        );
      }

      // Optional free-text “Medical conditions handled”
      rows += row("Medical conditions handled", e.medicalConditions);

      return section(`Experience #${i + 1}`, rows);
    });

  return blocks.join("");
}

function buildHtmlBody(fd: FormData) {
  const personal =
    row("Application Type", toStr(fd.get("applicationType"))) +
    row("Reference #", toStr(fd.get("referenceNumber"))) +
    row("First Name", toStr(fd.get("firstName"))) +
    row("Last Name", toStr(fd.get("lastName"))) +
    row("Phone", toStr(fd.get("phone"))) +
    row("Email", toStr(fd.get("email"))) +
    row("Date of Birth", toStr(fd.get("dob"))) +
    row("Age", toStr(fd.get("age"))) +
    row("Gender", toStr(fd.get("gender"))) +
    row("Religion", toStr(fd.get("religion"))) +
    row("Height", toStr(fd.get("height"))) +
    row("Civil Status", toStr(fd.get("civil")));

  const address =
    row("Street", toStr(fd.get("street"))) +
    row("City", toStr(fd.get("city"))) +
    row("Province/State", toStr(fd.get("province"))) +
    row("Postal/ZIP", toStr(fd.get("postal"))) +
    row("Country", toStr(fd.get("country"))) +
    row("Spouse/Partner & Children in Canada", toStr(fd.get("familyInCanada")));

  const immigrationStatus = toStr(fd.get("status"));
  const immigration =
    row("Current Status", immigrationStatus) +
    row("Permit Expiry", toStr(fd.get("permitExpiry"))) +
    row("Program (if Student)", toStr(fd.get("program"))) +
    row("Program Completion", toStr(fd.get("completion"))) +
    row("Passport Expiry", toStr(fd.get("passportExpiry"))) +
    row("Additional Notes", toStr(fd.get("additionalNotes")));

  const startAvail = toStr(fd.get("startAvailability"));
  const startDateSpecific = toStr(fd.get("startDate"));

  const licenses =
    row("Driver’s License", toStr(fd.get("drivers"))) +
    row("License Class", toStr(fd.get("licenseClass"))) +
    row("Comfortable with Pets", toStr(fd.get("pets"))) +
    row("Looking for", toStr(fd.get("jobType"))) +
    row("LMIA Required", toStr(fd.get("lmia"))) +
    row("Start Availability", startAvail) +
    (startAvail === "Specific date" && startDateSpecific
      ? row("Specific Start Date", startDateSpecific)
      : "");

  const family = row("Number of Children", toStr(fd.get("childrenCount"))) + "";

  // Family-level children (from Step 3)
  let childrenBlocks = "";
  for (const [k, v] of fd.entries()) {
    const m = k.match(/^children\[(\d+)]\.(age|residence)$/);
    if (!m) continue;
    const idx = Number(m[1]) + 1;
    const label =
      m[2] === "age" ? `Child ${idx} Age` : `Child ${idx} Residence`;
    childrenBlocks += row(label, toStr(v));
  }
  const childrenSection = section("Children Details", childrenBlocks);

  // Clinical placement (only relevant if Student fields present)
  const clinical =
    row("Facility", toStr(fd.get("clinical.facility"))) +
    row("Placement From", toStr(fd.get("clinical.from"))) +
    row("Placement To", toStr(fd.get("clinical.to"))) +
    row("Position", toStr(fd.get("clinical.position"))) +
    row("Duties / Responsibilities", toStr(fd.get("clinical.duties")));

  // Only render section if at least one clinical field has value
  const hasClinical =
    toStr(fd.get("clinical.facility")) ||
    toStr(fd.get("clinical.from")) ||
    toStr(fd.get("clinical.to")) ||
    toStr(fd.get("clinical.position")) ||
    toStr(fd.get("clinical.duties"));

  const clinicalSection = hasClinical
    ? section("Clinical Placement (Student – Optional)", clinical)
    : "";

  const interview =
    row("Preferred Interview Date", toStr(fd.get("interviewDate"))) +
    row("Preferred Interview Time", toStr(fd.get("interviewTime")));

  const html = `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:#0f172a; }
        h1 { margin:0 0 12px; font-size:20px; }
        h2 { margin:24px 0 8px; font-size:16px; }
        .card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; }
        .kv { border-collapse: collapse; width:100%; }
        .kv th { text-align:left; padding:6px 8px; width:280px; background:#f8fafc; border-bottom:1px solid #e5e7eb; vertical-align:top; }
        .kv td { padding:6px 8px; border-bottom:1px solid #e5e7eb; }
        ol { margin: 0; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Form Submission</h1>
        ${section("Personal Information", personal)}
        ${section("Address", address)}
        ${section("Immigration", immigration)}
        ${section("Licenses & Work Preferences", licenses)}
        ${section("Family Summary", family)}
        ${childrenSection}
        ${buildExperienceBlocks(fd)}
        ${clinicalSection}
        ${section("Interview Preference", interview)}
      </div>
    </body>
  </html>
  `;

  return html;
}
