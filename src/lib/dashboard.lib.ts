export type Rider = {
  id: string;
  photo: string;
  name: string;
  sport: string;
  status: "active" | "inactive";
  level: "beginner" | "intermediate" | "advanced" | "professional";
  joinedDate: string;
  age?: number;
  country?: string;
  city?: string;
  description?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
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
    age: 28,
    country: "USA",
    city: "Boulder",
    description: "Professional mountain biker with 5 world championship titles",
    socialMedia: {
      instagram: "@alexjmtb",
      twitter: "@alexjohnsonmtb",
    },
  },
  {
    id: "2",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Sarah Miller",
    sport: "BMX",
    status: "active",
    level: "advanced",
    joinedDate: "2023-02-20",
    age: 24,
    country: "Canada",
    city: "Toronto",
    description: "Rising star in the BMX scene, known for technical tricks",
    socialMedia: {
      instagram: "@sarahbmx",
      facebook: "sarahmillerbmx",
    },
  },
  {
    id: "3",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Michael Chen",
    sport: "BMX",
    status: "inactive",
    level: "intermediate",
    joinedDate: "2023-03-10",
    age: 22,
    country: "China",
    city: "Shanghai",
    description: "Urban BMX rider focusing on street style",
    socialMedia: {
      instagram: "@michaelchenbmx",
    },
  },
  {
    id: "4",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Emma Wilson",
    sport: "Skate",
    status: "active",
    level: "advanced",
    joinedDate: "2023-04-05",
    age: 25,
    country: "UK",
    city: "London",
    description: "Specializes in halfpipe and park skateboarding",
    socialMedia: {
      instagram: "@emmaskates",
      twitter: "@emmawilsonskate",
      facebook: "emmawilsonskate",
    },
  },
  {
    id: "5",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "James Rodriguez",
    sport: "Skate",
    status: "active",
    level: "professional",
    joinedDate: "2023-05-12",
    age: 30,
    country: "Spain",
    city: "Barcelona",
    description: "Street skateboarding legend with multiple X Games medals",
    socialMedia: {
      instagram: "@jamesrodskate",
      twitter: "@jrodriguez",
    },
  },
  {
    id: "6",
    photo: "/circle-user-round.svg?height=40&width=40",
    name: "Olivia Brown",
    sport: "BMX",
    status: "inactive",
    level: "beginner",
    joinedDate: "2023-06-18",
    age: 19,
    country: "Australia",
    city: "Sydney",
    description: "New to BMX but showing great potential in ramp riding",
    socialMedia: {
      instagram: "@oliviabmxer",
    },
  },
];
