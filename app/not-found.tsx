'use client'; // ต้องใส่บรรทัดนี้สำหรับ App Router ที่ใช้ client-side features

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Frown } from 'lucide-react'; // ใช้ไอคอนน่ารักๆ จาก lucide-react

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6 text-center text-gray-800"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-8 p-6 bg-white rounded-lg shadow-xl"
        variants={itemVariants}
      >
        <motion.div
          className="text-6xl text-purple-600 mb-4"
          animate={{
            y: [0, -10, 0, -5, 0],
            rotate: [0, -5, 0, 5, 0]
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
        >
          <Frown size={80} strokeWidth={1.5} /> {/* ไอคอนหน้าเศร้า */}
        </motion.div>

        <motion.h1
          className="text-5xl font-extrabold text-purple-700 mb-4"
          variants={itemVariants}
        >
          อุปส์\! 404
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 mb-6 max-w-md mx-auto"
          variants={itemVariants}
        >
          ดูเหมือนว่าหน้าที่คุณกำลังมองหาจะไม่อยู่ที่นี่แล้วล่ะ ลองกลับไปที่หน้าหลักกันนะ
        </motion.p>

        <motion.div variants={itemVariants}>
          <Link href="/" passHref>
            <motion.a
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-pink-500 hover:bg-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 กลับหน้าหลักกัน
            </motion.a>
          </Link>
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-8 text-sm text-gray-500 opacity-70"
        variants={itemVariants}
      >
        อย่าเพิ่งท้อนะ ลองเช็ค URL อีกครั้ง หรือกดปุ่มข้างบนเลย\!
      </motion.p>
    </motion.div>
  );
}