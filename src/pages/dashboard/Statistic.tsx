import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { StatsCard } from "../../components/cards/StatsCard";

const Statistic = () => {
  return (
    <div className="space-y-6 px-10 h-full py-4 bg-sous">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="1,245"
          description="+12% from last month"
          icon={Users}
        />
        <StatsCard
          title="Total Teachers"
          value="64"
          description="+2 new this month"
          icon={GraduationCap}
        />
        <StatsCard
          title="Active Classes"
          value="32"
          description="4 starting next week"
          icon={BookOpen}
        />
        <StatsCard
          title="Attendance Rate"
          value="94.2%"
          description="+2.1% from last month"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-2 mt-6">
        <div className="bg-white rounded-xl shadow-md p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold">Enrollment by Grade</h3>
          <p className="text-sm text-gray-500 mb-4">
            Student distribution across grades
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="groupA"
                  fill="#3b82f6"
                  name="Group A"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="groupB"
                  fill="#ec4899"
                  name="Group B"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 col-span-1">
          <h3 className="text-lg font-semibold">Gender Distribution</h3>
          <p className="text-sm text-gray-500 mb-4">Student gender breakdown</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {genderData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <p className="text-sm text-gray-500 mb-4">
            School events in the next 30 days
          </p>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-gray-200 p-2 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.date}</p>
                  <p className="text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold">Recent Announcements</h3>
          <p className="text-sm text-gray-500 mb-4">
            Latest school announcements
          </p>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <h4 className="font-medium">{announcement.title}</h4>
                <p className="text-sm text-gray-500">{announcement.date}</p>
                <p className="text-sm mt-1">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
const COLORS = ["#6366f1", "#f43f5e", "#10b981", "#f59e0b"];

const visitorStats = [
  { month: "Jan", groupA: 400, groupB: 200 },
  { month: "Feb", groupA: 700, groupB: 500 },
  { month: "Mar", groupA: 600, groupB: 300 },
  { month: "Apr", groupA: 200, groupB: 500 },
  { month: "May", groupA: 500, groupB: 350 },
  { month: "Jun", groupA: 520, groupB: 370 },
  { month: "Jul", groupA: 610, groupB: 400 },
  { month: "Aug", groupA: 580, groupB: 390 },
];

const genderData = [
  { name: "female", value: 500 },
  { name: "Male", value: 600 },
];

const upcomingEvents = [
  {
    title: "Parent-Teacher Conference",
    date: "May 15, 2023",
    description: "Annual meeting with parents to discuss student progress.",
  },
  {
    title: "Science Fair",
    date: "May 22, 2023",
    description: "Students will present their science projects.",
  },
  {
    title: "End of Year Ceremony",
    date: "June 10, 2023",
    description: "Celebration of student achievements for the academic year.",
  },
];

const announcements = [
  {
    title: "New Curriculum Implementation",
    date: "April 28, 2023",
    content:
      "Starting next month, we will be implementing the new science curriculum for grades 3-5.",
  },
  {
    title: "School Maintenance",
    date: "April 25, 2023",
    content:
      "The school gymnasium will be closed for renovations from May 1-10.",
  },
  {
    title: "Summer Program Registration",
    date: "April 20, 2023",
    content:
      "Registration for the summer enrichment program is now open. Limited spots available.",
  },
];
