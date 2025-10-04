import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ArrowLeft, Calendar, User, DollarSign, Filter, Clock, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/contexts/LocaleContext";

interface SimulationLog {
  id: string;
  date_of_use: string;
  time_of_use: string;
  expected_pension: number | null;
  age: number;
  sex: string;
  salary_amount: number;
  illness_included: boolean;
  account_funds: number;
  sub_account_funds: number;
  actual_pension: number;
  real_pension: number;
  postal_code: string | null;
  created_at: string;
}

interface SessionTime {
  id: string;
  session_id: string;
  user_identifier: string | null;
  start_time: string;
  end_time: string | null;
  duration_seconds: number | null;
  created_at: string;
}

interface Quiz {
  id: string;
  user_name: string;
  user_email: string;
  quiz_type: string;
  quiz_data: any;
  score: number | null;
  total_questions: number | null;
  answers: any;
  completed_at: string;
  created_at: string;
}

export default function AdminReports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLocale();
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SimulationLog[]>([]);
  const [sessions, setSessions] = useState<SessionTime[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionTime[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // Demo mode - no auth required
  const [activeTab, setActiveTab] = useState<'simulations' | 'sessions' | 'quizzes'>('simulations');
  const [filterSex, setFilterSex] = useState<string>("all");
  const [filterIllness, setFilterIllness] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sessionStartDate, setSessionStartDate] = useState<string>("");
  const [sessionEndDate, setSessionEndDate] = useState<string>("");

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filterSex, filterIllness, startDate, endDate]);

  useEffect(() => {
    applySessionFilters();
  }, [sessions, sessionStartDate, sessionEndDate]);

  const checkAdminAccess = async () => {
    try {
      setIsCheckingAuth(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Not authenticated:', userError);
        toast({
          title: "Authentication Required",
          description: "Please log in to access admin panel.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError) {
        console.error('Error checking role:', roleError);
        toast({
          title: "Authorization Error",
          description: "Error verifying admin access.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (!roleData) {
        console.error('User is not admin');
        toast({
          title: "Unauthorized",
          description: "You do not have admin access.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: "An error occurred checking permissions.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchLogs(), fetchSessions(), fetchQuizzes()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('simulation_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error loading reports",
        description: "Failed to fetch simulation logs.",
        variant: "destructive",
      });
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('session_time')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error loading sessions",
        description: "Failed to fetch session data.",
        variant: "destructive",
      });
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast({
        title: "Error loading quizzes",
        description: "Failed to fetch quiz data.",
        variant: "destructive",
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Filter by sex
    if (filterSex !== "all") {
      filtered = filtered.filter(log => log.sex === filterSex);
    }

    // Filter by illness inclusion
    if (filterIllness !== "all") {
      filtered = filtered.filter(log => 
        log.illness_included === (filterIllness === "yes")
      );
    }

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(log => log.date_of_use >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(log => log.date_of_use <= endDate);
    }

    setFilteredLogs(filtered);
  };

  const applySessionFilters = () => {
    let filtered = [...sessions];

    // Filter by date range
    if (sessionStartDate) {
      filtered = filtered.filter(session => 
        new Date(session.start_time).toISOString().split('T')[0] >= sessionStartDate
      );
    }
    if (sessionEndDate) {
      filtered = filtered.filter(session => 
        new Date(session.start_time).toISOString().split('T')[0] <= sessionEndDate
      );
    }

    setFilteredSessions(filtered);
  };

  const getSessionInsights = () => {
    if (filteredSessions.length === 0) {
      return { avgDuration: 0, totalSessions: 0, avgSessionsPerWeek: 0, uniqueUsers: 0 };
    }

    const totalDuration = filteredSessions.reduce((sum, session) => 
      sum + (session.duration_seconds || 0), 0
    );
    const avgDuration = Math.round(totalDuration / filteredSessions.length / 60); // in minutes

    // Calculate date range
    const dates = filteredSessions.map(s => new Date(s.start_time).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const weeksDiff = Math.max(1, (maxDate - minDate) / (7 * 24 * 60 * 60 * 1000));
    const avgSessionsPerWeek = Math.round(filteredSessions.length / weeksDiff);

    // Count unique users
    const uniqueUsers = new Set(filteredSessions.map(s => s.user_identifier).filter(Boolean)).size;

    return {
      avgDuration,
      totalSessions: filteredSessions.length,
      avgSessionsPerWeek,
      uniqueUsers
    };
  };


  const exportToExcel = () => {
    const exportData = filteredLogs.map(log => ({
      'Date of Use': log.date_of_use,
      'Time of Use': log.time_of_use,
      'Expected Pension': log.expected_pension || 'N/A',
      'Age': log.age,
      'Sex': log.sex === 'male' ? 'Male' : 'Female',
      'Salary Amount': log.salary_amount,
      'Illness Included': log.illness_included ? 'Yes' : 'No',
      'Account Funds': log.account_funds,
      'Sub-Account Funds': log.sub_account_funds,
      'Actual Pension': log.actual_pension,
      'Real Pension': log.real_pension,
      'Postal Code': log.postal_code || 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Simulation Reports');

    // Auto-size columns
    const maxWidth = 20;
    const columnWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.min(
        Math.max(
          key.length,
          ...exportData.map(row => String(row[key as keyof typeof row]).length)
        ),
        maxWidth
      )
    }));
    worksheet['!cols'] = columnWidths;

    const fileName = `pension_simulation_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Report exported",
      description: `Downloaded ${filteredLogs.length} records to ${fileName}`,
    });
  };

  const clearFilters = () => {
    setFilterSex("all");
    setFilterIllness("all");
    setStartDate("");
    setEndDate("");
  };

  const clearSessionFilters = () => {
    setSessionStartDate("");
    setSessionEndDate("");
  };


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('admin.back')}
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{t('admin.title')}</h1>
                <p className="text-muted-foreground mt-1">{t('admin.subtitle')}</p>
              </div>
            </div>
            <Button onClick={exportToExcel} className="gap-2" disabled={filteredLogs.length === 0}>
              <Download className="w-4 h-4" />
              {t('admin.exportExcel')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'simulations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('simulations')}
          >
            {t('admin.simulations')}
          </Button>
          <Button
            variant={activeTab === 'sessions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sessions')}
          >
            {t('admin.sessionTime')}
          </Button>
          <Button
            variant={activeTab === 'quizzes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('quizzes')}
          >
            {t('admin.quizzes')}
          </Button>
        </div>

        {activeTab === 'simulations' && (
          <>
            {/* Filters */}
            <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">{t('admin.filters')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterSex">{t('admin.sex')}</Label>
              <Select value={filterSex} onValueChange={setFilterSex}>
                <SelectTrigger id="filterSex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.all')}</SelectItem>
                  <SelectItem value="male">{t('admin.male')}</SelectItem>
                  <SelectItem value="female">{t('admin.female')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterIllness">{t('admin.illnessIncluded')}</Label>
              <Select value={filterIllness} onValueChange={setFilterIllness}>
                <SelectTrigger id="filterIllness">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.all')}</SelectItem>
                  <SelectItem value="yes">{t('admin.yes')}</SelectItem>
                  <SelectItem value="no">{t('admin.no')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">{t('admin.startDate')}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">{t('admin.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              {t('admin.clearFilters')}
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.totalSimulations')}</p>
                <p className="text-2xl font-bold text-foreground">{filteredLogs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.averageAge')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredLogs.length > 0
                    ? Math.round(filteredLogs.reduce((sum, log) => sum + log.age, 0) / filteredLogs.length)
                    : 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{t('admin.avgSalary')}</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredLogs.length > 0
                    ? Math.round(filteredLogs.reduce((sum, log) => sum + log.salary_amount, 0) / filteredLogs.length).toLocaleString('pl-PL')
                    : 0} PLN
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('admin.simulationRecords')}</h2>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">{t('admin.loading')}</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('admin.noRecords')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.date')}</TableHead>
                    <TableHead>{t('admin.time')}</TableHead>
                    <TableHead>{t('admin.age')}</TableHead>
                    <TableHead>{t('admin.sex')}</TableHead>
                    <TableHead>{t('admin.salary')}</TableHead>
                    <TableHead>{t('admin.illness')}</TableHead>
                    <TableHead>{t('admin.actualPension')}</TableHead>
                    <TableHead>{t('admin.realPension')}</TableHead>
                    <TableHead>{t('admin.postalCode')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date_of_use}</TableCell>
                      <TableCell>{log.time_of_use}</TableCell>
                      <TableCell>{log.age}</TableCell>
                      <TableCell className="capitalize">{log.sex}</TableCell>
                      <TableCell>{log.salary_amount.toLocaleString('pl-PL')} PLN</TableCell>
                      <TableCell>{log.illness_included ? t('admin.yes') : t('admin.no')}</TableCell>
                      <TableCell>{log.actual_pension.toLocaleString('pl-PL')} PLN</TableCell>
                      <TableCell>{log.real_pension.toLocaleString('pl-PL')} PLN</TableCell>
                      <TableCell>{log.postal_code || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
          </>
        )}

        {activeTab === 'sessions' && (
          <>
            {/* Session Filters */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">{t('admin.filters')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionStartDate">{t('admin.startDate')}</Label>
                  <Input
                    id="sessionStartDate"
                    type="date"
                    value={sessionStartDate}
                    onChange={(e) => setSessionStartDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionEndDate">{t('admin.endDate')}</Label>
                  <Input
                    id="sessionEndDate"
                    type="date"
                    value={sessionEndDate}
                    onChange={(e) => setSessionEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={clearSessionFilters}>
                  {t('admin.clearFilters')}
                </Button>
              </div>
            </Card>

            {/* Session Insights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalSessions')}</p>
                    <p className="text-2xl font-bold text-foreground">{getSessionInsights().totalSessions}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.avgSessionTime')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {getSessionInsights().avgDuration} min
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.sessionsPerWeek')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {getSessionInsights().avgSessionsPerWeek}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.uniqueUsers')}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {getSessionInsights().uniqueUsers}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Session Table */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">{t('admin.sessionRecords')}</h2>
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">{t('admin.loading')}</p>
              ) : filteredSessions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('admin.noRecords')}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('admin.sessionId')}</TableHead>
                        <TableHead>{t('admin.user')}</TableHead>
                        <TableHead>{t('admin.startTime')}</TableHead>
                        <TableHead>{t('admin.endTime')}</TableHead>
                        <TableHead>{t('admin.duration')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-mono text-xs">{session.session_id.substring(0, 8)}...</TableCell>
                          <TableCell className="truncate max-w-[120px]" title={session.user_identifier || 'Anonymous'}>
                            {session.user_identifier ? session.user_identifier.substring(0, 12) + '...' : 'Anonymous'}
                          </TableCell>
                          <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                          <TableCell>{session.end_time ? new Date(session.end_time).toLocaleString() : 'Active'}</TableCell>
                          <TableCell>
                            {session.duration_seconds 
                              ? Math.round(session.duration_seconds / 60) 
                              : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </>
        )}

        {activeTab === 'quizzes' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t('admin.quizResults')}</h2>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">{t('admin.loading')}</p>
            ) : quizzes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t('admin.noRecords')}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.name')}</TableHead>
                      <TableHead>{t('admin.email')}</TableHead>
                      <TableHead>{t('admin.quizType')}</TableHead>
                      <TableHead>{t('admin.score')}</TableHead>
                      <TableHead>{t('admin.questions')}</TableHead>
                      <TableHead>{t('admin.completedAt')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell>{quiz.user_name}</TableCell>
                        <TableCell>{quiz.user_email}</TableCell>
                        <TableCell className="capitalize">{quiz.quiz_type}</TableCell>
                        <TableCell>
                          {quiz.score !== null && quiz.total_questions 
                            ? `${quiz.score}/${quiz.total_questions}` 
                            : '-'}
                        </TableCell>
                        <TableCell>{quiz.total_questions || '-'}</TableCell>
                        <TableCell>{new Date(quiz.completed_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}
