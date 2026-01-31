import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import api from "@/api/axios";

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentsCount = async () => {
      try {
        const res = await api.get("/students");
        setTotalStudents(res.data.length);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsCount();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="text-sm font-medium text-muted-foreground">
          Total Students
        </CardHeader>

        <CardContent className="text-3xl font-bold">
          {loading ? "…" : totalStudents}
        </CardContent>
      </Card>
    </div>
  );
}
