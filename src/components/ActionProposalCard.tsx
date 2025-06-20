import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from 'lucide-react';

interface ActionProposalCardProps {
  civicScroll: string | null;
  impactResult: Record<string, string> | null;
}

export function ActionProposalCard({ civicScroll, impactResult }: ActionProposalCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-headline">
          <Lightbulb className="mr-2 h-6 w-6 text-primary" />
          Action Proposals
        </CardTitle>
        <CardDescription>
          Consider these points when formulating actions based on the civic input and impact simulation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {civicScroll && (
          <div>
            <h4 className="font-medium mb-1">Key Themes from Civic Scroll:</h4>
            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md whitespace-pre-wrap max-h-40 overflow-y-auto">
              {civicScroll.length > 300 ? `${civicScroll.substring(0, 300)}...` : civicScroll}
            </p>
          </div>
        )}
        {impactResult && (
           <div>
            <h4 className="font-medium mb-1">Considerations from Impact Simulation:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {Object.entries(impactResult).slice(0,3).map(([cluster, impact]) => (
                 <li key={cluster}><strong>{cluster}:</strong> {impact.length > 100 ? `${impact.substring(0,100)}...` : impact}</li>
              ))}
            </ul>
          </div>
        )}
        {!civicScroll && !impactResult && (
          <p className="text-muted-foreground">Proposals will be guided by the generated scroll and impact simulation.</p>
        )}
         <p className="text-sm text-foreground border-t pt-4 mt-4">
          Based on the information gathered, develop actionable steps. Consider:
          <ul className="list-disc list-inside ml-4 mt-2">
            <li>What specific policies could address the issues raised?</li>
            <li>Which community groups should be involved in implementing solutions?</li>
            <li>How can potential negative impacts be mitigated?</li>
            <li>What resources are needed for the proposed actions?</li>
          </ul>
        </p>
      </CardContent>
    </Card>
  );
}
