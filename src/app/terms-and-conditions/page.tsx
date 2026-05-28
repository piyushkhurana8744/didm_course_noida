import { Metadata } from "next";
import { TermsAndConditionsClient } from "./TermsAndConditionsClient";

export const metadata: Metadata = {
  title: "Terms and Conditions | ZICA Digital Academy Noida",
  description: "Read the terms, rules, and conditions for enrolling in digital marketing courses at Dayitwa Consultancy Services Pvt. Ltd. and ZICA Digital Academy Noida.",
};

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsClient />;
}
