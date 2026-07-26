import { motion } from "framer-motion"

export function WaterBlob() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[28rem] items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.05, 0.98, 1], rotate: [0, 4, -3, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute inset-6 rounded-[42%_58%_52%_48%/45%_45%_55%_55%] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_18%,rgba(34,211,238,0.8)_62%,rgba(14,165,233,0.92)_100%)] shadow-[0_30px_90px_rgba(14,165,233,0.28)]"
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-8 right-12 h-20 w-20 rounded-full bg-white/55 blur-md"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute left-10 top-14 h-16 w-16 rounded-full bg-white/45 blur-md"
      />
    </div>
  )
}
