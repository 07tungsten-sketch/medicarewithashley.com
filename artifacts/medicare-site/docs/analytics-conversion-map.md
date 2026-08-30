# Medicare Inquiry Conversion Map

The site sends the following GA4 events through the existing delayed Google Analytics
loader. Every event includes the current `page_path`, `page_title`, a
`cta_placement`, and any UTM values captured from the visitor's landing URL and
preserved in the browser for later interactions.

| User action | GA4 event | Recommended GA4 key event? |
| --- | --- | --- |
| Clicks a phone link | `phone_click` | Yes, as a lead-intent signal |
| Begins booking through the local schedule page or a direct GoHighLevel booking CTA | `schedule_start` | Yes |
| Booking calendar loads successfully | `appointment_booking_start` | Yes, as a booking-intent signal |
| Completes an appointment booking in the scheduling widget | `appointment_booking_completion` | Yes; this is the primary booked-appointment conversion |
| Successfully submits the contact form | `contact_form_completion` | Yes |
| Successfully submits the San Diego Medicare guide form | `guide_request_completion` | Yes, if guide requests are qualified leads |
| Clicks an email link | `email_click` | Yes, as a lead-intent signal |
| Clicks through to Ashley's YouTube channel | `video_engagement` | No; use as an assisted-conversion signal |

## Event dimensions

- `page_path`: route where the action happened
- `page_title`: document title at the time of the action
- `cta_placement`: nearest labeled CTA or page section, such as `hero-section`,
  `contact_form`, or `mobile_sticky_schedule`
- `destination`: normalized action destination for phone, email, `/schedule`, or the direct GoHighLevel booking widget
- `form_name` and `form_id`: non-PII identifiers for the submitted form
- `booking_provider`: identifies the scheduling platform without sending appointment details
- `engagement_type` and `platform`: identifies YouTube channel engagement
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`:
  retained when present on the original landing URL

No form field values, email addresses, phone numbers, message text, or other
personally identifying information are sent to GA4.

GoHighLevel completion events are accepted only when the message comes from
`https://link.agent-crm.com`, comes from the exact embedded iframe window, and
matches the embed's successful-submission `set-sticky-contacts` message shape.