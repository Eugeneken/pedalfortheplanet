import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Do I need to bring my own bike?",
    a: "Yes, participants are expected to bring their own bicycle in good working condition. However, we are partnering with local bike rental shops in Nairobi and Kiambu — rental options will be announced 60 days before the event. All bikes must pass a safety check at the start line.",
  },
  {
    q: "What is included in the entry fee?",
    a: "All entries include an event jersey, finisher medal, and certificate of participation. Water is provided at all aid stations along the route.",
  },
  {
    q: "Is the event safe for children and families?",
    a: "Absolutely. The 5 km Fun Ride is designed for riders aged 8 and above, with a flat, traffic-controlled route. Children under 16 must be accompanied by an adult. Safety marshals are positioned at every turn and at all aid stations.",
  },
  {
    q: "What is your refund and cancellation policy?",
    a: "Registrations are non-refundable but are transferable to another participant up to 7 days before the event. In the event of cancellation due to extreme weather or force majeure, registrations will be carried over to the next edition or refunded at 80%.",
  },
  {
    q: "How do I pay via M-PESA?",
    a: "Our payment platform Pesapal supports M-PESA payments directly. After submitting the registration form, you will receive an STK push to your M-PESA number. Alternatively, you can pay via Visa or Mastercard. A confirmation email will follow within 5 minutes of successful payment.",
  },
  {
    q: "Are there aid stations along the route?",
    a: "Yes! All routes have multiple aid stations with water. The 25 km route has 4 aid stations, the 16 km has 3, and the 5 km has 2. Medics are stationed at each aid point.",
  },
  {
    q: "What safety gear is required?",
    a: "A properly fitted cycling helmet is mandatory for all participants. Gloves and padded shorts are strongly recommended. The event provides basic first aid but recommends all riders carry a small puncture repair kit and a personal ID.",
  },
  {
    q: "How will the funds raised be used?",
    a: "100% of proceeds go to the Global Shapers Mombasa Hub's climate portfolio: 50% to tree planting partnerships with certified reforestation groups, 30% to youth climate education programs in schools, and 20% to community solar and clean water projects.",
  },
  {
    q: "Can I register on the day of the event?",
    a: "Day-of registration is strongly discouraged. Please pre-register online to guarantee your spot. If the event reaches full capacity before race day, on-site registration will be closed entirely. We cannot guarantee entry for walk-ins.",
  },
  {
    q: "How do I get to Tatu City?",
    a: "Tatu City is located on the Nairobi–Thika Road (A2), approximately 25 km from Nairobi CBD. Take a matatu to Ruiru town and connect via boda boda or taxi to Tatu City Gate. Participants are encouraged to arrange their own transport or carpool with fellow riders.",
  },
];

export default function EventFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="py-20 md:py-28 bg-gray-50 px-5" id="faq">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-14">
          <span className="text-xs font-black tracking-widest text-[#0075E1] uppercase">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2 mb-4">FAQ</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-3"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-bold text-gray-900 text-sm leading-snug">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#0075E1] flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}