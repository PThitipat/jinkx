"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/Nav"
import { AlertCircle, Shield } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function TermsPage() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-gradient-to-b from-black via-black/95 to-black/90 overflow-hidden">
      {/* animated background glow */}
      <motion.div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#ff4a4a]/30 blur-3xl"
        animate={{ y: [0, 20, -10, 0], opacity: [0.7, 0.4, 0.6, 0.7] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <motion.div
          className="container mx-auto px-4 md:px-6 py-10 space-y-8"
          initial="hidden"
          animate="visible"
        >
          {/* Important Notice */}
          <motion.div variants={itemVariants}>
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
            variants={containerVariants}
            className="space-y-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="flex items-center gap-3 px-1" variants={itemVariants}>
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
            </motion.div>

            <motion.div
              className="mt-2 rounded border border-white/10 bg-white/5/40 backdrop-blur-2xl overflow-hidden shadow-xl"
              variants={itemVariants}
            >
              <Accordion type="single" collapsible defaultValue="no-refunds">
                {/* No Refunds */}
                <motion.div variants={itemVariants}>
                  <AccordionItem value="no-refunds">
                    <AccordionTrigger className="px-4 md:px-6 text-white">
                      No Refunds
                    </AccordionTrigger>
                    <AccordionContent className="px-4 md:px-6 text-white/75 bg-white/5/40 backdrop-blur">
                    All purchases are final. Refunds are not provided under any circumstances.
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>

                {/* Sharing Strictly Prohibited */}
                <motion.div variants={itemVariants}>
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
                </motion.div>

                {/* No Tampering or Reverse Engineering */}
                <motion.div variants={itemVariants}>
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
                </motion.div>

                {/* No Loophole Exploitation */}
                <motion.div variants={itemVariants}>
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
                </motion.div>
              </Accordion>
            </motion.div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  )
}


