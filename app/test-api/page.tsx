'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function runDiagnostics() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/test-wp-api');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white pt-20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">WordPress API 诊断工具</h1>
        
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '测试中...' : '运行诊断'}
        </button>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h2 className="text-red-800 font-semibold mb-2">错误</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">测试摘要</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">总测试数</p>
                  <p className="text-2xl font-bold">{results.summary.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">成功</p>
                  <p className="text-2xl font-bold text-green-600">{results.summary.successful}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">失败</p>
                  <p className="text-2xl font-bold text-red-600">{results.summary.failed}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">WordPress 基础 URL</p>
                <p className="font-mono text-sm">{results.baseUrl}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">详细测试结果</h2>
              {results.tests.map((test: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${
                    test.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{test.name}</h3>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        test.success
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {test.success ? '✓ 成功' : '✗ 失败'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-mono">{test.url}</span>
                  </p>
                  {test.status && (
                    <p className="text-sm">
                      <span className="font-semibold">状态码:</span> {test.status}
                    </p>
                  )}
                  {test.contentType && (
                    <p className="text-sm">
                      <span className="font-semibold">Content-Type:</span> {test.contentType}
                    </p>
                  )}
                  {test.bodyPreview && (
                    <div className="mt-2 p-2 bg-white rounded text-xs font-mono">
                      {test.bodyPreview}
                    </div>
                  )}
                  {test.error && (
                    <p className="mt-2 text-sm text-red-600">
                      <span className="font-semibold">错误:</span> {test.error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">下一步操作</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                {results.summary.allPassed ? (
                  <>
                    <li>✓ 所有测试通过！WordPress API 正常工作</li>
                    <li>现在可以访问 <code className="bg-blue-100 px-1 rounded">/store</code> 页面查看商品</li>
                  </>
                ) : (
                  <>
                    <li>检查 WordPress 站点是否已安装 WooCommerce 插件</li>
                    <li>确认 WooCommerce Store API 已启用</li>
                    <li>验证 WordPress URL 是否正确：{results.baseUrl}</li>
                    <li>在浏览器中直接访问 API 端点测试</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
