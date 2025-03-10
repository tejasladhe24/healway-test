"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/core/components/ui/tabs";
import { Badge } from "@/core/components/ui/badge";
import { Clipboard, FileText, List, MessageSquare, User } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Summary } from "@/types";
import { toast } from "sonner";

export default function PatientSummary({ data }: { data: Summary }) {
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.info("Copied to clipboard");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 w-full rounded-none border-b">
        <TabsTrigger value="overview" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Overview</span>
        </TabsTrigger>
        <TabsTrigger value="details" className="flex items-center gap-1">
          <List className="h-4 w-4" />
          <span className="hidden sm:inline">Details</span>
        </TabsTrigger>
        <TabsTrigger value="condition" className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Condition</span>
        </TabsTrigger>
        <TabsTrigger value="response" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Response</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Quick Summary</h3>
          <p className="text-muted-foreground">{data.quick_summary}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2 flex justify-between">
            Key Points
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() =>
                copyToClipboard(data.key_points.join("\n• "), "Key points")
              }
            >
              <Clipboard className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </h3>
          <ul className="space-y-2">
            {data.key_points.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="details" className="p-4">
        <h3 className="text-lg font-medium mb-2 flex justify-between">
          Deep Summary
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() => copyToClipboard(data.deep_summary, "Deep summary")}
          >
            <Clipboard className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </h3>
        <p className="text-muted-foreground whitespace-pre-line">
          {data.deep_summary}
        </p>
      </TabsContent>

      <TabsContent value="condition" className="p-4">
        <h3 className="text-lg font-medium mb-3">Patient Condition</h3>
        <div className="flex flex-wrap gap-2">
          {data.patient_condition.map((condition, index) => (
            <Badge
              key={index}
              variant="outline"
              className="px-3 py-1 text-sm bg-muted/30"
            >
              {condition}
            </Badge>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="response" className="p-4">
        <h3 className="text-lg font-medium mb-2 flex justify-between">
          Suggested Response
          <Button
            variant="ghost"
            size="sm"
            className="h-8"
            onClick={() =>
              copyToClipboard(data.suggested_response, "Suggested response")
            }
          >
            <Clipboard className="h-4 w-4 mr-1" />
            Copy
          </Button>
        </h3>
        <Card className="bg-muted/20 border">
          <CardContent className="p-4">
            <p className="italic">{data.suggested_response}</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
