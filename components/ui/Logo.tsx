import Link from 'next/link'
import Image from 'next/image'

interface Props {
  href?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { width: 80,  height: 17 },
  md: { width: 110, height: 23 },
  lg: { width: 160, height: 34 },
}

export default function Logo({ href = '/', size = 'md', className = '' }: Props) {
  const { width, height } = sizes[size]
  const img = (
    <Image
      src="/logo.svg"
      alt="Formify"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
  return href ? <Link href={href}>{img}</Link> : img
}
