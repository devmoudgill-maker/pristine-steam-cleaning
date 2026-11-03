// Legal pages. Numbers come from POLICY in config.mjs so they change in one place.
import { BIZ, POLICY as P, PRICES } from './config.mjs';

const contact = `<p>Questions? Call or text us at <a href="tel:${BIZ.tel}">${BIZ.phone}</a>${BIZ.email ? ` or email <a href="mailto:${BIZ.email}">${BIZ.email}</a>` : ''}.</p>`;

export const LEGAL = [
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    description: 'The terms that apply when you book carpet, upholstery or tile cleaning with Pristine Steam Cleaning in the Houston area.',
    sections: [
      ['Agreement', `<p>These Terms & Conditions apply to every service provided by ${BIZ.name} ("we", "us") to you, the customer. By booking a service, approving a quote, or letting us begin work, you agree to these terms and to our <a href="/service-agreement/">Service Agreement</a> and <a href="/privacy/">Privacy Policy</a>.</p>`],
      ['Our services', `<p>We provide residential carpet cleaning, upholstery cleaning, and tile and grout cleaning in Houston and nearby cities. We use hot water extraction and professional cleaning solutions. We may decline any job that we believe could damage the material or is unsafe to perform.</p>`],
      ['Quotes and pricing', `<p>Prices on our website and estimates given by phone, text or online are based on the information you give us. Your final price is confirmed during a walkthrough at your home <strong>before</strong> any cleaning starts. If the job is larger or different from what was described, we will tell you the new price and you can approve it, change the scope, or cancel without charge at that point.</p><p>Visits have a $${PRICES.minimum} minimum unless a promotion such as the ${PRICES.specialRooms} Room Special says otherwise. Promotions cannot be combined unless we say so in writing.</p>`],
      ['Booking, rescheduling and cancellations', `<p>We give you an arrival window when you book. Please reschedule or cancel as early as you can so we can offer the time to another customer.</p><ul><li>More than 48 hours' notice: no fee.</li><li>24 to 48 hours' notice: $${P.cancelFeeMid} fee.</li><li>Less than 24 hours' notice, or no one home at the scheduled time: $${P.cancelFeeShort} fee.</li></ul><p>We may waive fees for emergencies or severe weather. If we need to reschedule, we will contact you as soon as possible and there is no charge to you.</p>`],
      ['Your responsibilities', `<ul><li>An adult (18+) must be present to let us in, complete the walkthrough and approve the price.</li><li>Provide access to working water and electricity.</li><li>Move small, fragile and valuable items, and anything on the floor, before we arrive.</li><li>Keep children and pets away from the work area while we clean and until the floors are dry.</li><li>Tell us about any known damage, loose seams, recent repairs, or delicate fabrics before we start.</li></ul>`],
      ['Results and limitations', `<p>We work hard to remove every stain we can, but some cannot be removed. This includes bleach spots, dye transfers, burns, rust, permanent pet urine damage, sun fading and wear. We will point out anything we expect not to come out during the walkthrough.</p><p>We are not responsible for pre-existing damage, color loss or shrinkage caused by a manufacturer defect or an earlier cleaning, seams or carpet that were not installed correctly, or fabrics that are not labeled as safe for wet cleaning.</p>`],
      ['Payment', `<p>Payment is due when the work is finished, unless we have agreed otherwise in writing. We accept major cards, including Tap to Pay, through our booking system. Invoices not paid within ${P.lateFeeDays} days may be charged a late fee of ${P.lateFeePct}% of the unpaid balance.</p>`],
      ['If something is not right', `<p>If you are not happy with an area we cleaned, contact us within ${P.reportHours} hours of the service. We will come back and re-clean that area at no charge. Re-cleaning is our first remedy and must be requested before any refund is considered.</p>`],
      ['Damage and liability', `<p>We take care in every home. If you believe we caused damage, tell us within ${P.reportHours} hours and give us a chance to inspect it. Our total liability for any claim is limited to the amount you paid for the service, except where Texas law does not allow that limit. We are not liable for indirect or consequential damages.</p>`],
      ['Photos', `<p>We may take before and after photos of the areas we clean to document the job. We will not post photos online that show your home's address, your family or personal items without your permission.</p>`],
      ['Governing law', `<p>These terms are governed by the laws of the State of Texas. Any dispute will be handled in the county in Texas where the service was performed.</p>`],
      ['Changes to these terms', `<p>We may update these terms from time to time. The version on this page on the date of your service is the one that applies.</p>${contact}`],
    ],
  },
  {
    slug: 'service-agreement',
    title: 'Your Pristine Experience & Service Agreement',
    description: 'What to expect before, during and after your Pristine Steam Cleaning visit, plus Pristine Club membership terms.',
    sections: [
      ['Before we arrive', `<ul><li>You will receive a confirmation with your date and arrival window.</li><li>Vacuum high-traffic areas if you can and pick up small items, toys and anything breakable.</li><li>Plan where pets will stay during the cleaning.</li><li>Let us know about parking, gate codes or building rules ahead of time.</li></ul><p>See our full <a href="/pricing/#prep">prep checklist</a>.</p>`],
      ['The walkthrough', `<p>When we arrive, we walk through each area with you, look at stains and traffic lanes, and point out anything that may not come out. We confirm your final price before we begin. Nothing is cleaned until you approve it.</p>`],
      ['The clean', `<p>Every clean follows the same four steps: inspect and pre-treat, agitate, hot water extraction, then groom and speed dry. Hard furniture may be protected with tabs or blocks under the legs; please leave them in place until the carpet is fully dry.</p>`],
      ['After we leave', `<ul><li>Most carpet is dry to the touch within a few hours. Full drying can take longer on humid days.</li><li>Run your AC and ceiling fans to speed up drying.</li><li>Walk on damp carpet in clean socks only, and take care on hard floors next to wet carpet since they can be slippery.</li><li>Keep pets and kids off the carpet until it is dry.</li><li>If a spot reappears after drying ("wicking"), contact us within ${P.reportHours} hours and we will come back to treat it.</li></ul>`],
      ['Pristine Club membership', `<p>The Pristine Club is a monthly membership for $${PRICES.club} per month. Membership includes:</p><ul><li>Four seasonal deep cleanings per year, each covering up to ${P.clubRooms} carpeted rooms.</li><li>50% off additional services booked on your member cleanings.</li><li>Priority booking, and same-day booking when spots are available.</li><li>Refer a friend: when someone you refer books and pays for a service, your next cleaning is free.</li><li>Member-only offers we share throughout the year.</li></ul><p>Membership is billed monthly to the card on file. Seasonal cleanings are scheduled about every three months and do not roll over if skipped. You can cancel at any time by contacting us; cancellation takes effect at the end of the current billing month. Our <a href="/terms/">Terms & Conditions</a> apply to every member cleaning.</p>`],
      ['Our promise', `<p>We will show up on time, treat your home with care, give you an honest price before we begin, and make it right if something isn't right.</p>${contact}`],
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    description: 'How Pristine Steam Cleaning collects, uses and protects your personal information.',
    sections: [
      ['Who we are', `<p>${BIZ.name} is a residential carpet cleaning company serving Houston, Texas and nearby cities. This policy explains what information we collect, how we use it, and the choices you have.</p>`],
      ['What we collect', `<ul><li><strong>Information you give us:</strong> your name, phone number, email, service address, ZIP code, details about the job, and any photos you send.</li><li><strong>Payment information:</strong> handled by our payment processor. We do not store full card numbers.</li><li><strong>Website information:</strong> basic technical data such as browser type and pages viewed, which our web host may log. This website does not use advertising cookies.</li></ul>`],
      ['How we use it', `<ul><li>To respond to quote requests and schedule your service.</li><li>To send appointment confirmations, reminders and invoices.</li><li>To manage Pristine Club memberships.</li><li>To follow up on your service and ask for feedback or a review.</li><li>To send occasional offers, only if you have agreed to receive them.</li></ul>`],
      ['Text messages', `<p>If you give us your phone number, we may text you about your quote and appointments. Message and data rates may apply. Reply STOP to opt out of marketing texts at any time; we may still send messages needed for a service you booked.</p>`],
      ['Who we share it with', `<p>We do not sell your personal information. We share it only with service providers that help us run the business, such as our scheduling and invoicing software (Jobber), our payment processor (Stripe), and our website host, and only as needed for them to do that work. We may also share information if the law requires it.</p>`],
      ['How long we keep it', `<p>We keep customer records for as long as needed to provide services, keep accurate business and tax records, and resolve disputes. After that, we delete or anonymize it.</p>`],
      ['Your choices', `<p>You can ask us to see, correct or delete the personal information we hold about you, or to stop sending you marketing messages. Contact us using the details below and we will respond within a reasonable time, as required by Texas law.</p>`],
      ['Security', `<p>We use reasonable safeguards to protect your information. No method of storage or transmission is completely secure, but we work to keep your information safe.</p>`],
      ['Children', `<p>Our services and website are meant for adults. We do not knowingly collect information from children under 13.</p>`],
      ['Changes to this policy', `<p>We may update this policy. The effective date at the top of this page shows when it last changed.</p>${contact}`],
    ],
  },
];
