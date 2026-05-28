import { Metadata } from "next";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | ZICA Digital Academy Noida",
  description: "Read the Privacy Policy of Delhi Institute of Digital Marketing (DIDM) and ZICA Digital Academy Noida Campus.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
