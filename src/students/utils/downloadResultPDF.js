import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { courseMap, getGrade, getGpa } from "../../utils/grades";

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
