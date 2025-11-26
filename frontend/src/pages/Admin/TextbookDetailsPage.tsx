import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  BarChart3,
  MessageSquare,
  FileVideo,
  CheckCircle2,
  PlayCircle,
  FileAudio,
  ArrowLeft,
  BookOpen,
  Users,
  HelpCircle,
  Share2,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/functions/authService";
import MetricCard from "@/components/Admin/MetricCard";

type TextbookDetails = {
  id: string;
  title: string;
  authors: string[];
  status: string;
  user_count: number;
  question_count: number;
  section_count: number;
  image_count: number;
  video_count: number;
  audio_count: number;
};

type TimeSeriesData = {
  date: string;
  users: number;
  questions: number;
};

type TextbookAnalyticsData = {
  timeSeries: TimeSeriesData[];
};

type FAQ = {
  id: string;
  question_text: string;
  answer_text: string;
  usage_count: number;
  last_used_at: string;
  cached_at: string;
};

type SharedPrompt = {
  id: string;
  title: string;
  prompt_text: string;
  visibility: string;
  tags: string[];
  role: string;
  reported: boolean;
  created_at: string;
  updated_at: string;
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-50 bg-gray-50/50">
        <CardTitle className="text-base font-semibold text-gray-900">
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 h-[300px]">{children}</CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-xl text-sm">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs text-gray-600 mb-1"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize">{entry.name}:</span>
            <span className="font-bold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function TextbookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"analytics" | "faq" | "status">(
    "analytics"
  );
  const [textbook, setTextbook] = useState<TextbookDetails | null>(null);
  const [analyticsData, setAnalyticsData] = useState<TextbookAnalyticsData>({
    timeSeries: [],
  });
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [sharedPrompts, setSharedPrompts] = useState<SharedPrompt[]>([]);
  const [timeRange, setTimeRange] = useState("3m");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTextbookDetails();
      fetchAnalytics();
    }
  }, [id, timeRange]);

  useEffect(() => {
    if (id && activeView === "faq") {
      fetchFAQs();
      fetchSharedPrompts();
    }
  }, [id, activeView]);

  const fetchTextbookDetails = async () => {
    try {
      const session = await AuthService.getAuthSession(true);
      const token = session.tokens.idToken;

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/admin/textbooks/${id}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch textbook details");
      }

      const data = await response.json();
      setTextbook(data);
    } catch (err) {
      console.error("Error fetching textbook details:", err);
      setError("Failed to load textbook details");
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const session = await AuthService.getAuthSession(true);
      const token = session.tokens.idToken;

      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/admin/textbooks/${id}/analytics?timeRange=${timeRange}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    try {
      const session = await AuthService.getAuthSession(true);
      const token = session.tokens.idToken;

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/admin/textbooks/${id}/faqs`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }

      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const fetchSharedPrompts = async () => {
    try {
      const session = await AuthService.getAuthSession(true);
      const token = session.tokens.idToken;

      const response = await fetch(
        `${
          import.meta.env.VITE_API_ENDPOINT
        }/admin/textbooks/${id}/shared_prompts`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shared prompts");
      }

      const data = await response.json();
      setSharedPrompts(data.prompts || []);
    } catch (err) {
      console.error("Error fetching shared prompts:", err);
    }
  };

  if (!textbook && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c5f7c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          <Button
            variant="default"
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!textbook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Textbook Not Found
          </h2>
          <Button
            variant="link"
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate totals from time series for the selected period
  const totalUsersPeriod = analyticsData.timeSeries.reduce(
    (acc, curr) => acc + Number(curr.users),
    0
  );
  const totalQuestionsPeriod = analyticsData.timeSeries.reduce(
    (acc, curr) => acc + Number(curr.questions),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2c5f7c] to-[#3d7a9a] text-white h-[70px] flex items-center px-6 shadow-md z-10 justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <h1 className="text-xl font-semibold">OpenED AI Admin</h1>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10"
          onClick={() => navigate("/admin/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 line-clamp-2">
              {textbook.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {textbook.authors?.join(", ") || "Unknown Author"}
            </p>
            <Badge
              variant={textbook.status === "Active" ? "default" : "secondary"}
              className={`mt-3 ${
                textbook.status === "Active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {textbook.status}
            </Badge>
          </div>

          <nav className="p-4 space-y-1">
            <Button
              variant={activeView === "analytics" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeView === "analytics"
                  ? "bg-[#2c5f7c]/10 text-[#2c5f7c] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveView("analytics")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button
              variant={activeView === "faq" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeView === "faq"
                  ? "bg-[#2c5f7c]/10 text-[#2c5f7c] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveView("faq")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              FAQ & User Prompts
            </Button>
            <Button
              variant={activeView === "status" ? "secondary" : "ghost"}
              className={`w-full justify-start ${
                activeView === "status"
                  ? "bg-[#2c5f7c]/10 text-[#2c5f7c] font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveView("status")}
            >
              <FileVideo className="mr-2 h-4 w-4" />
              Textbook Status & Media
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {activeView === "analytics" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Analytics Overview
                    </h2>
                    <p className="text-gray-500">
                      Usage statistics and engagement metrics.
                    </p>
                  </div>
                  <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                    <Button
                      variant={timeRange === "3m" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange("3m")}
                      className="text-xs h-8"
                    >
                      3M
                    </Button>
                    <Button
                      variant={timeRange === "30d" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange("30d")}
                      className="text-xs h-8"
                    >
                      30D
                    </Button>
                    <Button
                      variant={timeRange === "7d" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setTimeRange("7d")}
                      className="text-xs h-8"
                    >
                      7D
                    </Button>
                  </div>
                </div>

                {loading && !analyticsData.timeSeries.length ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c5f7c]"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <MetricCard
                        title="Active Users"
                        value={totalUsersPeriod.toString()}
                        icon={<Users className="h-5 w-5 text-blue-600" />}
                        trend="in selected period"
                      />
                      <MetricCard
                        title="Questions Asked"
                        value={totalQuestionsPeriod.toString()}
                        icon={
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        }
                        trend="in selected period"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <ChartCard
                        title="User Engagement"
                        subtitle="Active users interacting with this textbook"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={analyticsData.timeSeries}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#2c5f7c"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartCard>

                      <ChartCard
                        title="Question Volume"
                        subtitle="Questions asked about this textbook"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={analyticsData.timeSeries}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -20,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#e5e7eb"
                            />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: "#6b7280" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="questions"
                              stroke="#3d7a9a"
                              strokeWidth={3}
                              dot={false}
                              activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartCard>
                    </div>
                  </>
                )}
              </div>
            )}

            {activeView === "faq" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    FAQ & User Prompts
                  </h2>
                  <p className="text-gray-500">
                    Review frequently asked questions and shared user prompts.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* FAQs Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="h-5 w-5 text-[#2c5f7c]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Frequently Asked Questions
                      </h3>
                    </div>
                    {faqs.length === 0 ? (
                      <Card className="bg-gray-50 border-dashed">
                        <CardContent className="p-6 text-center text-gray-500">
                          No FAQs found for this textbook.
                        </CardContent>
                      </Card>
                    ) : (
                      faqs.map((faq) => (
                        <Card
                          key={faq.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-5">
                            <p className="font-medium text-gray-900 mb-2">
                              "{faq.question_text}"
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                              {faq.answer_text}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <Badge variant="secondary" className="text-xs">
                                Used {faq.usage_count} times
                              </Badge>
                              <span>
                                Last used:{" "}
                                {new Date(
                                  faq.last_used_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>

                  {/* Shared Prompts Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="h-5 w-5 text-[#2c5f7c]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Shared User Prompts
                      </h3>
                    </div>
                    {sharedPrompts.length === 0 ? (
                      <Card className="bg-gray-50 border-dashed">
                        <CardContent className="p-6 text-center text-gray-500">
                          No shared prompts found for this textbook.
                        </CardContent>
                      </Card>
                    ) : (
                      sharedPrompts.map((prompt) => (
                        <Card
                          key={prompt.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {prompt.title || "Untitled Prompt"}
                              </h4>
                              {prompt.reported && (
                                <Badge
                                  variant="destructive"
                                  className="flex items-center gap-1 text-[10px] h-5"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                  Reported
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3 italic">
                              "{prompt.prompt_text}"
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {prompt.tags?.map((tag, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3 mt-2">
                              <span className="capitalize">
                                Role: {prompt.role || "User"}
                              </span>
                              <span>
                                {new Date(
                                  prompt.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === "status" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Textbook Status & Media
                  </h2>
                  <p className="text-gray-500">
                    Ingestion status and linked materials.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Ingestion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-green-900 text-lg">
                          Fully Ingested
                        </p>
                        <p className="text-green-700">
                          {textbook.section_count} sections have been processed
                          and indexed successfully.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Associated Media
                  </h3>
                  <div className="grid gap-4">
                    {[
                      {
                        type: "video",
                        title: "Lecture 1: Introduction to CS",
                        duration: "45:00",
                        size: "1.2 GB",
                      },
                      {
                        type: "audio",
                        title: "Podcast: The History of Computing",
                        duration: "15:30",
                        size: "24 MB",
                      },
                      {
                        type: "video",
                        title: "Chapter 2: Algorithms Walkthrough",
                        duration: "22:15",
                        size: "450 MB",
                      },
                      {
                        type: "video",
                        title: "Lab Session 1 Recording",
                        duration: "55:00",
                        size: "1.5 GB",
                      },
                    ].map((media, i) => (
                      <Card key={i}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                media.type === "video"
                                  ? "bg-red-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {media.type === "video" ? (
                                <PlayCircle
                                  className={`h-6 w-6 ${
                                    media.type === "video"
                                      ? "text-red-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              ) : (
                                <FileAudio className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {media.title}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">
                                {media.type} • {media.duration} • {media.size}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Preview
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Unlink
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
