import React, { useState } from 'react';
import { COURSES } from '../data';
import { Search, GraduationCap, Clock, Award, BookOpen, CheckCircle } from 'lucide-react';

interface CoursesSectionProps {
  selectedDiscipline?: string | null;
  setSelectedDiscipline?: (discipline: string) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  selectedDiscipline = null,
  setSelectedDiscipline
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localDiscipline, setLocalDiscipline] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const activeDiscipline = selectedDiscipline || localDiscipline;
  const setActiveDiscipline = (disc: string) => {
    if (setSelectedDiscipline) {
      setSelectedDiscipline(disc);
    }
    setLocalDiscipline(disc);
  };

  const disciplines = ['All', 'IT & Engineering', 'Business & Law', 'Medical & Life Sciences'];
  const levels = ['All', 'Bachelor (UG)', 'Master (PG)'];

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.requirements.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDiscipline = activeDiscipline === 'All' || course.discipline === activeDiscipline;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesSearch && matchesDiscipline && matchesLevel;
  });

  return (
    <div className="flex flex-col w-full bg-white" id="courses-section">
      {/* Cover Banner */}
      <section className="bg-blue-950 text-white py-16 px-4 text-center relative overflow-hidden" id="courses-banner">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-[#da1e28] text-xs font-black uppercase tracking-widest bg-red-500/10 px-3.5 py-1 rounded-full">
            EXPLORE PATHWAYS
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mt-1">
            Global Degree Programs
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-semibold max-w-lg mt-1">
            Find undergraduate and postgraduate courses in globally certified partner universities.
          </p>
        </div>
      </section>

      {/* Filter and Course Cards Search Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto w-full flex flex-col gap-10" id="courses-content">
        
        {/* Search & Filters block */}
        <div className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-3xl flex flex-col gap-6 text-left" id="courses-filter-box">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="filters-row">
            
            {/* Search Input */}
            <div className="lg:col-span-6 relative" id="search-input-wrapper">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Search Program Name</span>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science, MBA, Cybersecurity..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 focus:border-[#da1e28] focus:ring-1 focus:ring-[#da1e28] rounded-xl pl-12 pr-4 py-3 text-sm font-semibold text-blue-950 shadow-sm"
                  id="course-search-field"
                />
              </div>
            </div>

            {/* Discipline Dropdown */}
            <div className="lg:col-span-3" id="discipline-filter">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Discipline Field</span>
              <select
                value={activeDiscipline}
                onChange={(e) => setActiveDiscipline(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#da1e28] rounded-xl px-4 py-3 text-sm font-semibold text-blue-950 shadow-sm"
                id="discipline-select-field"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Degree Level Filter */}
            <div className="lg:col-span-3" id="level-filter">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Academic Degree Level</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-[#da1e28] rounded-xl px-4 py-3 text-sm font-semibold text-blue-950 shadow-sm"
                id="level-select-field"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 text-left" id="results-count-wrapper">
          <span className="text-sm font-extrabold text-blue-950 uppercase tracking-wider">
            Programs Found: <span className="text-[#da1e28]">{filteredCourses.length}</span>
          </span>
          <span className="text-xs text-gray-400 font-bold">Showing accredited universities only</span>
        </div>

        {/* Courses cards grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="courses-grid">
            {filteredCourses.map((course) => (
              <div 
                key={course.id}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between text-left"
                id={`course-card-${course.id}`}
              >
                <div className="flex flex-col gap-4" id={`course-card-top-${course.id}`}>
                  {/* Badge Row */}
                  <div className="flex items-center justify-between" id={`course-badges-${course.id}`}>
                    <span className="bg-red-50 text-[#da1e28] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {course.discipline}
                    </span>
                    <span className="bg-blue-50 text-blue-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                  </div>

                  {/* Course name */}
                  <h3 className="text-lg font-black text-blue-950 leading-tight group-hover:text-[#da1e28] transition-colors" id={`course-title-${course.id}`}>
                    {course.name}
                  </h3>

                  {/* Program Duration */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold" id={`course-duration-${course.id}`}>
                    <Clock size={14} className="text-[#da1e28]" />
                    <span>Duration: <span className="text-blue-950 font-bold">{course.duration}</span></span>
                  </div>

                  {/* Average tuition */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold" id={`course-tuition-${course.id}`}>
                    <Award size={14} className="text-amber-500" />
                    <span>Estimated Tuition: <span className="text-[#da1e28] font-bold">{course.tuition}</span></span>
                  </div>
                </div>

                {/* Requirements border box */}
                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col gap-2" id={`course-card-bottom-${course.id}`}>
                  <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1.5">
                    <BookOpen size={11} className="text-[#da1e28]" />
                    Entrance Standards
                  </span>
                  <p className="text-xs font-black text-blue-950 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {course.requirements}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4 bg-gray-50 rounded-3xl" id="no-courses-found">
            <span className="text-4xl">📚</span>
            <h3 className="text-lg font-bold text-blue-950">No programs matched your filters</h3>
            <p className="text-xs text-gray-400 max-w-xs">Try clearing some query filters or search with a different keyword</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveDiscipline('All'); setSelectedLevel('All'); }}
              className="mt-2 px-5 py-2.5 bg-blue-950 text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-red-600 transition-colors"
              id="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>
    </div>
  );
};
