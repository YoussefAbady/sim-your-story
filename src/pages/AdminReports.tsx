import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ArrowLeft, Calendar, User, DollarSign, Filter } from "lucide-react";
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

export default function AdminReports() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SimulationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterSex, setFilterSex] = useState<string>("all");
  const [filterIllness, setFilterIllness] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    applyFilters();
  }, [logs, filterSex, filterIllness, startDate, endDate]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setIsAuthenticated(true);
  };

  const fetchLogs = async () => {
    setIsLoading(true);
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
        description: "Failed to fetch simulation logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

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
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Usage Reports</h1>
                <p className="text-muted-foreground mt-1">Pension simulator analytics</p>
              </div>
            </div>
            <Button onClick={exportToExcel} className="gap-2" disabled={filteredLogs.length === 0}>
              <Download className="w-4 h-4" />
              Export to Excel
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterSex">Sex</Label>
              <Select value={filterSex} onValueChange={setFilterSex}>
                <SelectTrigger id="filterSex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filterIllness">Illness Included</Label>
              <Select value={filterIllness} onValueChange={setFilterIllness}>
                <SelectTrigger id="filterIllness">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
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
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Simulations</p>
                <p className="text-2xl font-bold text-foreground">{filteredLogs.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Age</p>
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
                <p className="text-sm text-muted-foreground">Avg. Salary</p>
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Simulation Records</h2>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No records found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Sex</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Illness</TableHead>
                    <TableHead>Actual Pension</TableHead>
                    <TableHead>Real Pension</TableHead>
                    <TableHead>Postal Code</TableHead>
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
                      <TableCell>{log.illness_included ? 'Yes' : 'No'}</TableCell>
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
      </main>
    </div>
  );
}
