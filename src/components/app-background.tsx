export function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(167,243,255,0.45),_transparent_34%),radial-gradient(circle_at_80%_10%,_rgba(186,230,253,0.25),_transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(239,246,255,0.72))]" />
      <div className="absolute -left-20 top-[-120px] h-96 w-96 rounded-full bg-cyan-300/35 blur-3xl" />
      <div className="absolute right-[-140px] top-36 h-[30rem] w-[30rem] rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-[28rem] bg-[linear-gradient(180deg,transparent,rgba(238,250,255,0.72))]" />
    </div>
  )
}
