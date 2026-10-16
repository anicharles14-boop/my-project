import coursesData from "../data/courses";

export const courseMap = Object.fromEntries(
    coursesData.map((course) => [course.code, course])
);

export const gradePoints = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export const getGrade = (score) => {
    if (score >= 70) return "A";
    if (score >= 60) return "B";
    if (score >= 50) return "C";
    if (score >= 45) return "D";
    if (score >= 40) return "E";

    return "F";
};

export const getGpa = (coursesList) => {
    const totalQualityPoints = coursesList.reduce((total, course) => {
        const grade = getGrade(course.overall);
        const point = gradePoints[grade] || 0;
        const unit = courseMap[course.course]?.credit || 0;

        return total + (point * unit);
    }, 0);

    const totalUnits = coursesList.reduce((total, course) => {
        return total + (courseMap[course.course]?.credit || 0);
    }, 0);

    if (totalUnits === 0) return "0.00";

    return (totalQualityPoints / totalUnits).toFixed(2);
};

export const getPerformanceLevel = (gpaValue) => {
    const score = Number(gpaValue) || 0;

    if (score >= 4.5) return "Excellent";
    if (score >= 4.0) return "Very Good";
    if (score >= 3.0) return "Good";

    return "Poor";
};
