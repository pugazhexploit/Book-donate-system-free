import { TubesCursor } from "@/components/ui/tube-cursor";

export default function DemoOne() {
  return (
    <div className="flex w-full items-center justify-center p-6 bg-slate-950">
      <TubesCursor
        title="Tubes"
        subtitle="Cursor"
        caption="WebGPU / WebGL • Click canvas to randomize colors"
        enableRandomizeOnClick={true}
        titleSize="text-5xl md:text-7xl lg:text-8xl"
        subtitleSize="text-3xl md:text-5xl lg:text-6xl"
        captionSize="text-sm md:text-base"
        className="w-full max-w-5xl rounded-3xl"
      />
    </div>
  );
}

export { DemoOne };
