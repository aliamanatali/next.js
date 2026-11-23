import { Suspense } from 'react'
import Link from 'next/link'

async function Results({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page = '1' } = await searchParams
  return <h1 id="results">Results page {page}</h1>
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  return (
    <main>
      <Suspense>
        <Results searchParams={searchParams} />
      </Suspense>
      <Link href="/s?q=1&page=2" id="to-page-2">
        Page 2
      </Link>
      <Link href="/s?q=1" id="to-page-1">
        Page 1
      </Link>
      <Link href="/s?q=1#a" id="to-page-1-section-a">
        Page 1, section A
      </Link>
      <section id="a" style={{ height: '150vh' }}>
        Section A
      </section>
    </main>
  )
}
