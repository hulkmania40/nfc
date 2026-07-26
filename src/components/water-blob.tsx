export function WaterBlob() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[28rem] items-center justify-center">
      <div className="absolute inset-6 rounded-[42%_58%_52%_48%/45%_45%_55%_55%] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.9),rgba(255,255,255,0.15)_18%,rgba(34,211,238,0.8)_62%,rgba(14,165,233,0.92)_100%)] shadow-[0_30px_90px_rgba(14,165,233,0.28)]" />
      <div className="absolute bottom-8 right-12 h-20 w-20 rounded-full bg-white/55 blur-md" />
      <div className="absolute left-10 top-14 h-16 w-16 rounded-full bg-white/45 blur-md" />
    </div>
  )
}
