import { useMemo, useEffect, useRef, useState } from "react";
import { courseMap, getGrade, getGpa, getPerformanceLevel } from "../../utils/grades";
import "../styles/StudentChatbot.css";

// Flash-Lite models get a much larger free daily allowance than the flagship
// "flash" models (the newest ones are capped at ~20 requests/day on free tier).
const MODEL_NAME = "gemini-3.5-flash-lite";

// The chatbot talks to the Gemini API directly with a Google AI Studio key
// (https://aistudio.google.com/apikey) stored in .env.local as
// VITE_GEMINI_API_KEY. It used to go through Firebase AI Logic, but that now
// requires App Check registration in the Firebase console.
// Note: Vite builds this key into the website, so anyone can read it there.
// Restrict it to your site's domains in Google Cloud > Credentials.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

// Sends the whole conversation (the API is stateless) and returns the reply text.
async function askGemini({ systemInstruction, history }) {
    const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: history.map((message) => ({
                role: message.role,
                parts: [{ text: message.text }],
            })),
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data?.error?.message || `Gemini API error ${response.status}`);
        error.status = response.status;
        error.details = data?.error?.details || [];
        throw error;
    }

    const text = (data?.candidates?.[0]?.content?.parts || [])
        .map((part) => part.text || "")
        .join("")
        .trim();

    return text || "Sorry, I couldn't come up with an answer to that. Could you rephrase it?";
}

const formatDate = (createdAt) => {
    if (!createdAt?.toDate) return "unknown";

    return createdAt.toDate().toLocaleDateString();
};

const buildProfileContext = (student = {}) => {
    const rows = [
        `- Name: ${student.name || "unknown"}`,
        `- Matric number: ${student.matricNumber || "unknown"}`,
        `- Department: ${student.department || "unknown"}`,
        `- Level: ${student.level || "unknown"}`,
    ];

    if (student.email) rows.push(`- Email: ${student.email}`);
    if (student.phone) rows.push(`- Phone: ${student.phone}`);

    return rows.join("\n");
};

const buildCoursesContext = (courses = []) => {
    if (courses.length === 0) {
        return "No courses are listed in the catalogue for this student's department and level.";
    }

    return courses
        .map(
            (course) =>
                `- ${course.code}: ${course.name} (${course.credit} credit units, lecturer: ${course.lecturer || "unknown"})`
        )
        .join("\n");
};

const buildResultsContext = (evaluations = []) => {
    if (evaluations.length === 0) {
        return "The student has no course evaluations on record yet.";
    }

    return evaluations
        .map((evaluation) => {
            const courseInfo = courseMap[evaluation.course] || { name: evaluation.course };

            return [
                `- ${evaluation.course} (${courseInfo.name}): overall ${evaluation.overall ?? 0}% (grade ${getGrade(evaluation.overall)});`,
                `attendance ${evaluation.attendance ?? 0}%, assignment ${evaluation.assignment ?? 0}%, test ${evaluation.test ?? 0}%, exam ${evaluation.exam ?? 0}%;`,
                `last evaluated ${formatDate(evaluation.updatedAt ?? evaluation.createdAt)}`,
            ].join(" ");
        })
        .join("\n");
};

const buildSummaryContext = (evaluations = []) => {
    if (evaluations.length === 0) {
        return "No results are available yet, so no GPA or averages can be computed.";
    }

    const averageOverall = (
        evaluations.reduce(
            (total, evaluation) => total + Number(evaluation.overall || 0),
            0
        ) / evaluations.length
    ).toFixed(1);

    const averageAttendance = (
        evaluations.reduce(
            (total, evaluation) => total + Number(evaluation.attendance || 0),
            0
        ) / evaluations.length
    ).toFixed(0);

    const gpa = getGpa(evaluations);

    return [
        `- GPA: ${gpa} (${getPerformanceLevel(gpa)})`,
        `- Average overall score: ${averageOverall}%`,
        `- Average attendance: ${averageAttendance}%`,
        `- Courses evaluated: ${evaluations.length}`,
    ].join("\n");
};

