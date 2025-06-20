"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BarChart2, Loader2 } from 'lucide-react';

interface ImpactSimulatorCardProps {
  onSimulateImpact: (actionDescription: string, communityClusters: string[]) => Promise<void>;
  simulationResult: Record<string, string> | null;
  isLoading: boolean;
}

export function ImpactSimulatorCard({ onSimulateImpact, simulationResult, isLoading }: ImpactSimulatorCardProps) {
  const [actionDescription, setActionDescription] = useState('');
  const [clusters, setClusters] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clusterArray = clusters.split(',').map(c => c.trim()).filter(c => c.length > 0);
    if (actionDescription && clusterArray.length > 0) {
      await onSimulateImpact(actionDescription, clusterArray);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <BarChart2 className="mr-2 h-6 w-6 text-primary" />
          Impact Simulation
        </CardTitle>
        <CardDescription>
          Simulate the potential impact of proposed actions across community clusters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="actionDescription">Action Description</Label>
            <Textarea
              id="actionDescription"
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
              placeholder="Describe the proposed action..."
              required
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="communityClusters">Community Clusters (comma-separated)</Label>
            <Input
              id="communityClusters"
              value={clusters}
              onChange={(e) => setClusters(e.target.value)}
              placeholder="e.g., Local Farmers, Small Businesses, Youth Groups"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading || !actionDescription || !clusters} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Simulate Impact
          </Button>
        </form>

        {simulationResult && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold font-headline">Simulation Results:</h3>
            {Object.entries(simulationResult).map(([cluster, impact]) => (
              <div key={cluster} className="p-3 border rounded-md bg-muted/50">
                <p className="font-medium">{cluster}:</p>
                <p className="text-sm text-muted-foreground">{impact}</p>
              </div>
            ))}
          </div>
        )}
         {!simulationResult && !isLoading && (
            <p className="mt-6 text-sm text-muted-foreground">Simulation results will appear here.</p>
        )}
      </CardContent>
    </Card>
  );
}
