import { Link } from "react-router-dom";
import "../styles/Landing.css";
import shieldHalf from "../assets/shield-half.svg";

function Landing() {
    return (
        <div className="lp">

            {/* ---------- Top bar ---------- */}
            <header className="lp-top">
                <div className="lp-wrap">
                    <Link to="/" className="lp-brand" aria-label="UniEval home">
                        <span className="lp-brand-mark">
                            <img src={shieldHalf} alt="" />
                        </span>
                        <span className="lp-brand-name">
                            UniEval<small>PERFORMANCE SYSTEM</small>
                        </span>
                    </Link>

                    <nav className="lp-nav" aria-label="Page sections">
                        <a href="#grading">How grading works</a>
                        <a href="#portals">Students &amp; staff</a>
                        <a href="#assistant">Assistant</a>
                    </nav>

                    <div className="lp-top-actions">
                        <Link to="/admin/login" className="lp-staff">Staff login</Link>
                        <Link to="/student/login" className="lp-btn lp-btn-blue">Student login</Link>
                    </div>
                </div>
            </header>

            {/* ---------- Hero ---------- */}
            <section className="lp-hero">
                <div className="lp-wrap">
                    <div className="lp-hero-copy">
                        <p className="lp-kicker">Attendance · Assignments · Tests · Exams</p>
                        <h1>Know where you stand <em>before</em> results day.</h1>
                        <p className="lp-hero-lede">
                            UniEval keeps every score your lecturers record, works out the grade
                            for each course and keeps a running GPA you can check, question and
                            download whenever you need it.
                        </p>
                        <div className="lp-hero-ctas">
                            <Link to="/student/registration" className="lp-btn lp-btn-blue lp-btn-lg">
                                Create student account
                            </Link>
                            <Link to="/student/login" className="lp-btn lp-btn-ghost lp-btn-lg">
                                I already have one
                            </Link>
                        </div>
                        <p className="lp-hero-note">
                            Lecturer or admin? <Link to="/admin/login">Use the staff portal</Link>.
                        </p>
                    </div>

                    {/* Example of the result PDF a student downloads */}
                    <figure className="lp-pdf" aria-label="Example of the downloaded result PDF">
                        <div className="lp-pdf-bar">
                            <span className="lp-pdf-icon">PDF</span>
                            <span className="lp-pdf-file">student-results.pdf</span>
                            <span className="lp-pdf-hint">Downloaded from your dashboard</span>
                        </div>
                        <div className="lp-pdf-page">
                            <h3 className="lp-pdf-title">Student Academic Results</h3>

                            <table className="lp-pdf-info">
                                <tbody>
                                    <tr>
                                        <th>NAME:</th>
                                        <td>ADAEZE N. OKEKE</td>
                                        <th>DEPARTMENT:</th>
                                        <td>COMPUTER SCIENCE</td>
                                    </tr>
                                    <tr>
                                        <th>LEVEL:</th>
                                        <td>200</td>
                                        <th>MATRIC NUMBER:</th>
                                        <td>2023/104512</td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="lp-pdf-results">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Score</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="lp-pdf-stripe">
                                        <td className="lp-pdf-code">CSC 201</td>
                                        <td>Data Structures</td>
                                        <td>73%</td>
                                        <td>A</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-pdf-code">CSC 203</td>
                                        <td>Computer Architecture</td>
                                        <td>64%</td>
                                        <td>B</td>
                                    </tr>
                                    <tr className="lp-pdf-stripe">
                                        <td className="lp-pdf-code">CSC 205</td>
                                        <td>Computer Programming II</td>
                                        <td>81%</td>
                                        <td>A</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-pdf-code">CSC 207</td>
                                        <td>Discrete Mathematics</td>
                                        <td>58%</td>
                                        <td>C</td>
                                    </tr>
                                    <tr className="lp-pdf-stripe">
                                        <td className="lp-pdf-code">CSC 209</td>
                                        <td>Digital Logic Design</td>
                                        <td>76%</td>
                                        <td>A</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-pdf-code">CSC 211</td>
                                        <td>Operating Systems I</td>
                                        <td>67%</td>
                                        <td>B</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="lp-pdf-gpa">GPA: 4.33</p>
                        </div>
                    </figure>
                </div>
            </section>

            {/* ---------- How grading works ---------- */}
            <section className="lp-section" id="grading">
                <div className="lp-wrap">
                    <p className="lp-label"><i>01</i> How grading works</p>
                    <h2 className="lp-h2">No guesswork about where a grade came from.</h2>
                    <p className="lp-intro">
                        Each course is scored out of 100 using the same four parts for every
                        student. The weights are fixed, so the number on your result is one
                        you can work out yourself.
                    </p>

                    <div className="lp-scoring">
                        <div className="lp-weights-col">
                            <div className="lp-weights">
                                <h3>What each part is worth</h3>
                                <div
                                    className="lp-bar"
                                    role="img"
                                    aria-label="Attendance 10 percent, assignments 10 percent, tests 20 percent, exam 60 percent"
                                >
                                    <div className="w-att">10%</div>
                                    <div className="w-asg">10%</div>
                                    <div className="w-tst">20%</div>
                                    <div className="w-exm">60%</div>
                                </div>
                                <ul className="lp-bar-key">
                                    <li><i className="w-att"></i>Attendance <b>10</b></li>
                                    <li><i className="w-asg"></i>Assignments <b>10</b></li>
                                    <li><i className="w-tst"></i>Tests <b>20</b></li>
                                    <li><i className="w-exm"></i>Exam <b>60</b></li>
                                </ul>

                                <div className="lp-worked">
                                    <p className="lp-worked-title">How CSC 201 got its 73%</p>
                                    <table className="lp-worked-table">
                                        <tbody>
                                            <tr>
                                                <td>Attendance</td>
                                                <td className="lp-muted">90 × 0.10</td>
                                                <td className="lp-worked-value">9.0</td>
                                            </tr>
                                            <tr>
                                                <td>Assignment</td>
                                                <td className="lp-muted">80 × 0.10</td>
                                                <td className="lp-worked-value">8.0</td>
                                            </tr>
                                            <tr>
                                                <td>Test</td>
                                                <td className="lp-muted">65 × 0.20</td>
                                                <td className="lp-worked-value">13.0</td>
                                            </tr>
                                            <tr>
                                                <td>Exam</td>
                                                <td className="lp-muted">72 × 0.60</td>
                                                <td className="lp-worked-value">43.2</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="lp-worked-total">
                                        <span>Overall (rounded)</span>
                                        <span><b>73</b><span className="lp-grade">A</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lp-scale">
                            <h3>Grade scale</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Grade</th>
                                        <th>Score</th>
                                        <th className="lp-num">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="lp-scale-grade">A</td>
                                        <td>70 – 100</td>
                                        <td className="lp-num">5</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-scale-grade">B</td>
                                        <td>60 – 69</td>
                                        <td className="lp-num">4</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-scale-grade">C</td>
                                        <td>50 – 59</td>
                                        <td className="lp-num">3</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-scale-grade">D</td>
                                        <td>45 – 49</td>
                                        <td className="lp-num">2</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-scale-grade">E</td>
                                        <td>40 – 44</td>
                                        <td className="lp-num">1</td>
                                    </tr>
                                    <tr>
                                        <td className="lp-scale-grade">F</td>
                                        <td>0 – 39</td>
                                        <td className="lp-num">0</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p className="lp-formula">
                                Your GPA weights every grade by the course's credit units:
                                <code>GPA = Σ(points × units) ÷ Σ(units)</code>
                            </p>
                            <p className="lp-bands">
                                <span><b>Excellent</b> 4.50+</span>
                                <span><b>Very Good</b> 4.00+</span>
                                <span><b>Good</b> 3.00+</span>
                                <span><b>Poor</b> below 3.00</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Students & staff ---------- */}
            <section className="lp-section lp-section-line" id="portals">
                <div className="lp-wrap">
                    <p className="lp-label"><i>02</i> Two portals</p>
                    <h2 className="lp-h2">
                        One for the people who earn the scores, one for the people who record them.
                    </h2>

                    <div className="lp-portals">
                        <div className="lp-portal">
                            <span className="lp-portal-tag">/student</span>
                            <h3>Students</h3>
                            <p className="lp-portal-text">
                                Register with your matric number, department and level. Your
                                courses are loaded for you.
                            </p>
                            <ul>
                                <li>
                                    <b>Dashboard</b>
                                    <span>Average score, attendance and the courses you're enrolled in.</span>
                                </li>
                                <li>
                                    <b>Results</b>
                                    <span>Every course with its breakdown, grade and the date it was last updated.</span>
                                </li>
                                <li>
                                    <b>Transcript</b>
                                    <span>Download your results as a PDF in one click.</span>
                                </li>
                                <li>
                                    <b>Profile</b>
                                    <span>Keep your name, email and phone number up to date.</span>
                                </li>
                            </ul>
                            <div className="lp-portal-links">
                                <Link to="/student/registration" className="lp-btn lp-btn-blue">Register</Link>
                                <Link to="/student/login" className="lp-btn lp-btn-ghost">Student login</Link>
                            </div>
                        </div>

                        <div className="lp-portal lp-portal-staff">
                            <span className="lp-portal-tag">/admin</span>
                            <h3>Lecturers &amp; admin</h3>
                            <p className="lp-portal-text">A separate, staff-only sign-in. Student accounts can't reach these pages.</p>
                            <ul>
                                <li>
                                    <b>Students</b>
                                    <span>Search students by name and filter by department or level.</span>
                                </li>
                                <li>
                                    <b>Evaluation</b>
                                    <span>Enter the four scores per course; the total and grade fill in as you type.</span>
                                </li>
                                <li>
                                    <b>Dashboard</b>
                                    <span>Student count, evaluations recorded, average and highest score.</span>
                                </li>
                                <li>
                                    <b>Corrections</b>
                                    <span>Edit a score later and the student's result updates straight away.</span>
                                </li>
                            </ul>
                            <div className="lp-portal-links">
                                <Link to="/admin/login" className="lp-btn lp-btn-ghost">Staff login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Assistant ---------- */}
            <section className="lp-section lp-section-line" id="assistant">
                <div className="lp-wrap lp-assist">
                    <div className="lp-assist-copy">
                        <p className="lp-label"><i>03</i> Built-in assistant</p>
                        <h2 className="lp-h2">Ask about your results in plain words.</h2>
                        <p className="lp-intro">
                            The assistant on your dashboard reads your own scores and courses,
                            so questions about your results get answers about you.
                        </p>
                        <ul className="lp-assist-points">
                            <li><span className="lp-bullet"></span>Find the course that's holding your GPA back.</li>
                            <li><span className="lp-bullet"></span>See what score you'd need to move up a grade.</li>
                            <li><span className="lp-bullet"></span>Get a quick summary of the semester so far.</li>
                            <li><span className="lp-bullet"></span>Ask general questions too, like explaining a topic from class.</li>
                        </ul>
                    </div>

                    {/* Example chat with the assistant */}
                    <div className="lp-chat" aria-label="Example conversation with the assistant">
                        <div className="lp-chat-head"><span className="lp-chat-dot"></span>UniEval Assistant</div>
                        <div className="lp-chat-body">
                            <div className="lp-msg lp-msg-me">Which course is pulling my GPA down?</div>
                            <div className="lp-msg lp-msg-bot">
                                Discrete Mathematics (<span className="lp-mono">CSC 207</span>). You have 58,
                                which is a C and only 3 points on a 3-unit course.
                            </div>
                            <div className="lp-msg lp-msg-me">And if I got it to a B?</div>
                            <div className="lp-msg lp-msg-bot">
                                You'd need 2 more marks to reach 60. That takes your GPA from <b>4.33</b> to <b>4.50</b> — Excellent standing.
                            </div>
                        </div>
                        <div className="lp-chat-input"><div>Type a message...</div></div>
                    </div>
                </div>
            </section>

            {/* ---------- Footer ---------- */}
            <footer className="lp-foot">
                <div className="lp-wrap">
                    <span>UniEval · Student performance system</span>
                    <nav aria-label="Footer">
                        <Link to="/student/login">Student login</Link>
                        <Link to="/student/registration">Register</Link>
                        <Link to="/admin/login">Staff login</Link>
                    </nav>
                </div>
            </footer>

        </div>
    );
}

export default Landing;