const buildSystemInstruction = ({ student = {}, evaluations = [], courses = [] }) => [
    "You are UniEval Assistant, a friendly, knowledgeable helper inside a university performance evaluation app.",
    "You can help with two kinds of questions:",
    "1. Questions about THIS student: their profile, courses, results, grades, GPA and attendance. Answer these using only the data listed below.",
    "2. Anything else: general knowledge, explaining a topic from their courses, maths or coding help, study and exam tips, careers, writing, or everyday questions. Answer these from your own knowledge, the way a helpful general assistant would. Do not refuse just because the topic is not in the student's data.",
    "Rules for questions about the student:",
    "- Never invent scores, courses or personal details that are not in the data.",
    "- If a personal detail is not in the data, say you don't have it and tell them where to look in the app (Dashboard, Result, or Profile pages).",
    "Keep replies friendly and practical. Use 2-4 sentences for simple questions; give a longer, step-by-step answer when the student asks for an explanation or worked solution.",
    "Write in plain text without Markdown symbols such as **, # or backticks, because the chat window shows text exactly as written.",
    "",
    "STUDENT PROFILE:",
    buildProfileContext(student),
    "",
    "ENROLLED COURSES (from the course catalogue):",
    buildCoursesContext(courses),
    "",
    `RESULTS (${evaluations.length} evaluated course${evaluations.length === 1 ? "" : "s"}):`,
    buildResultsContext(evaluations),
    "",
    "SUMMARY:",
    buildSummaryContext(evaluations),
].join("\n");

function StudentChatbot({ student, evaluations = [], courses = [] }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);

    const messagesContainerRef = useRef(null);

    const firstName = (student?.name || "").split(" ")[0];

    // Rebuilt whenever the student's data loads or changes, so every reply
    // uses the latest results.
    const systemInstruction = useMemo(
        () => buildSystemInstruction({ student, evaluations, courses }),
        [student, evaluations, courses]
    );

    // Keep the chat list scrolled to the newest message.
    // This scrolls only the chat container, never the whole page.
    useEffect(() => {
        const container = messagesContainerRef.current;

        if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
    }, [messages, sending]);

    const sendMessage = async (event) => {
        event.preventDefault();

        const text = input.trim();

        if (!text || sending) {
            return;
        }

        const userMessage = { role: "user", text };

        // Earlier failed replies are not part of the real conversation.
        const history = [
            ...messages.filter((message) => !message.isError),
            userMessage,
        ];

        setMessages((previous) => [...previous, userMessage]);
        setInput("");
        setSending(true);

        try {
            if (!GEMINI_API_KEY) {
                throw Object.assign(new Error("VITE_GEMINI_API_KEY is not set"), { missingKey: true });
            }

            const reply = await askGemini({ systemInstruction, history });

            setMessages((previous) => [...previous, { role: "model", text: reply }]);
        } catch (error) {
            console.error("Chatbot error:", error);

            const message = error?.message || "";
            const isQuotaError = error?.status === 429 || /quota|too many requests/i.test(message);
            const isKeyError =
                error?.missingKey ||
                /api key|API_KEY_INVALID|permission/i.test(message) ||
                error?.status === 403;

            let errorText =
                "Sorry, I couldn't reach the assistant right now. Please try again in a moment.";

            if (isKeyError) {
                errorText =
                    "The assistant isn't set up correctly (its API key is missing or invalid). Please contact the site admin.";
            } else if (isQuotaError) {
                // Gemini sends the wait time as a string of seconds, e.g. "41s".
                const retryDelay = error?.details?.find((detail) =>
                    detail["@type"]?.includes("RetryInfo")
                )?.retryDelay;
                const retrySeconds = parseInt(retryDelay, 10);

                let waitText = "later";
                if (Number.isFinite(retrySeconds)) {
                    const minutes = Math.ceil(retrySeconds / 60);
                    const hours = Math.ceil(retrySeconds / 3600);
                    waitText = retrySeconds < 3600
                        ? `in about ${minutes} minute${minutes === 1 ? "" : "s"}`
                        : `in about ${hours} hour${hours === 1 ? "" : "s"}`;
                }

                errorText = `I've reached the free AI limit for now. Please try again ${waitText}.`;
            }

            setMessages((previous) => [
                ...previous,
                {
                    role: "model",
                    isError: true,
                    text: errorText
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="dash-chatbot">
            <div className="chatbot-header">
                <span className="chatbot-dot" />
                <h2>UniEval Assistant</h2>
            </div>
            <p className="chatbot-subtitle">
                Ask about your results, your courses, or anything else
            </p>

            <div className="chatbot-messages" ref={messagesContainerRef}>
                <div className="chatbot-message chatbot-message-model">
                    {`Hi ${firstName || "there"}! 👋 I'm your UniEval assistant — ask me about your results, profile or courses, or any general question you have.`}
                </div>

                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={
                            "chatbot-message chatbot-message-" +
                            message.role +
                            (message.isError ? " chatbot-message-error" : "")
                        }
                    >
                        {message.text}
                    </div>
                ))}

                {sending && (
                    <div className="chatbot-message chatbot-message-model chatbot-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

            </div>

            <form className="chatbot-form" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    disabled={sending}
                    aria-label="Chat message"
                />
                <button type="submit" disabled={sending || !input.trim()}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default StudentChatbot;
