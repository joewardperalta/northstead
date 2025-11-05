"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * Drop this file anywhere in your Next.js (App Router) project, e.g. app/form/page.tsx
 * Make sure Tailwind is set up. No <style> tag — everything is Tailwind classes.
 */

// Step labels
const STEP_LABELS = [
  "Personal",
  "Immigration",
  "Family",
  "Licenses",
  "Experience",
  "Interview",
  "Documents",
] as const;

const WEEKDAY_SLOTS = [
  "10:00 a.m. ET",
  "10:30 a.m. ET",
  "11:00 a.m. ET",
  "11:30 a.m. ET",
  "12:00 p.m. ET",
  "12:30 p.m. ET",
  "1:00 p.m. ET",
  "1:30 p.m. ET",
  "2:00 p.m. ET",
  "2:30 p.m. ET",
  "3:00 p.m. ET",
  "4:00 p.m. ET",
];

const WEEKEND_SLOTS = [
  "9:00 a.m. ET",
  "10:00 a.m. ET",
  "10:30 a.m. ET",
  "11:00 a.m. ET",
  "11:30 a.m. ET",
  "12:00 p.m. ET",
];

// Experience item id type
type UID = string;

function uid(): UID {
  return Math.random().toString(36).slice(2, 10);
}

export default function MultiStepApplicationFormPage() {
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState<string>("");
  const [validTick, setValidTick] = useState(0);
  const [status, setStatus] = useState(""); // Immigration status
  const [hasDrivers, setHasDrivers] = useState(""); // "Yes" / "No"
  const [experienceIds, setExperienceIds] = useState<UID[]>(() => [uid()]);
  const [isMarried, setIsMarried] = useState(false);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [careTypeById, setCareTypeById] = useState<Record<UID, string>>({});
  const [startAvailability, setStartAvailability] = useState("");
  const [hasResume, setHasResume] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [interviewTime, setInterviewTime] = useState(""); // used

  const [childrenRowsById, setChildrenRowsById] = useState<
    Record<UID, number[]>
  >({});
  const [elderlyRowsById, setElderlyRowsById] = useState<Record<UID, number[]>>(
    {}
  );

  const isSaturday = date ? date.getDay() === 6 : false;

  // The slots to show for the selected date
  const visibleSlots = useMemo(
    () => (isSaturday ? WEEKEND_SLOTS : WEEKDAY_SLOTS),
    [isSaturday]
  );

  function addChildRow(id: UID) {
    setChildrenRowsById((m) => {
      const next = (m[id] ?? []).slice();
      next.push(next.length); // simple index key
      return { ...m, [id]: next };
    });
  }
  function removeChildRow(id: UID, idx: number) {
    setChildrenRowsById((m) => {
      const next = (m[id] ?? []).filter((i) => i !== idx);
      return { ...m, [id]: next };
    });
  }

  function addElderlyRow(id: UID) {
    setElderlyRowsById((m) => {
      const next = (m[id] ?? []).slice();
      next.push(next.length);
      return { ...m, [id]: next };
    });
  }
  function removeElderlyRow(id: UID, idx: number) {
    setElderlyRowsById((m) => {
      const next = (m[id] ?? []).filter((i) => i !== idx);
      return { ...m, [id]: next };
    });
  }

  // ---------- REFS (fixed) ----------
  // Pre-allocate one slot per step so indices always exist
  const stepRefs = useRef<Array<HTMLFieldSetElement | null>>(
    Array(STEP_LABELS.length).fill(null)
  );
  const setStepRef =
    (i: number) =>
    (el: HTMLFieldSetElement | null): void => {
      stepRefs.current[i] = el;
    };

  const formRef = useRef<HTMLFormElement | null>(null);
  // -----------------------------------

  const router = useRouter();

  // Compute whether current step can go next
  const canNext = useMemo(() => {
    const cur = stepRefs.current[step];
    if (!cur) return false;

    // Special rule: Experience step — must have at least one card AND all required fields inside are valid
    if (step === 4) {
      if (experienceIds.length === 0) return false;
    }

    // Toggle additional required fields dynamically
    // Student block (step 1 — index 1)
    if (step === 1) {
      // Mark program, completion, passportExpiry required only when status === "Student"
      const program = cur.querySelector<HTMLInputElement>("#program");
      const completion = cur.querySelector<HTMLInputElement>("#completion");
      const passport = cur.querySelector<HTMLInputElement>("#passportExpiry");
      [program, completion, passport].forEach((el) => {
        if (el) el.required = status === "Student";
      });
    }

    // License class required only if hasDrivers === "Yes" (step 3 — index 3)
    if (step === 3) {
      const licenseSel = cur.querySelector<HTMLSelectElement>("#licenseClass");
      if (licenseSel) licenseSel.required = hasDrivers === "Yes";

      // Start date required only when "Specific date" is chosen
      const specificDateInput =
        cur.querySelector<HTMLInputElement>("#startDateSpecific");
      if (specificDateInput) {
        specificDateInput.required = startAvailability === "Specific date";
      }
    }

    // Now check validity of all [required]
    const required = Array.from(
      cur.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("[required]")
    );

    return required.every((el) => el.checkValidity());
  }, [
    step,
    status,
    hasDrivers,
    experienceIds.length,
    validTick,
    startAvailability,
  ]);

  function goNext() {
    if (canNext) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    else {
      // trigger native validation popups on first invalid
      const cur = stepRefs.current[step];
      if (!cur) return;
      const firstInvalid = cur.querySelector<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("[required]:invalid");
      if (firstInvalid) firstInvalid.reportValidity();
    }
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function addExperience() {
    const id = uid();
    setExperienceIds((prev) => [...prev, id]);
  }

  function removeExperience(id: UID) {
    setExperienceIds((prev) => prev.filter((x) => x !== id));
    setCareTypeById((m) => {
      const { [id]: _, ...rest } = m;
      return rest;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    if (isSubmitting) return;
    setIsSubmitting(true);
    setToast("");

    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch("/api/application", {
        method: "POST",
        body: formData,
      });

      // Try to read JSON safely
      let data: unknown = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      const okField = (data as { ok?: boolean } | null)?.ok === true;

      if (res.ok && okField) {
        setToast(
          "✅ Thank you for completing this assessment form. Our recruitment team will review your information and contact you for the next steps."
        );

        form.reset();
        setStatus("");
        setHasDrivers("");
        setExperienceIds([uid()]);
        setIsMarried(false);
        setChildrenCount(0);
        setStep(0);
        setCareTypeById({});
        setStartAvailability("");
        setHasResume(false);
        setDate(null);
        setInterviewTime("");

        router.push("/success/application");
      } else {
        setToast("❌ Failed to send form. Please try again.");
      }
    } catch (err: unknown) {
      console.error(err);
      setToast("❌ Network or server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    // Focus the first interactive control in the current step
    const cur = stepRefs.current[step];
    const first = cur?.querySelector<HTMLElement>(
      "input,select,textarea,button"
    );
    first?.focus({ preventScroll: true });

    // Listen for input/change within the current step to refresh validity state
    if (cur) {
      const bump = () => setValidTick((t) => t + 1);
      cur.addEventListener("input", bump);
      cur.addEventListener("change", bump);
      // Initial tick so prefilled values enable the button
      setValidTick((t) => t + 1);
      return () => {
        cur.removeEventListener("input", bump);
        cur.removeEventListener("change", bump);
      };
    }
  }, [step, isMarried, childrenCount, experienceIds, date, interviewTime]);

  function handleCivilOnChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "Married") setIsMarried(true);
    else setIsMarried(false);
  }

  // Common classes (light theme)
  const inputCls = "border-gray-300 rounded-lg px-4 py-3";
  const secondaryBtnCls =
    "btn rounded-lg border border-gray-300 bg-white py-3 font-semibold text-gray-800";
  const primaryBtnCls =
    "btn primary-btn inline-flex items-center rounded-lg py-3 font-semibold text-white disabled:opacity-50";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl p-6 sm:p-8">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
          {/* Stepper */}
          <nav
            aria-label="Form steps"
            className="grid grid-cols-7 gap-2 rounded-t-2xl border-b border-gray-200 bg-gray-100 p-4 max-md:grid-cols-3"
          >
            {STEP_LABELS.map((label, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div
                  key={label}
                  className={[
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
                    isActive
                      ? "border-blue-400 text-gray-900 bg-white"
                      : "border-gray-300 text-gray-600 bg-gray-50",
                    isDone ? "ring-1 ring-emerald-400/40" : "",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold",
                      isActive ? "border-current" : "border-gray-300",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate">{label}</span>
                </div>
              );
            })}
          </nav>

          {/* Card body */}
          <div className="p-6 sm:p-8">
            <header className="mb-6">
              <h1 className="mb-1 text-2xl font-semibold text-gray-900">
                Job Application Form
              </h1>
            </header>

            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="space-y-10"
            >
              {/* STEP 1: PERSONAL */}
              <fieldset
                ref={setStepRef(0)}
                aria-hidden={step !== 0}
                className={step === 0 ? "block" : "hidden"}
              >
                <legend className="sr-only">
                  Section 1: Personal Information
                </legend>

                <div className="flex gap-3">
                  <div className="mb-4 w/full w-full">
                    <label
                      htmlFor="applicationType"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Application Type
                    </label>
                    <select
                      id="applicationType"
                      className={inputCls}
                      name="applicationType"
                      required
                    >
                      <option value="">Select…</option>
                      <option>Home Childcare Program (HCCP)</option>
                      <option>Home Support Worker (HSW)</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label
                      htmlFor="referenceNumber"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Reference Number
                    </label>
                    <input
                      type="number"
                      id="referenceNumber"
                      name="referenceNumber"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block font-semibold text-sm"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      className={inputCls}
                      required
                      placeholder="e.g., Rico"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      className={inputCls}
                      required
                      placeholder="e.g., Garrett"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Contact Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className={inputCls}
                      required
                      placeholder="e.g., 6478359040"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className={inputCls}
                      required
                      placeholder="e.g., ricogarrett@gmail.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dob"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Date of Birth
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      type="date"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="age"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Age
                    </label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      className={inputCls}
                      required
                      placeholder="e.g., 28"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="religion"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Religion
                    </label>
                    <input
                      id="religion"
                      name="religion"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Height (cm or ft)
                    </label>
                    <input
                      id="height"
                      name="height"
                      className={inputCls}
                      placeholder="e.g., 170 or 5'7"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="civil"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Civil Status
                    </label>
                    <select
                      id="civil"
                      name="civil"
                      className={inputCls}
                      onChange={handleCivilOnChange}
                      required
                    >
                      <option value="">Select…</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Common-law</option>
                      <option>Separated</option>
                      <option>Widowed</option>
                    </select>
                  </div>
                </div>

                {isMarried && (
                  <div className="mt-3">
                    <label
                      htmlFor="familyInCanada"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Is your spouse/partner and children in Canada?
                    </label>
                    <select
                      id="familyInCanada"
                      name="familyInCanada"
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                )}

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="street"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Street Address
                    </label>
                    <input
                      id="street"
                      name="street"
                      required
                      placeholder="e.g., 123 Main St, Apt #"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1 block font-semibold text-sm"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      required
                      placeholder="e.g., Toronto"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="province"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Province / State
                    </label>
                    <input
                      id="province"
                      name="province"
                      required
                      placeholder="e.g., Ontario"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postal"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Postal / ZIP Code
                    </label>
                    <input
                      id="postal"
                      name="postal"
                      required
                      placeholder="e.g., M1A 2B3"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Country
                    </label>
                    <input
                      id="country"
                      name="country"
                      required
                      placeholder="e.g., Canada"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span />
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next0"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 2: IMMIGRATION */}
              <fieldset
                ref={setStepRef(1)}
                aria-hidden={step !== 1}
                className={step === 1 ? "block" : "hidden"}
              >
                <legend className="sr-only">
                  Section 2: Immigration Details
                </legend>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="status"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Current Immigration Status in Canada
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      defaultValue=""
                      className={inputCls}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="">Select…</option>
                      <option value="Spousal Open Work Permit">
                        Spousal Open Work Permit
                      </option>
                      <option value="Regular Open Work Permit">
                        Regular Open Work Permit
                      </option>
                      <option value="Vulnerable Open Work Permit">
                        Vulnerable Open Work Permit
                      </option>
                      <option value="Student">Student</option>
                      <option value="Post-Graduate Work Permit (PGWP)">
                        Post-Graduate Work Permit (PGWP)
                      </option>
                      <option value="Work Permit">Work Permit</option>
                      <option value="Home Support Worker (HSW) Restricted Permit">
                        Home Support Worker (HSW) Restricted Permit
                      </option>
                      <option value="Visitor/Tourist">Visitor/Tourist</option>
                      <option value="Permanent Resident (PR)">
                        Permanent Resident (PR)
                      </option>
                      <option value="Canadian Citizen">Canadian Citizen</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="permitExpiry"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Permit Expiration Date
                    </label>
                    <input
                      id="permitExpiry"
                      name="permitExpiry"
                      type="date"
                      className={inputCls}
                      required
                    />
                  </div>
                </div>

                {/* Student block */}
                <div
                  className={"mt-3" + (status === "Student" ? "" : " hidden")}
                >
                  <div>
                    <label
                      htmlFor="program"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Program Name
                    </label>
                    <input
                      id="program"
                      name="program"
                      required
                      className={inputCls}
                    />
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="completion"
                        className="mb-1 block font-semibold text-sm"
                      >
                        Date of Completion
                      </label>
                      <input
                        id="completion"
                        name="completion"
                        type="date"
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="passportExpiry"
                        className="mb-1 block font-semibold text-sm"
                      >
                        Passport Expiration Date
                      </label>
                      <input
                        id="passportExpiry"
                        name="passportExpiry"
                        type="date"
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label
                      htmlFor="additionalNotes"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Additional Notes
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      className={inputCls}
                      rows={5}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next1"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 3: FAMILY */}
              <fieldset
                ref={setStepRef(2)}
                aria-hidden={step !== 2}
                className={step === 2 ? "block" : "hidden"}
              >
                <legend className="sr-only">
                  Section 3: Family Information
                </legend>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label
                      htmlFor="childrenCount"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Number of Children
                    </label>
                    <input
                      id="childrenCount"
                      name="childrenCount"
                      type="number"
                      min={0}
                      max={10}
                      defaultValue={0}
                      required
                      className={inputCls}
                      onChange={(e) => {
                        const val = Math.max(
                          0,
                          Math.min(10, Number(e.target.value || 0))
                        );
                        setChildrenCount(val);
                      }}
                    />
                  </div>
                </div>

                {/* Dynamic children fields */}
                {childrenCount > 0 && (
                  <div className="mt-3 space-y-4">
                    {Array.from({ length: childrenCount }).map((_, i) => {
                      const idx = i + 1; // 1-based label
                      return (
                        <div key={idx} className="grid gap-3 md:grid-cols-3">
                          <div className="md:col-span-1">
                            <label className="mb-1 block font-semibold text-sm">
                              {/* You asked to name labels as "Children 1", "Children 2", etc. */}
                              Children {idx} Age
                            </label>
                            <input
                              id={`children.${i}.age`}
                              name={`children[${i}].age`}
                              type="number"
                              min={0}
                              required
                              className={inputCls}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="mb-1 block font-semibold text-sm">
                              Children {idx} Current Residence (city, province,
                              country)
                            </label>
                            <input
                              id={`children.${i}.residence`}
                              name={`children[${i}].residence`}
                              required
                              className={inputCls}
                              placeholder="e.g., City / Province / Country"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next2"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 4: LICENSES */}
              <fieldset
                ref={setStepRef(3)}
                aria-hidden={step !== 3}
                className={step === 3 ? "block" : "hidden"}
              >
                <legend className="sr-only">
                  Section 4: Licenses and Work Eligibility
                </legend>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="drivers"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Valid Canadian Driver’s License?
                    </label>
                    <select
                      id="drivers"
                      name="drivers"
                      required
                      defaultValue=""
                      className={inputCls}
                      onChange={(e) => setHasDrivers(e.target.value)}
                    >
                      <option value="">Select…</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* License class */}
                  <div className={hasDrivers === "Yes" ? "block" : "hidden"}>
                    <label
                      htmlFor="licenseClass"
                      className="mb-1 block font-semibold text-sm"
                    >
                      If yes, specify
                    </label>
                    <select
                      id="licenseClass"
                      name="licenseClass"
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      <option>G1</option>
                      <option>G2</option>
                      <option>Full G</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="pets"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Comfortable with pets?
                    </label>
                    <select id="pets" name="pets" className={inputCls} required>
                      <option value="">Select…</option>
                      <option>Yes</option>
                      <option>No</option>
                      <option>Maybe</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="jobType"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Looking for
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      className={inputCls}
                      required
                    >
                      <option value="">Select…</option>
                      <option>Part-time</option>
                      <option>Full-time</option>
                      <option>Live-in</option>
                      <option>Live-out</option>
                      <option>All of the above</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="lmia"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Require LMIA sponsorship?
                    </label>
                    <select id="lmia" name="lmia" className={inputCls} required>
                      <option value="">Select…</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="startAvailability"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Available start date
                    </label>
                    <select
                      id="startAvailability"
                      name="startAvailability"
                      className={inputCls}
                      required
                      onChange={(e) => setStartAvailability(e.target.value)}
                    >
                      <option value="">Select…</option>
                      <option>ASAP</option>
                      <option>Any time</option>
                      <option>Specific date</option>
                    </select>
                  </div>

                  {/* Only show the calendar when "Specific date" is selected */}
                  {startAvailability === "Specific date" && (
                    <div>
                      <label
                        htmlFor="startDateSpecific"
                        className="mb-1 block font-semibold text-sm"
                      >
                        Select date
                      </label>
                      <input
                        id="startDateSpecific"
                        name="startDate"
                        type="date"
                        required
                        className={inputCls}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next3"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 5: EXPERIENCE */}
              <fieldset
                ref={setStepRef(4)}
                aria-hidden={step !== 4}
                className={step === 4 ? "block" : "hidden"}
              >
                <legend className="sr-only">
                  Section 5: Proof of Experience
                </legend>
                <p className="mb-4 text-sm text-gray-600">
                  Please list your caregiver, PSW, or any work experience for
                  the last 3–5 years. Include the following details for each
                  employer:
                </p>

                <div className="space-y-4" id="experienceList">
                  {experienceIds.map((id, index) => (
                    <div
                      key={id}
                      data-exp
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            Company / Employer
                          </label>
                          <input
                            name={`experience[${index}].employer`}
                            className={inputCls}
                            placeholder="e.g., Elysia Santiago"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            Address
                          </label>
                          <input
                            name={`experience[${index}].address`}
                            className={inputCls}
                            placeholder="e.g., 123 Main Street, Apt 504 Toronto, ON  M5J 2N8 Canada"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            Dates of Employment (From)
                          </label>
                          <input
                            name={`experience[${index}].from`}
                            type="date"
                            className={inputCls}
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            To
                          </label>
                          <input
                            name={`experience[${index}].to`}
                            type="date"
                            className={inputCls}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block font-semibold text-sm">
                            Position / Title
                          </label>
                          <input
                            name={`experience[${index}].title`}
                            className={inputCls}
                            placeholder="e.g., Caregiver"
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="mb-1 block font-semibold text-sm">
                            Type of Job
                          </label>
                          <select
                            name={`experience[${index}].careType`}
                            required
                            className={inputCls}
                            defaultValue=""
                            onChange={(e) => {
                              const v = e.target.value;
                              setCareTypeById((m) => ({ ...m, [id]: v }));
                              // Clear dynamic rows when switching away
                              if (v === "Child care") {
                                setElderlyRowsById((m) => ({ ...m, [id]: [] }));
                              } else if (v === "Elderly care") {
                                setChildrenRowsById((m) => ({
                                  ...m,
                                  [id]: [],
                                }));
                              } else {
                                // Others or empty -> clear both
                                setChildrenRowsById((m) => ({
                                  ...m,
                                  [id]: [],
                                }));
                                setElderlyRowsById((m) => ({ ...m, [id]: [] }));
                              }
                            }}
                          >
                            <option value="">Select…</option>
                            <option value="Child care">Child care</option>
                            <option value="Elderly care">Elderly care</option>
                            <option value="Others">Others</option>
                          </select>

                          {careTypeById[id] === "Others" && (
                            <div className="mt-3">
                              <label className="mb-1 block font-semibold text-sm">
                                Specify Other Job Type
                              </label>
                              <input
                                name={`experience[${index}].otherType`}
                                className={inputCls}
                                placeholder="e.g., Housekeeping, Cook, Personal Assistant"
                                required
                              />
                            </div>
                          )}

                          {/* CHILD block */}
                          {careTypeById[id] === "Child care" && (
                            <div className="mt-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => addChildRow(id)}
                                  className={secondaryBtnCls}
                                >
                                  + Add Child Profile
                                </button>
                                {!!childrenRowsById[id]?.length && (
                                  <span className="text-sm text-gray-600">
                                    {childrenRowsById[id].length} added
                                  </span>
                                )}
                              </div>

                              {(childrenRowsById[id] ?? []).map((rowIdx, j) => (
                                <div
                                  key={rowIdx}
                                  className="grid gap-3 md:grid-cols-3 items-end"
                                >
                                  <div>
                                    <label className="mb-1 block font-semibold text-sm">
                                      Child {j + 1} Age
                                    </label>
                                    <input
                                      name={`experience[${index}].children[${j}].age`}
                                      type="number"
                                      min={0}
                                      required
                                      className={inputCls}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="mb-1 block font-semibold text-sm">
                                      Child {j + 1} Medical condition (optional)
                                    </label>
                                    <input
                                      name={`experience[${index}].children[${j}].condition`}
                                      placeholder="e.g., asthma, autism, ADHD…"
                                      className={inputCls}
                                    />
                                  </div>
                                  <div className="md:col-span-3">
                                    <button
                                      type="button"
                                      onClick={() => removeChildRow(id, rowIdx)}
                                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                                    >
                                      Remove Child {j + 1}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ELDERLY block */}
                          {careTypeById[id] === "Elderly care" && (
                            <div className="mt-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => addElderlyRow(id)}
                                  className={secondaryBtnCls}
                                >
                                  + Add Care Profile
                                </button>
                                {!!elderlyRowsById[id]?.length && (
                                  <span className="text-sm text-gray-600">
                                    {elderlyRowsById[id].length} added
                                  </span>
                                )}
                              </div>

                              {(elderlyRowsById[id] ?? []).map((rowIdx, j) => (
                                <div
                                  key={rowIdx}
                                  className="grid gap-3 md:grid-cols-3 items-end"
                                >
                                  <div>
                                    <label className="mb-1 block font-semibold text-sm">
                                      Elderly {j + 1} Age
                                    </label>
                                    <input
                                      name={`experience[${index}].elderly[${j}].age`}
                                      type="number"
                                      min={0}
                                      required
                                      className={inputCls}
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <label className="mb-1 block font-semibold text-sm">
                                      Elderly {j + 1} Medical condition
                                      (optional)
                                    </label>
                                    <input
                                      name={`experience[${index}].elderly[${j}].condition`}
                                      placeholder="e.g., dementia, Parkinson’s, diabetes…"
                                      className={inputCls}
                                    />
                                  </div>
                                  <div className="md:col-span-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeElderlyRow(id, rowIdx)
                                      }
                                      className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100"
                                    >
                                      Remove Elderly {j + 1}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3">
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            Responsibilities
                          </label>
                          <textarea
                            name={`experience[${index}].responsibilities`}
                            required
                            placeholder="e.g., childcare, elderly care, housekeeping, cooking"
                            className={inputCls}
                            rows={5}
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeExperience(id)}
                          className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-semibold text-gray-800 hover:bg-gray-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addExperience}
                    className={secondaryBtnCls}
                  >
                    + Add Experience
                  </button>
                </div>

                {status === "Student" && (
                  <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 text-base font-semibold text-gray-900">
                      Clinical Placement (Optional)
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      If you are a student, please provide information about
                      your clinical placement.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block font-semibold text-sm">
                          Facility Name and Address
                        </label>
                        <textarea
                          name="clinical.facility"
                          rows={3}
                          placeholder="e.g., Sunnybrook Health Sciences Centre, 2075 Bayview Ave, Toronto, ON"
                          className={inputCls}
                        />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            Dates of Placement (From)
                          </label>
                          <input
                            type="date"
                            name="clinical.from"
                            className={inputCls}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold text-sm">
                            To
                          </label>
                          <input
                            type="date"
                            name="clinical.to"
                            className={inputCls}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-sm">
                          Position
                        </label>
                        <input
                          name="clinical.position"
                          placeholder="e.g., Clinical Placement – PSW"
                          className={inputCls}
                        />
                      </div>

                      <div>
                        <label className="mb-1 block font-semibold text-sm">
                          Duties / Responsibilities
                        </label>
                        <textarea
                          name="clinical.duties"
                          rows={5}
                          placeholder="e.g., assisted with ADLs, monitored vitals, maintained logs, collaborated with RNs…"
                          className={inputCls}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next4"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 6: INTERVIEW */}
              <fieldset
                ref={setStepRef(5)}
                aria-hidden={step !== 5}
                className={step === 5 ? "block" : "hidden"}
              >
                <legend className="sr-only">Section 6: Interview</legend>
                <p className="mb-4 text-sm text-gray-600">
                  Interviews are scheduled in <strong>Eastern Time (ET)</strong>{" "}
                  only: Mon–Fri 10:00 AM – 4:00 PM, Sat 09:00 AM – 12:00 PM.
                  Sundays unavailable.
                </p>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-1">
                    <label
                      htmlFor="interviewDate"
                      className="mb-1 block font-semibold text-sm"
                    >
                      Preferred Interview Date
                    </label>
                    <DatePicker
                      id="interviewDate"
                      name="interviewDate"
                      selected={date}
                      onChange={(d) => {
                        setDate(d);
                        // reset time when date changes
                        setInterviewTime("");
                      }}
                      minDate={new Date()}
                      filterDate={(d) => d.getDay() !== 0}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Select a date"
                      className="mt-1 border p-3 w-full"
                      wrapperClassName="w-full"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className="mb-1 block font-semibold text-sm">
                      Preferred Interview Time
                    </label>
                    <select
                      id="interviewTime"
                      name="interviewTime"
                      required
                      disabled={!date}
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="mt-1 border p-3 w-full"
                    >
                      <option value="" disabled>
                        {date ? "Select a time" : "Pick a date first"}
                      </option>
                      {visibleSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className={primaryBtnCls}
                    id="next5"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* STEP 7: DOCUMENTS */}
              <fieldset
                ref={setStepRef(6)}
                aria-hidden={step !== 6}
                className={step === 6 ? "block" : "hidden"}
              >
                <legend className="sr-only">Section 7: Documents</legend>

                <p className="mb-4 text-sm text-gray-600">
                  Please upload your <strong>resume (required)</strong>. You can
                  also attach any additional supporting files (optional).
                </p>

                {/* Resume (REQUIRED) */}
                <div className="mb-6">
                  <label
                    htmlFor="resume"
                    className="mb-1 block font-semibold text-sm"
                  >
                    Resume <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    required
                    onChange={(e) =>
                      setHasResume(!!e.currentTarget.files?.length)
                    }
                    accept=".pdf,.doc,.docx"
                    className={`block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-semibold cursor-pointer ${inputCls}`}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted: PDF, DOC, DOCX
                  </p>
                </div>

                {/* Other files (OPTIONAL, multiple) */}
                <div className="mb-6">
                  <label
                    htmlFor="docs"
                    className="mb-1 block font-semibold text-sm"
                  >
                    Other files
                  </label>
                  <input
                    id="docs"
                    name="docs"
                    type="file"
                    multiple
                    className={`block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:font-semibold cursor-pointer ${inputCls}`}
                  />
                  <ul className="mt-2 list-disc pl-6 text-sm text-gray-600">
                    <li>
                      Training Certificates (e.g., CPR, First Aid, Caregiver,
                      NCII, PSW, ECA, etc.)
                    </li>
                    <li>Vulnerable Sector Police Check / Police Clearance</li>
                    <li>Reference Letter(s) or Contact Information</li>
                    <li>Passport Copy</li>
                    <li>
                      Proof of Immigration Status (e.g., Work or Study Permit)
                    </li>
                  </ul>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className={secondaryBtnCls}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={primaryBtnCls}
                    disabled={isSubmitting || !hasResume}
                  >
                    {isSubmitting
                      ? "Sending..."
                      : toast.startsWith("✅")
                      ? "Sent"
                      : "Submit"}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
