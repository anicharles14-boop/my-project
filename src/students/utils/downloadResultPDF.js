import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import coursesData from "../../data/courses";

const courseMap = Object.fromEntries(
    coursesData.map((course) => [course.code, course])
);

const getGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";
    return "F";
};

const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

const getGpa = (courses) => {
    const totalQualityPoints = courses.reduce((total, course) => {
        const point = gradePoints[getGrade(course.overall)] || 0;
        const unit = courseMap[course.course]?.credit || 0;
        return total + point * unit;
    }, 0);

    const totalUnits = courses.reduce(
        (total, course) => total + (courseMap[course.course]?.credit || 0),
        0,
    );

    return totalUnits === 0 ? "0.00" : (totalQualityPoints / totalUnits).toFixed(2);
};

export function downloadResultPDF({ student, courses }) {
    const doc = new jsPDF();
    const gpa = getGpa(courses);

    doc.setFontSize(18);
    doc.text("Student Academic Results", 14, 20);

    autoTable(doc, {
        startY: 28,
        theme: "plain",
        styles: {
            fontSize: 11,
            cellPadding: 2,
        },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 20 },
            1: { cellWidth: 56 },
            2: { fontStyle: "bold", cellWidth: 40 },
            3: { cellWidth: 56 },
        },
        body: [
            ["NAME:", student.name?.toUpperCase() || "N/A", "DEPARTMENT:", student.department?.toUpperCase() || "N/A"],
            ["LEVEL:", student.level || "N/A", "MATRIC NUMBER:", student.matricNumber || "N/A"],
        ],
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Course Code", "Course Name", "Score", "Grade"]],
        body: courses.map((course) => {
            const courseInfo = courseMap[course.course] || {
                name: course.course,
                credit: 0,
            };

            return [
                course.course,
                courseInfo.name,
                `${course.overall}%`,
                getGrade(course.overall),
            ];
        }),
    });

    doc.setFont("helvetica");
    doc.setFontSize(12);
    const gpaText = `GPA: ${gpa}`;
    const gpaX = doc.internal.pageSize.getWidth() - 14 - doc.getTextWidth(gpaText);
    doc.text(gpaText, gpaX, doc.lastAutoTable.finalY + 10);
    doc.save("student-results.pdf");
}
