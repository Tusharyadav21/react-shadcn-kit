import React from "react";
import { createRoot } from "react-dom/client";
import {
  ThemeProvider,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ThemeToggle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Switch,
  Checkbox,
  Slider,
  ComponentSearch,
} from "./index";
import type { SearchResult } from "./components/composites/ComponentSearch";
import {
  Rocket,
  Layout,
  MousePointer2,
  Type,
  Bell,
  Settings,
  Github,
  Mail,
  Layers,
  Box,
} from "lucide-react";

// Mock component data for search
const mockComponents: SearchResult[] = [
  {
    id: "button",
    title: "Button",
    description: "Clickable button component",
    category: "Primitives",
    icon: <MousePointer2 className="h-4 w-4" />,
  },
  {
    id: "input",
    title: "Input",
    description: "Text input field",
    category: "Primitives",
    icon: <Type className="h-4 w-4" />,
  },
  {
    id: "card",
    title: "Card",
    description: "Container for content",
    category: "Primitives",
    icon: <Box className="h-4 w-4" />,
  },
  {
    id: "badge",
    title: "Badge",
    description: "Status indicator",
    category: "Primitives",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "alert",
    title: "Alert",
    description: "Notification message",
    category: "Primitives",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "theme-toggle",
    title: "Theme Toggle",
    description: "Switch between light/dark mode",
    category: "Composites",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "component-search",
    title: "Component Search",
    description: "Interactive search component",
    category: "Composites",
    icon: <Layout className="h-4 w-4" />,
  },
];

const Demo = () => {
  const handleSearch = async (query: string): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Filter components based on query
    return mockComponents.filter(
      (component) =>
        component.title.toLowerCase().includes(query.toLowerCase()) ||
        component.description?.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const handleSelect = (result: SearchResult) => {
    console.log("Selected:", result);
    // In a real app, you might navigate to the component page
    alert(`Selected: ${result.title}`);
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <Rocket className="h-5 w-5" />
              </div>
              <span>Shadcn Kit</span>
              <Badge variant="secondary" className="ml-2 font-mono text-[10px] py-0">
                v0.2.0
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <ComponentSearch onSearch={handleSearch} onSelect={handleSelect} />
              <ThemeToggle />
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto py-10 px-4">
          <div className="flex flex-col gap-8">
            {/* Hero Section */}
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                The ultimate UI kit for React 19.
              </h1>
              <p className="text-xl text-muted-foreground">
                A collection of accessible, high-performance components built with Radix UI and
                Tailwind CSS 4.0.
              </p>
              <div className="flex gap-4 mt-2">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                  Documentation
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Star on GitHub
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Components Showcase */}
            <Tabs defaultValue="actions" className="w-full">
              <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2 sm:pb-0">
                <TabsList className="bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="actions" className="rounded-lg px-4 py-2 flex gap-2">
                    <MousePointer2 className="h-4 w-4" />
                    <span>Actions</span>
                  </TabsTrigger>
                  <TabsTrigger value="inputs" className="rounded-lg px-4 py-2 flex gap-2">
                    <Type className="h-4 w-4" />
                    <span>Inputs</span>
                  </TabsTrigger>
                  <TabsTrigger value="display" className="rounded-lg px-4 py-2 flex gap-2">
                    <Layout className="h-4 w-4" />
                    <span>Display</span>
                  </TabsTrigger>
                  <TabsTrigger value="feedback" className="rounded-lg px-4 py-2 flex gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Feedback</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Actions Tab */}
              <TabsContent
                value="actions"
                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>Button Variants</CardTitle>
                      <CardDescription>Primary, Secondary, Ghost, and more.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="destructive">Destructive</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>Badges</CardTitle>
                      <CardDescription>Status indicators and tags.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-none transition-colors">
                        Success
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>Loading States</CardTitle>
                      <CardDescription>Interactions with feedback.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                      <Button disabled className="opacity-70 animate-pulse">
                        Please wait
                      </Button>
                      <Button variant="secondary" size="icon" className="animate-spin rounded-full">
                        <Rocket className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Inputs Tab */}
              <TabsContent
                value="inputs"
                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Forms</CardTitle>
                      <CardDescription>Standard input fields and labels.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" placeholder="Email" className="rounded-lg" />
                      </div>
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          type="password"
                          id="password"
                          placeholder="••••••••"
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Accept terms and conditions
                        </Label>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full rounded-lg">Sign In</Button>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Controls</CardTitle>
                      <CardDescription>Toggles and sliders.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 py-6">
                      <div className="flex items-center justify-between space-x-2 px-1">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="airplane-mode">Airplane Mode</Label>
                          <span className="text-xs text-muted-foreground italic">
                            Disable all communications
                          </span>
                        </div>
                        <Switch id="airplane-mode" />
                      </div>
                      <div className="space-y-4 px-1">
                        <div className="flex justify-between">
                          <Label>Volume</Label>
                          <span className="text-xs font-mono">75%</span>
                        </div>
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                      <div className="flex items-center justify-between space-x-2 px-1">
                        <div className="flex flex-col gap-1">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <span className="text-xs text-muted-foreground italic">
                            Get latest updates weekly
                          </span>
                        </div>
                        <Switch id="marketing-emails" defaultChecked />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Display Tab */}
              <TabsContent
                value="display"
                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <Avatar className="h-12 w-12 border-2 border-primary/20">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>Detailed user information.</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm font-medium">Username</span>
                        <span className="text-sm text-muted-foreground">@shadcn</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm font-medium">Company</span>
                        <span className="text-sm text-muted-foreground">Vercel Inc.</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium">Location</span>
                        <span className="text-sm text-muted-foreground">San Francisco, CA</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6">
                    <Card className="bg-primary text-primary-foreground border-none">
                      <CardHeader>
                        <CardTitle className="text-primary-foreground/90">Premium Plan</CardTitle>
                        <CardDescription className="text-primary-foreground/70">
                          Access all features and components.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold">$29/mo</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="secondary" className="w-full">
                          Upgrade Now
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Feedback Tab */}
              <TabsContent
                value="feedback"
                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="grid gap-4">
                  <Alert className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50">
                    <Rocket className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Heads up!</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400">
                      You can add components to your app using the cli.
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive">
                    <Bell className="h-4 w-4" />
                    <AlertTitle>Critical Error</AlertTitle>
                    <AlertDescription>
                      Your subscription will expire in 2 days. Please update your billing details.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="outline" onClick={() => alert("Notification clicked!")}>
                      Trigger Toast
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <footer className="border-t py-12 bg-muted/30 mt-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg opacity-80">
              <Rocket className="h-5 w-5" />
              <span>Shadcn Kit</span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              Built with ❤️ by Tushar Yadav. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mail className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Demo />
    </React.StrictMode>,
  );
}
