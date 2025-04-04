export type Rider = {
  id: string;
  photo: string;
  name: string;
  sport: string;
  status: "active" | "inactive";
  level: "beginner" | "intermediate" | "advanced" | "professional";
  joinedDate: string;
};

export const riders: Rider[] = [
  {
    id: "1",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Alex Johnson",
    sport: "Mountain Biking",
    status: "active",
    level: "professional",
    joinedDate: "2023-01-15",
  },
  {
    id: "2",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Sarah Miller",
    sport: "BMX",
    status: "active",
    level: "advanced",
    joinedDate: "2023-02-20",
  },
  {
    id: "3",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Michael Chen",
    sport: "BMX",
    status: "inactive",
    level: "intermediate",
    joinedDate: "2023-03-10",
  },
  {
    id: "4",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Emma Wilson",
    sport: "Skate",
    status: "active",
    level: "advanced",
    joinedDate: "2023-04-05",
  },
  {
    id: "5",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "James Rodriguez",
    sport: "Skate",
    status: "active",
    level: "professional",
    joinedDate: "2023-05-12",
  },
  {
    id: "6",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Olivia Brown",
    sport: "BMX",
    status: "inactive",
    level: "beginner",
    joinedDate: "2023-06-18",
  },
];
