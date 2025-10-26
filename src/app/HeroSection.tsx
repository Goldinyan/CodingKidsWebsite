import dynamic from "next/dynamic"

const ShaderGradient = dynamic(
  () => import("shadergradient").then(mod => mod.ShaderGradient),
  { ssr: false }
)


export default function HeroSection() {
  return (
    <div className="w-full h-[500px]">
    <ShaderGradient
  shader="defaults"
  type="waterPlane"
  animate={"props" as any}
  color1="#845EC2"
  color2="#4D8076"
  color3="#ffffff"
  envPreset="dawn"
  reflection={0.8}
  uDensity={1.4}
  uSpeed={0.2}
  uStrength={1.5}
  rotationX={50}
  rotationY={0}
  rotationZ={-60}
  cameraZoom={9.1}
/>

    </div>
  )
}

