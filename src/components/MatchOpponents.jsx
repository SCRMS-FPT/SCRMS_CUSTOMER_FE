import { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MessageCircle, UserSearch } from "lucide-react";
import { cn } from "../lib/utils";
import { Client } from "../api/MatchingApi";

const client = new Client();

const sampleMatches = [
  {
    id: 1,
    name: "E Johnson",
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
];

export default function MatchingInterface() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(sampleMatches);
  const [page, setPage] = useState(1);

  const removeMatch = (matchId) => {
    if (matches.length === 0) return;

    setMatches((prevMatches) =>
      prevMatches.filter((match) => match.id !== matchId)
    );
  };

  useEffect(() => {
    loadSuggestion();
  }, [page]);

  const loadSuggestion = async () => {
    try {
      var result = await client.getSuggestions(page, 10);
      console.log(result);

      if (Array.isArray(result)) {
        setMatches(result);
      } else {
        setMatches([]);
        console.error("Unexpected API response:", result);
      }
    } catch (error) {
      console.error("Error get user's suggestions:", error);
    }
  };

  const handleSwipe = async (decision) => {
    if (currentIndex < matches.length) {
      removeMatch(matches[currentIndex].id);
      try {
        await client.swipe({
          swipedUserId: matches[currentIndex].id,
          decision,
        });
        console.log(
          `${decision === "accept" ? "Accepted" : "Rejected"}: ${
            matches[currentIndex].name
          }`
        );
      } catch (error) {
        console.error(
          `Error ${decision === "accept" ? "accepting" : "rejecting"} match:`,
          error
        );
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-black"></div>
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-white"></div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-4">
        <div className="w-full max-w-md relative min-h-[500px]">
          {matches.map((match, index) => (
            <MatchCard
              key={match.id}
              match={match}
              isActive={index === currentIndex}
              onSwipeRight={() => handleSwipe("accept")}
              onSwipeLeft={() => handleSwipe("reject")}
              zIndex={matches.length - index}
            />
          ))}

          {matches.length === 0 ||
            (currentIndex >= matches.length && (
              <Card className="absolute inset-0 flex items-center justify-center p-8 text-center bg-white">
                <div>
                  <h3 className="text-2xl font-bold mb-4">No more matches</h3>
                  <p className="text-muted-foreground mb-6">
                    Check back later for new potential sports partners!
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, isActive, onSwipeLeft, onSwipeRight, zIndex }) {
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
      style={{ x, rotate, opacity, zIndex }}
      drag={isActive ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <Card className="w-full h-full overflow-hidden shadow-lg bg-white">
        <div className="relative h-full flex flex-col">
          <div className="h-64 bg-gray-300 flex items-center justify-center">
            <div className="flex items-center justify-center bg-background rounded-full h-32 w-32 text-4xl font-bold">
              {match.name.charAt(0)}
            </div>
          </div>

          <div
            className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-white",
              match.sportColor
            )}
          >
            {match.sport}
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-black">{match.name}</h3>
            <p className="text-muted-foreground mb-2">{match.address}</p>
            <div className="mb-4">
              <span className="inline-block bg-muted px-2 py-1 rounded text-sm">
                {match.skillLevel}
              </span>
            </div>
            <p className="text-sm flex-1 text-black">
              {match.introduction || "Chưa có giới thiệu"}
            </p>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                onSwipeRight();
              }}
            >
              <UserSearch className="mr-2 h-4 w-4" />
              Detail profile
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
      </Card>
    </motion.div>
  );
}
