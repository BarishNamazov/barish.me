import ics from "../../content/calendars/mete.ts";

export async function GET(): Promise<Response> {
  return new Response(ics.error ? ics.error.message : ics.value);
}
