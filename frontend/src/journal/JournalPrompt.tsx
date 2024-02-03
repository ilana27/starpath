
interface JournalInputProps {
  prompt: string;
  date: string;
}

export default function JournalPrompt({
  prompt,
  date,
}: JournalInputProps) {

  return (
    <div className="journal-prompt">
      <h2 className="prompt-heading">Daily Prompt:</h2>
      <div className="prompt-area">
        <p className="prompt-text" aria-label="journal prompt">{prompt}</p>
        <p className="date" aria-label="date created">{date}</p>
      </div>
    </div>
  );
} 