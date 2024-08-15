import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { QUERY_GPT } from '../graphql/openai'

const GPTQuery: React.FC = () => {
  const [queryText, setQueryText] = useState('')
  const [fetchGPTResponse, { data, loading, error }] = useLazyQuery(QUERY_GPT)

  const handleQuery = async () => {
    if (!queryText.trim()) return
    fetchGPTResponse({ variables: { prompt: queryText } })
    setQueryText('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
      <div className="flex-1">
  <a href="/" className="p-2 normal-case text-xl text-black">
    GPT Query
  </a>
</div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <h1 className="card-title self-center text-2xl font-bold mb-4">
              Ask GPT
            </h1>
            <div className="form-control w-full">
              <div className="join">
                <input
                  type="text"
                  placeholder="Enter your query..."
                  className="join-item flex-grow input input-bordered input-md input-primary"
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
                <button
                  className="join-item btn btn-square btn-md btn-primary"
                  onClick={handleQuery}
                  disabled={loading}
                >
                  Send
                </button>
              </div>
            </div>
            <div className="space-y-4 w-full mt-4">
              {loading && (
                <div className="flex justify-center">
                  <span className="loading loading-spinner"></span> Loading...
                </div>
              )}
              {error && <p className="text-error">Error: {error.message}</p>}
              {data && (
                <div className="bg-base-200 p-4 rounded">
                  <p>{data.getOpenAi.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GPTQuery
