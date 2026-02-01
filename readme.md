# LearnSphere Quiz API

## Endpoint

```
GET http://localhost:4000/api/ai/quiz

send the topic also
```

## Response

```json
{
    "success": true,
    "quiz": [
        {
            "question": "What is a common phrase used to acknowledge a mistake?",
            "options": ["Oops", "Great", "Perfect", "Excellent"]
        },
        {
            "question": "What does \"oops\" often imply?",
            "options": ["Intentionality", "Accident", "Planning", "Skill"]
        },
        {
            "question": "Which situation might prompt someone to say \"oops\"?",
            "options": ["Success", "Failure", "Minor mishap", "Major achievement"]
        },
        {
            "question": "What is a synonym for \"oops\" in some contexts?",
            "options": ["Wow", "Awesome", "Whoops", "Fantastic"]
        },
        {
            "question": "\"Oops\" is generally considered what kind of expression?",
            "options": ["Formal", "Informal", "Serious", "Professional"]
        },
        {
            "question": "What is a possible consequence of saying \"oops\"?",
            "options": ["Praise", "Scolding", "Amusement", "Indifference"]
        },
        {
            "question": "In what tone is \"oops\" usually delivered?",
            "options": ["Angry", "Joyful", "Regretful", "Casual"]
        },
        {
            "question": "What is a less common but similar expression to \"oops\"?",
            "options": ["Eureka", "Ta-da", "Blast", "Bingo"]
        },
        {
            "question": "What is the typical context for using \"oops\"?",
            "options": ["Formal speeches", "Scientific reports", "Casual conversations", "Legal documents"]
        },
        {
            "question": "Could \"oops\" be used sarcastically?",
            "options": ["Yes", "No"]
        }
    ]
}
```