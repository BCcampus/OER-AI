import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GenerateFormProps {
  onGenerate: (formData: any) => void;
}

export function GenerateForm({ onGenerate }: GenerateFormProps) {
  const [materialType, setMaterialType] = useState("mcq");
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState("5");
  const [numOptions, setNumOptions] = useState("4");
  const [numCards, setNumCards] = useState("10");
  const [cardType, setCardType] = useState("question-answer");
  const [difficulty, setDifficulty] = useState("intermediate");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //generation logic handled my parent
    
    const baseData = {
      materialType,
      topic,
      difficulty,
    };

    if (materialType === "mcq") {
      onGenerate({
        ...baseData,
        numQuestions: parseInt(numQuestions),
        numOptions: parseInt(numOptions),
      });
    } else if (materialType === "flashcards") {
      onGenerate({
        ...baseData,
        numCards: parseInt(numCards),
        cardType,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">
          Generate Practice Materials
        </CardTitle>
        <CardDescription>
          Fill out the details below to generate practice materials around the
          currently selected book
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material-type">Material Type</Label>
            <Select value={materialType} onValueChange={setMaterialType}>
              <SelectTrigger className="border-grey w-full" id="material-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice Questions</SelectItem>
                <SelectItem value="flashcards">Flashcards</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Describe a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          {/* Conditional Fields based on Material Type */}
          {materialType === "mcq" && (
            <>
              {/* Number of Questions */}
              <div className="space-y-2">
                <Label htmlFor="num-questions">Number of Questions</Label>
                <Input
                  id="num-questions"
                  type="number"
                  placeholder="Enter a number"
                  min="1"
                  max="50"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  required
                />
              </div>

              {/* Number of Answer Options */}
              <div className="space-y-2">
                <Label htmlFor="num-options">Number of Answer Options</Label>
                <Input
                  id="num-options"
                  type="number"
                  placeholder="Enter a number"
                  min="2"
                  max="20"
                  value={numOptions}
                  onChange={(e) => setNumOptions(e.target.value)}
                  required
                />
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="border-grey w-full" id="difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Flashcard-specific fields */}
          {materialType === "flashcards" && (
            <>
              {/* Number of Cards */}
              <div className="space-y-2">
                <Label htmlFor="num-cards">Number of Cards</Label>
                <Input
                  id="num-cards"
                  type="number"
                  placeholder="Enter a number"
                  min="5"
                  max="30"
                  value={numCards}
                  onChange={(e) => setNumCards(e.target.value)}
                  required
                />
              </div>

              {/* Card Type */}
              <div className="space-y-2">
                <Label htmlFor="card-type">Card Type</Label>
                <Select value={cardType} onValueChange={setCardType}>
                  <SelectTrigger className="border-grey w-full" id="card-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="term-definition">Term & Definition</SelectItem>
                    <SelectItem value="question-answer">Question & Answer</SelectItem>
                    <SelectItem value="concept-example">Concept & Example</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty */}
              <div className="space-y-2">
                <Label htmlFor="difficulty-flashcard">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="border-grey w-full" id="difficulty-flashcard">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full">
            Generate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
