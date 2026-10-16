import { collection, doc, getDocs, query, where } from "firebase/firestore";

// New evaluations store studentId as a plain string id, but older
// documents may still hold a DocumentReference. Both forms are
// normalised to the student's document id.
export function normalizeStudentId(studentReference) {
    if (!studentReference) return "";

    if (typeof studentReference === "string") return studentReference;

    if (typeof studentReference.id === "string") return studentReference.id;

    if (typeof studentReference.path === "string") {
        return studentReference.path.replace(/^students\//, "");
    }

    return "";
}

// Fetch every evaluation belonging to a student, whether it was stored
// with a string id or a DocumentReference.
export async function fetchStudentEvaluations(database, studentId) {
    const evaluationsCollection = collection(database, "evaluations");

    const [stringSnapshot, referenceSnapshot] = await Promise.all([
        getDocs(query(evaluationsCollection, where("studentId", "==", studentId))),
        getDocs(
            query(
                evaluationsCollection,
                where("studentId", "==", doc(database, "students", studentId))
            )
        ),
    ]);

    const evaluationsById = new Map();

    [...stringSnapshot.docs, ...referenceSnapshot.docs].forEach((evaluationDoc) => {
        evaluationsById.set(evaluationDoc.id, {
            id: evaluationDoc.id,
            ...evaluationDoc.data(),
        });
    });

    return [...evaluationsById.values()];
}
