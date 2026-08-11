import React, { useState, useEffect } from 'react';
import { onLCP, onFID, onCLS, onINP, onFCP, onTTFB } from 'web-vitals';

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    LCP: null,
    FID: null,
    CLS: null,
    INP: null,
    FCP: null,
    TTFB: null
  });

  const [performanceScore, setPerformanceScore] = useState(null);

  useEffect(() => {
    const updateMetric = (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value
      }));
    };

    // Core Web Vitals
    onLCP(updateMetric);
    onFID(updateMetric);
    onCLS(updateMetric);
    onINP(updateMetric);
    
    // Other metrics
    onFCP(updateMetric);
    onTTFB(updateMetric);
  }, []);

  useEffect(() => {
    // Calculate performance score
    const calculateScore = () => {
      let score = 100;
      
      // LCP (2.5s target)
      if (metrics.LCP) {
        const lcpPenalty = Math.max(0, (metrics.LCP - 2.5) * 20);
        score -= lcpPenalty;
      }
      
      // FID (100ms target)
      if (metrics.FID) {
        const fidPenalty = Math.max(0, (metrics.FID - 100) * 0.5);
        score -= fidPenalty;
      }
      
      // CLS (0.1 target)
      if (metrics.CLS) {
        const clsPenalty = Math.max(0, (metrics.CLS - 0.1) * 100);
        score -= clsPenalty;
      }
      
      // INP (200ms target)
      if (metrics.INP) {
        const inpPenalty = Math.max(0, (metrics.INP - 200) * 0.3);
        score -= inpPenalty;
      }
      
      return Math.max(0, Math.min(100, score));
    };

    setPerformanceScore(calculateScore());
  }, [metrics]);

  const getMetricStatus = (value, target, unit) => {
    if (value === null) return { status: 'loading', color: 'gray' };
    
    const isGood = value <= target;
    const isNeedsImprovement = value <= target * 1.5;
    
    return {
      status: isGood ? 'good' : isNeedsImprovement ? 'needs-improvement' : 'poor',
      color: isGood ? 'green' : isNeedsImprovement ? 'yellow' : 'red',
      value: unit === 'seconds' ? value.toFixed(2) : 
             unit === 'milliseconds' ? Math.round(value) :
             unit === 'score' ? value.toFixed(3) : value
    };
  };

  const metricsConfig = [
    {
      name: 'LCP',
      fullName: 'Largest Contentful Paint',
      target: 2.5,
      unit: 'seconds',
      description: 'Time until the largest content element is rendered'
    },
    {
      name: 'FID',
      fullName: 'First Input Delay',
      target: 100,
      unit: 'milliseconds',
      description: 'Time from first interaction to browser response'
    },
    {
      name: 'CLS',
      fullName: 'Cumulative Layout Shift',
      target: 0.1,
      unit: 'score',
      description: 'Measure of visual stability'
    },
    {
      name: 'INP',
      fullName: 'Interaction to Next Paint',
      target: 200,
      unit: 'milliseconds',
      description: 'Responsiveness to user interactions'
    },
    {
      name: 'FCP',
      fullName: 'First Contentful Paint',
      target: 1.8,
      unit: 'seconds',
      description: 'Time until first text or image is rendered'
    },
    {
      name: 'TTFB',
      fullName: 'Time to First Byte',
      target: 0.8,
      unit: 'seconds',
      description: 'Time until first byte of response is received'
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Performance Dashboard
      </h2>
      
      {/* Performance Score */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Performance Score
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Based on Core Web Vitals
            </p>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
            {performanceScore !== null ? Math.round(performanceScore) : '--'}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricsConfig.map((config) => {
          const metric = getMetricStatus(metrics[config.name], config.target, config.unit);
          
          return (
            <div
              key={config.name}
              className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {config.name}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  metric.status === 'good' ? 'bg-green-100 text-green-800' :
                  metric.status === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                  metric.status === 'poor' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {metric.status === 'loading' ? 'Loading...' :
                   metric.status === 'good' ? 'Good' :
                   metric.status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                </span>
              </div>
              
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {metric.value !== undefined ? metric.value : '--'}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                  {config.unit === 'seconds' ? 's' :
                   config.unit === 'milliseconds' ? 'ms' : ''}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {config.description}
              </p>
              
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Target: {config.target}{config.unit === 'seconds' ? 's' :
                         config.unit === 'milliseconds' ? 'ms' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Tips */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Performance Tips
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Optimize images: Use WebP format and lazy loading</li>
          <li>• Minimize JavaScript: Code split and tree-shake</li>
          <li>• Use CDN for static assets</li>
          <li>• Enable compression (gzip/brotli)</li>
          <li>• Preload critical resources</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceDashboard;