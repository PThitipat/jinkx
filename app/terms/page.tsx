"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Nav"
import { AlertCircle, Shield } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-black via-black/95 to-black/90">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-red-900/30 border border-red-500/40 rounded shadow-2xl backdrop-blur-xl">
              <CardContent className="p-5 md:p-6 flex gap-4">
                <div className="mt-1">
                  <AlertCircle className="w-6 h-6 text-red-200 drop-shadow" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-red-100">
                    Important Notice
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-red-100/90">
                    Violation of any terms outlined below may result in immediate termination of your access
                    to JinkX services without prior notice or refund.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Usage Policy */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10 border border-white/20 backdrop-blur">
                <Shield className="w-5 h-5 text-white/90" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white">
                  Usage Policy
                </h2>
                <p className="text-sm md:text-base text-white/60">
                  Rules regarding how you can use our products.
                </p>
              </div>
            </div>

            <div className="mt-2 rounded border border-white/10 bg-white/5/40 backdrop-blur-2xl overflow-hidden shadow-xl">
              <Accordion type="single" collapsible defaultValue="no-refunds">
                {/* No Refunds */}
                <AccordionItem value="no-refunds">
                  <AccordionTrigger className="px-4 md:px-6 text-white">
                    No Refunds
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 text-white/75 bg-white/5/40 backdrop-blur">
                    All purchases are final. Refunds are not provided under any circumstances.
                  </AccordionContent>
                </AccordionItem>

                {/* Sharing Strictly Prohibited */}
                <AccordionItem value="sharing">
                  <AccordionTrigger className="px-4 md:px-6 text-white">
                    <span className="text-red-400 font-semibold">
                      Sharing Key Strictly Prohibited
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 space-y-3 backdrop-blur">
                    <p className="text-sm md:text-base text-white/85">
                      The product is licensed for use by a single user only. Sharing your access or license
                      key with others is strictly prohibited. This includes letting friends or family use your
                      license, posting your key in public or private forums, or using your license on multiple
                      devices simultaneously.
                    </p>
                    <div className="rounded border border-red-500/50 bg-red-900/40 px-4 py-3 text-sm md:text-base text-red-100 shadow-md">
                      Violation results in immediate, permanent termination of your license with no refund.
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* No Tampering or Reverse Engineering */}
                <AccordionItem value="tamper">
                  <AccordionTrigger className="px-4 md:px-6 text-white">
                    No Tampering or Reverse Engineering
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 text-sm md:text-base text-white/80 space-y-3 bg-white/5/40 backdrop-blur">
                    <p>
                      Attempting to reverse engineer, decompile, modify, or tamper with the product in any way
                      is prohibited. This includes attempts to bypass security features, modify code, extract
                      source code, or create unauthorized derivatives of our software.
                    </p>
                    <p>
                      Violations will result in immediate account termination without refund.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                {/* No Loophole Exploitation */}
                <AccordionItem value="loophole">
                  <AccordionTrigger className="px-4 md:px-6 text-white">
                    No Loophole Exploitation
                  </AccordionTrigger>
                  <AccordionContent className="px-4 md:px-6 text-sm md:text-base text-white/80 space-y-3 bg-white/5/40 backdrop-blur">
                    <p>
                      You agree not to attempt to find or exploit loopholes in these terms of service or in the
                      product&apos;s functionality. This includes attempting to exploit bugs, using the product
                      in ways it was not intended, or trying to circumvent limitations of trial periods or license
                      restrictions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}


