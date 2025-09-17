import React from 'react';
import { useData } from '../contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RefreshCw, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

const DataSourceStatus: React.FC = () => {
  const { dataSourcesStatus, isRefreshing, lastRefresh, nextRefresh, refreshDataSources } = useData();

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'Never';
    return new Date(timeString).toLocaleTimeString();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Data Sources Status</CardTitle>
        <button
          onClick={refreshDataSources}
          disabled={isRefreshing}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dataSourcesStatus.length === 0 ? (
            <p className="text-sm text-gray-500">No data sources configured</p>
          ) : (
            dataSourcesStatus.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(source.status)}
                  <div>
                    <p className="font-medium text-sm">{source.source_name}</p>
                    {source.error_message && (
                      <p className="text-xs text-red-600">{source.error_message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(source.status)}>
                    {source.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {source.reliability_percent}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Last refresh: {formatTime(lastRefresh)}</span>
            <span>Next refresh: {formatTime(nextRefresh)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceStatus;
