import Link from 'next/link'

export const getStaticProps = async () => ({ props: { page: 'landing' } })

export default function Page({ page }: { page: string }) {
  return (
    <>
      <p id="page">{page}</p>
      <Link href="/" id="to-root">
        /
      </Link>
      <Link href="/index" id="to-index">
        /index
      </Link>
      <Link href="/about" id="to-about">
        /about
      </Link>
    </>
  )
}
