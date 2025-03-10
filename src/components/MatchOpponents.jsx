import { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, MessageCircle, X } from "lucide-react";
import { cn } from "../lib/utils";

const sampleMatches = [
  {
    id: 1,
    name: "Alex Johnson",
    sport: "Tennis",
    address: "Central Court, 123 Sports Ave",
    skillLevel: "Advanced",
    introduction: "Looking for competitive matches on weekends!",
    sportColor: "bg-green-500",
  },
  {
    id: 2,
    name: "Sam Wilson",
    sport: "Basketball",
    address: "Downtown Hoops, 456 Ball St",
    skillLevel: "Intermediate",
    introduction: null,
    sportColor: "bg-orange-500",
  },
  {
    id: 3,
    name: "Jamie Lee",
    sport: "Soccer",
    address: "Green Field Stadium, 789 Goal Rd",
    skillLevel: "Beginner",
    introduction: "New to the area, looking to make friends through sports!",
    sportColor: "bg-blue-500",
  },
  {
    id: 4,
    name: "Taylor Smith",
    sport: "Volleyball",
    address: "Beach Arena, 101 Sand Blvd",
    skillLevel: "Advanced",
    introduction: "Beach volleyball enthusiast for 5+ years",
    sportColor: "bg-yellow-500",
  },
  {
    id: 5,
    name: "Jordan Patel",
    sport: "Badminton",
    address: "Indoor Sports Complex, 202 Racket Way",
    skillLevel: "Intermediate",
    introduction: null,
    sportColor: "bg-purple-500",
  },
];

export default function MatchingInterface() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(sampleMatches);

  const handleMatch = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReject = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleMessage = (id) => {
    console.log(`Starting conversation with player ${id}`);
    // In a real app, this would open a messaging interface
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="w-full max-w-md relative min-h-[500px]">
        {matches.map((match, index) => (
          <MatchCard
            key={match.id}
            match={match}
            isActive={index === currentIndex}
            onSwipeLeft={handleReject}
            onSwipeRight={handleMatch}
            onMessage={() => handleMessage(match.id)}
            zIndex={matches.length - index}
          />
        ))}

        {currentIndex >= matches.length && (
          <Card className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">No more matches</h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new potential sports partners!
              </p>
              <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
            </div>
          </Card>
        )}
      </div>

      {currentIndex < matches.length && (
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-destructive"
            onClick={handleReject}
          >
            <X className="h-6 w-6 text-destructive" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-primary"
            onClick={() => handleMessage(matches[currentIndex].id)}
          >
            <MessageCircle className="h-6 w-6 text-primary" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-2 border-green-500"
            onClick={handleMatch}
          >
            <Check className="h-6 w-6 text-green-500" />
          </Button>
        </div>
      )}
    </div>
  );
}

function MatchCard({
  match,
  isActive,
  onSwipeLeft,
  onSwipeRight,
  onMessage,
  zIndex,
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipeRight();
    } else if (info.offset.x < -100) {
      onSwipeLeft();
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute inset-0 w-full",
        !isActive && "pointer-events-none"
      )}
      style={{
        x,
        rotate,
        opacity,
        zIndex,
      }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <Card className="w-full h-full overflow-hidden">
        <div className="relative h-full flex flex-col">
          {/* Placeholder avatar */}
          <div className="h-64 bg-muted flex items-center justify-center">
            <div className="flex items-center justify-center bg-background rounded-full h-32 w-32 text-4xl font-bold">
              {match.name.charAt(0)}
            </div>
          </div>

          {/* Sport badge */}
          <div
            className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-white",
              match.sportColor
            )}
          >
            {match.sport}
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold">{match.name}</h3>
            <p className="text-muted-foreground mb-2">{match.address}</p>
            <div className="mb-4">
              <span className="inline-block bg-muted px-2 py-1 rounded text-sm">
                {match.skillLevel}
              </span>
            </div>
            <p className="text-sm flex-1">
              {match.introduction || "Chưa có giới thiệu"}
            </p>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                className="flex-1"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwipeRight();
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Accept
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage();
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
