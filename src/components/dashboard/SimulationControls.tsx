
import { useState } from 'react';
import { useSimulationData } from '@/hooks/useSimulationData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, RefreshCw, Database, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SimulationControls() {
  const { isInitialized, loading, initialize, reset, getData } = useSimulationData();
  const [showDetails, setShowDetails] = useState(false);
  
  const data = getData();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Simulation Controls
          {isInitialized && <Badge variant="outline" className="ml-2 bg-green-50">Active</Badge>}
        </CardTitle>
        <CardDescription>
          Manage test data to verify application functionality
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isInitialized ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Simulation Data</AlertTitle>
            <AlertDescription>
              Initialize test data to verify all functions and logic are working properly.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Simulation Mode Active</AlertTitle>
            <AlertDescription>
              Using test data to verify application functionality.
              {showDetails && data && (
                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Staff Members:</strong> {data.staff?.length || 0}</p>
                  <p><strong>Menu Items:</strong> {data.menuItems?.length || 0}</p>
                  <p><strong>Inventory Items:</strong> {data.inventoryItems?.length || 0}</p>
                  <p><strong>Tables:</strong> {data.tables?.length || 0}</p>
                  <p><strong>Reservations:</strong> {data.reservations?.length || 0}</p>
                  <p><strong>Orders:</strong> {data.orders?.length || 0}</p>
                  <p><strong>Kitchen Orders:</strong> {data.kitchenOrders?.length || 0}</p>
                  <p><strong>Shifts:</strong> {data.shifts?.length || 0}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
            disabled={!isInitialized}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
        </div>
        <div className="flex gap-2">
          {isInitialized ? (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={reset}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Reset Data
            </Button>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={initialize}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Initialize Test Data
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
