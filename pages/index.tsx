import type { NextPage } from 'next'

const Home: NextPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Data Library API</h1>
      <p className="mt-2">Welcome to the Data Library API built with Next.js and TypeScript.</p>
      <p className="mt-2">Visit <a className="text-blue-500 underline" href="/api/docs">/api/docs</a> for Swagger documentation.</p>
      <p className="mt-2">Manage outcomes at <a className="text-blue-500 underline" href="/outcomes">/outcomes</a>.</p>
    </div>
  )
}

export default Home
