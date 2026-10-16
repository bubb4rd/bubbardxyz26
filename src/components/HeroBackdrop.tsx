import HeroShader from "./HeroShader";

/**
 * Graphite scene behind the hero. The CSS layers are the still fallback (and
 * what shows before the first frame); the shader fades in over them.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="hero-scene absolute inset-0" />
      <div className="hero-halftone absolute inset-0" />
      <HeroShader />
    </div>
  );
}
