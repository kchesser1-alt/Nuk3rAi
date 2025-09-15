'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleAuth = async () => {
    if (!accessKey.trim()) {
      setError("Please enter an access key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/auth", {
        method: "POST",
        body: JSON.stringify({ accessKey })
      });
      
      toast({
        title: "Authentication Successful",
        description: "System initialized. Welcome to NUKER AI.",
      });
      
      router.push(`/chat/${data.sessionId}`);
    } catch (error) {
      setError("Invalid access key. System access denied.");
      setAccessKey("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-space-900 to-space-800 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm animate-pulse-slow"></div>
      
      <Card className="relative bg-card border neon-border rounded-lg p-8 max-w-md w-full mx-4 neon-glow z-10">
        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2 animate-glow" data-testid="title-nuker">
              NUKER
            </h1>
            <p className="text-muted-foreground text-sm">
              Advanced AI Interface • Unauthorized Access Prohibited
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="accessKey" className="block text-sm font-medium text-foreground mb-2">
                Access Key
              </Label>
              <Input
                id="accessKey"
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-input border neon-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="Enter authorization key"
                disabled={isLoading}
                data-testid="input-access-key"
              />
            </div>
            
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-opacity-80 transition-all duration-300 font-medium neon-glow"
              data-testid="button-initialize"
            >
              {isLoading ? "INITIALIZING..." : "INITIALIZE SYSTEM"}
            </Button>
            
            {error && (
              <div className="text-destructive text-sm text-center" data-testid="text-error">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}