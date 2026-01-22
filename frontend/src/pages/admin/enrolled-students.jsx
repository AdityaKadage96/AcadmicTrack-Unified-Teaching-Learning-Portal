// src/pages/EnrolledStudents.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';

function EnrolledStudents() {
  const navigate = useNavigate();
  const { creatorCourseData } = useSelector((state) => state.course);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <FaArrowLeftLong 
            className="w-6 h-6 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h1 className="text-2xl font-bold">Enrolled Students (Course-wise)</h1>
        </div>

        {creatorCourseData?.length > 0 ? (
          creatorCourseData.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-3">{course.title}</h2>
              <p className="text-gray-600 mb-4">
                {course.enrolledStudents?.length || 0} student(s) enrolled
              </p>
              <div className="space-y-2">
                {course.enrolledStudents?.length > 0 ? (
                  course.enrolledStudents.map((student, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 border rounded-lg">
                      <img 
                        src={student.photoUrl || "/default-avatar.png"} 
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No students enrolled yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No courses created yet.</p>
        )}
      </div>
    </div>
  );
}

export default EnrolledStudents;