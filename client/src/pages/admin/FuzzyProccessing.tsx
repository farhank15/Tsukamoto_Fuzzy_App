import AttendanceFuzzificationDisplay from "@/components/fuzzy_proccessing/Attendance";
import CCAFuzzificationDisplay from "@/components/fuzzy_proccessing/Cca";
import FinalExamFuzzificationDisplay from "@/components/fuzzy_proccessing/FinalExam";
import GPAFuzzificationDisplay from "@/components/fuzzy_proccessing/Gpa";
import MESFuzzificationDisplay from "@/components/fuzzy_proccessing/MidtermExam";

const FuzzyProccessing = () => {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 gap-4 p-2 mt-4 max-w-full
      "
    >
      <AttendanceFuzzificationDisplay />
      <CCAFuzzificationDisplay />
      <FinalExamFuzzificationDisplay />
      <GPAFuzzificationDisplay />
      <MESFuzzificationDisplay />
    </div>
  );
};

export default FuzzyProccessing;
