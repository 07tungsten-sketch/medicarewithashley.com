const USER = "ashley";
const DOMAIN = "watsoninsurancesd";
const TLD = "com";

export function getEmail() {
  return `${USER}@${DOMAIN}.${TLD}`;
}

interface ObfuscatedEmailProps {
  className?: string;
}

export default function ObfuscatedEmail({ className }: ObfuscatedEmailProps) {
  const email = getEmail();
  return (
    <a href={`mailto:${email}`} className={className}>
      {email}
    </a>
  );
}
