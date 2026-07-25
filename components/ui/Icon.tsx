import Image from 'next/image'

interface Props {
  size?: number
  className?: string
}

export default function FormifyIcon({ size = 32, className = '' }: Props) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      width={size}
      height={size}
      className={className}
    />
  )
}
