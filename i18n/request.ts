import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["bn", "en"];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale)) {
    locale = "bn";
  }

  try {
    const bnMessages = (await import("../messages/bn.json")).default;
    const enMessages = (await import("../messages/en.json")).default;
    const messages = locale === "bn" ? bnMessages : enMessages;
    return {
      locale,
      messages,
    };
  } catch {
    notFound();
  }
});
