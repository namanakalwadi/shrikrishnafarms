import Image from "next/image";

export default function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <Image
      src="/logo/logo.png"
      alt="Shri Krishna Farms Logo"
      width={size}
      height={size}
      className="rounded-lg object-contain shrink-0"
    />
  );
}
