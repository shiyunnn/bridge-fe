import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Link,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import Editor from "./Editor";

interface PRDInputPageProps {
  onSubmit?: (prdData: PRDData) => void;
  onGenerateTasks?: (prdData: PRDData) => void;
}

interface PRDData {
  title: string;
  content: string;
  source: "confluence" | "manual";
  confluenceUrl?: string;
  estimatedFeatures?: number;
}

const PRDInputPage: React.FC<PRDInputPageProps> = ({
  onSubmit = () => {},
  onGenerateTasks = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<"confluence" | "manual">(
    "confluence"
  );
  const [confluenceUrl, setConfluenceUrl] = useState("");
  const [manualContent, setManualContent] = useState("");
  const [prdTitle, setPrdTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedContent, setFetchedContent] = useState("");
  const [isContentFetched, setIsContentFetched] = useState(false);

  const handleConfluenceFetch = async () => {
    if (!confluenceUrl.trim()) return;

    setIsLoading(true);
    try {
      // Simulate API call to fetch Confluence content
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock fetched content
      const mockContent = `# Project Requirements Document

## Overview
This project aims to develop a comprehensive user management system with the following key features:

## Core Features

### 1. User Authentication
- Secure login/logout functionality
- Password reset capabilities
- Multi-factor authentication support
- Session management

### 2. User Profile Management
- Profile creation and editing
- Avatar upload functionality
- Privacy settings
- Account deactivation

### 3. Admin Dashboard
- User management interface
- Analytics and reporting
- System configuration
- Audit logs

## Technical Requirements
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Authentication: JWT tokens

## Timeline
- Phase 1: Authentication (2 weeks)
- Phase 2: Profile Management (3 weeks)
- Phase 3: Admin Dashboard (2 weeks)

## Success Criteria
- 99.9% uptime
- Sub-200ms response times
- Support for 10,000+ concurrent users`;

      setFetchedContent(mockContent);
      setPrdTitle("User Management System PRD");
      setIsContentFetched(true);
    } catch (error) {
      console.error("Failed to fetch Confluence content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    const content = activeTab === "confluence" ? fetchedContent : manualContent;
    const prdData: PRDData = {
      title: prdTitle,
      content,
      source: activeTab,
      confluenceUrl: activeTab === "confluence" ? confluenceUrl : undefined,
      estimatedFeatures: estimateFeatureCount(content),
    };

    onSubmit(prdData);
    onGenerateTasks(prdData);
  };

  const estimateFeatureCount = (content: string): number => {
    // Simple estimation based on headers and bullet points
    const headers = (content.match(/^#+\s/gm) || []).length;
    const bullets = (content.match(/^[-*]\s/gm) || []).length;
    return Math.max(1, Math.floor((headers + bullets) / 3));
  };

  const isSubmitDisabled = () => {
    if (activeTab === "confluence") {
      return !isContentFetched || !prdTitle.trim();
    }
    return !manualContent.trim() || !prdTitle.trim();
  };

  const getContentPreview = () => {
    const content = activeTab === "confluence" ? fetchedContent : manualContent;
    return content.slice(0, 200) + (content.length > 200 ? "..." : "");
  };

  const renderMarkdown = (text: string) => {
    return (
      text
        // Headers
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-lg font-semibold mt-3 mb-2">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-2xl font-bold mt-4 mb-3">$1</h1>'
        )
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Bullet points
        .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
        // Convert consecutive list items to proper lists
        .replace(
          /(<li.*<\/li>)/gs,
          '<ul class="list-disc space-y-1 my-2">$1</ul>'
        )
        // Clean up nested lists
        .replace(/<\/ul>\s*<ul>/g, "")
        // Line breaks
        .replace(/\n/g, "<br>")
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-screen mx-auto space-y-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-center">
          <div className="relative mb-8 ">
            <img
              src="/bridge-hero.png"
              alt="Bridge Hero"
              className="w-[800px] max-h-[400px] object-contain"
            />
          </div>
          <div className="text-left space-y-4 py-8">
            <h1 className="text-6xl font-bold text-[#000F4E]">
              From PRD to <br />
              feature timeline in minutes.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mt-1">
              Bridge the gap between project planning and execution by
              automatically converting project requirements into actionable
              tasks and automatic resource allocation.
            </p>
          </div>
        </div>

        <div className="flex justify-center opacity-80 ">
          <Button
            variant="link"
            size="sm"
            className="text-base text-muted-foreground/80 hover:text-muted-foreground flex items-center gap-1"
            onClick={() => {
              const mainCard = document.querySelector(".bg-white");
              mainCard?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Continue
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Input Card */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                PRD Input Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* PRD Title */}
                <div className="space-y-2">
                  <Label htmlFor="prd-title">Project Title *</Label>
                  <Input
                    id="prd-title"
                    placeholder="Enter your project title..."
                    value={prdTitle}
                    onChange={(e) => setPrdTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Input Method Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={(value) =>
                    setActiveTab(value as "confluence" | "manual")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="confluence"
                      className="flex items-center gap-2"
                    >
                      <img
                        src="/confluence-logo.svg"
                        alt="Confluence"
                        className="h-4 w-auto"
                      />
                      Confluence Link
                    </TabsTrigger>
                    <TabsTrigger
                      value="manual"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>

                  {/* Confluence Tab */}
                  <TabsContent value="confluence" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="confluence-url">
                        Confluence Page URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="confluence-url"
                          placeholder="https://your-company.atlassian.net/wiki/spaces/..."
                          value={confluenceUrl}
                          onChange={(e) => setConfluenceUrl(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          onClick={handleConfluenceFetch}
                          disabled={!confluenceUrl.trim() || isLoading}
                          className="min-w-[100px]"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Fetching
                            </>
                          ) : (
                            "Fetch Content"
                          )}
                        </Button>
                      </div>
                    </div>

                    {isContentFetched && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Label className="text-green-700">
                            Content Successfully Fetched
                          </Label>
                        </div>
                        <div className="bg-muted p-4 rounded-md">
                          <p className="text-sm text-muted-foreground mb-2">
                            Preview:
                          </p>
                          <div
                            className="text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(getContentPreview()),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Manual Entry Tab */}
                  <TabsContent value="manual" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manual-content">
                        Project Requirements
                      </Label>
                      {false && (
                        <Textarea
                          id="manual-content"
                          placeholder={`Enter your project requirements here...

Feel free to copy and paste from your csv, excel, or document.

You can can also use markdown formatting:
# Headers
- Bullet points
**Bold text**
*Italic text*

Example:
# Core Features
- User authentication
- Dashboard interface
- Reporting system`}
                          value={manualContent}
                          onChange={(e) => setManualContent(e.target.value)}
                          className="min-h-[300px] font-mono text-sm"
                        />
                      )}
                      <Editor />
                      <p className="text-xs text-muted-foreground">
                        Supports Markdown formatting. Use headers (#) and bullet
                        points (-) to structure your requirements.
                      </p>
                    </div>

                    {manualContent && (
                      <div className="space-y-2">
                        <Label>Live Preview</Label>
                        <div className="bg-muted p-4 rounded-md max-h-[200px] overflow-y-auto">
                          <div
                            className="text-sm prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(getContentPreview()),
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          {(isContentFetched || manualContent) && prdTitle && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>PRD Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Project Title</Label>
                    <p className="text-sm">{prdTitle}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Content Source
                    </Label>
                    <Badge
                      variant={
                        activeTab === "confluence" ? "default" : "secondary"
                      }
                    >
                      {activeTab === "confluence"
                        ? "Confluence"
                        : "Manual Entry"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Estimated Features
                    </Label>
                    <Badge variant="outline">
                      {estimateFeatureCount(
                        activeTab === "confluence"
                          ? fetchedContent
                          : manualContent
                      )}{" "}
                      features
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              size="lg"
              className="min-w-[200px]"
            >
              <Send className="h-4 w-4 mr-2" />
              Generate Tasks & Continue
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-muted-foreground space-y-1">
            <p>
              Once you submit, the system will automatically generate tasks
              based on your PRD.
            </p>
            <p>
              You'll then be able to review and modify these tasks in the Task
              List page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDInputPage;
