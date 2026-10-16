import { useEffect, useMemo, useRef, useState } from "react";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { studentApp } from "../../config/firebase";
import { courseMap, getGrade, getGpa, getPerformanceLevel } from "../../utils/grades";
import "../styles/StudentChatbot.css";

// Flash-Lite models get a much larger free daily allowance than the flagship
// "flash" models (the newest ones are capped at ~20 requests/day on free tier).
const MODEL_NAME = "gemini-3.5-flash-lite";

const ai = getAI(studentApp, { backend: new GoogleAIBackend() });

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
    "You are UniEval Assistant, a friendly academic helper inside a university performance evaluation app.",
    "You have direct access to THIS student's real profile and academic data (listed below).",
    "Answer questions about their profile, courses, results, grades, GPA, attendance and study tips using this data.",
    "Never invent scores, courses or personal details that are not in the data.",
    "If something is not in the data, say you don't have it and tell them where to look in the app (Dashboard, Result, or Profile pages).",
    "Keep replies short (2-4 sentences), friendly and practical.",
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

    const chatRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const firstName = (student?.name || "").split(" ")[0];

    const model = useMemo(
        () =>
            getGenerativeModel(ai, {
                model: MODEL_NAME,
                systemInstruction: buildSystemInstruction({ student, evaluations, courses }),
            }),
        [student, evaluations, courses]
    );

    // Start a fresh chat session whenever the student data changes.
    useEffect(() => {
        chatRef.current = null;
    }, [model]);

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

        setMessages((previous) => [...previous, { role: "user", text }]);
        setInput("");
        setSending(true);

        try {
            if (!chatRef.current) {
                chatRef.current = model.startChat({});
            }

            const result = await chatRef.current.sendMessage(text);

            setMessages((previous) => [
                ...previous,
                { role: "model", text: result.response.text() },
            ]);
        } catch (error) {
            console.error("Chatbot error:", error);

            const status = error?.customErrorData?.status;
            const isQuotaError =
                status === 429 || /quota|429|too many requests/i.test(error?.message || "");

            let errorText =
                "Sorry, I couldn't reach the assistant right now. Please try again in a moment.";

            if (isQuotaError) {
                const retryDelay = error?.customErrorData?.errorDetails?.find((detail) =>
                    detail["@type"]?.includes("RetryInfo")
                )?.retryDelay;

                const retryHours = Math.ceil(parseInt(retryDelay, 10) / 3600);

                errorText = Number.isFinite(retryHours)
                    ? `I've reached the free AI limit (20 messages/day). Please try again in about ${retryHours} hour${retryHours === 1 ? "" : "s"}.`
                    : "I've reached the free AI limit (20 messages/day). Please try again later.";
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
                Ask me about your profile, results, or study tips
            </p>

            <div className="chatbot-messages" ref={messagesContainerRef}>
                <div className="chatbot-message chatbot-message-model">
                    {`Hi ${firstName || "there"}! 👋 I'm your UniEval assistant — ask me about your results, profile, courses, or study tips.`}
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
