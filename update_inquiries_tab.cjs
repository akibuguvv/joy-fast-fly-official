const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanelSection.tsx', 'utf8');

const tab7Start = content.indexOf('{/* TAB 7: INQUIRIES */}');
const tab8Start = content.indexOf('{/* TAB 8: GALLERY */}');

if (tab7Start !== -1 && tab8Start !== -1) {
  const replacement = `
              {/* TAB 7: INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  
                  {appSubView === 'list' && (
                    <>
                      {/* Header and counter */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black text-blue-950">Inquiries (Online Registrations)</h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Inquiries / All Inquiries
                          </div>
                        </div>
                        <span className="bg-blue-950 text-white text-xs font-black uppercase tracking-widest px-4.5 py-2 rounded-full w-fit">
                          {inquiries.length} Registered Entries
                        </span>
                      </div>

                      {/* SEARCH & FILTERS BAR */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-xs flex flex-col md:flex-row items-center gap-4">
                        <div className="relative w-full md:flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input 
                            type="text"
                            placeholder="Search inquiries by name, phone or passport..."
                            value={inquirySearch}
                            onChange={(e) => setInquirySearch(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold"
                          />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                          <select 
                            value={inquiryTypeFilter}
                            onChange={(e) => setInquiryTypeFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-44 focus:outline-hidden"
                          >
                            <option>All Types</option>
                            <option>Student Visa</option>
                            <option>Work Permit</option>
                          </select>

                          <select 
                            value={inquiryStatusFilter}
                            onChange={(e) => setInquiryStatusFilter(e.target.value)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold w-full sm:w-40 focus:outline-hidden"
                          >
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Counselling Scheduled</option>
                            <option>Document Review</option>
                            <option>Submitted</option>
                          </select>

                          <button className="bg-blue-950 hover:bg-blue-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
                            <Filter size={16} />
                            Filter
                          </button>
                        </div>
                      </div>

                      {/* Table of Inquiries */}
                      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                                <th className="px-5 py-4.5">#</th>
                                <th className="px-5 py-4.5">Name & Details</th>
                                <th className="px-5 py-4.5">Visa Category</th>
                                <th className="px-5 py-4.5">Destination</th>
                                <th className="px-5 py-4.5">Status</th>
                                <th className="px-5 py-4.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                              {inquiries
                                .filter(item => {
                                  const matchesSearch = item.name.toLowerCase().includes(inquirySearch.toLowerCase()) || 
                                                        item.phone.includes(inquirySearch) || 
                                                        (item.passportNumber && item.passportNumber.toLowerCase().includes(inquirySearch.toLowerCase()));
                                  const isWork = item.visaType === 'work';
                                  const matchesType = inquiryTypeFilter === 'All Types' || 
                                                      (inquiryTypeFilter === 'Student Visa' && !isWork) || 
                                                      (inquiryTypeFilter === 'Work Permit' && isWork);
                                  const matchesStatus = inquiryStatusFilter === 'All Status' || item.status === inquiryStatusFilter;
                                  return matchesSearch && matchesType && matchesStatus;
                                })
                                .map((item, idx) => (
                                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-5 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                                    <td className="px-5 py-4.5">
                                      <div className="flex flex-col leading-tight">
                                        <span className="font-extrabold text-blue-950">{item.name}</span>
                                        <span className="text-xs text-slate-500 mt-0.5">Phone: {item.phone}</span>
                                      </div>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <span className={\`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wide font-black \${
                                        item.visaType === 'work' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                      }\`}>
                                        {item.visaType === 'work' ? 'Work Permit' : 'Student Visa'}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                        {item.destination}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4.5">
                                      <select 
                                        value={item.status}
                                        onChange={(e) => updateInquiryStatus(item.id, e.target.value as any)}
                                        className="border-0 bg-slate-100 focus:ring-1 focus:ring-blue-950 rounded-lg py-1 px-2 text-xs font-black text-blue-950 cursor-pointer"
                                      >
                                        <option value="Pending">Pending</option>
                                        <option value="Counselling Scheduled">Scheduled</option>
                                        <option value="Document Review">Doc Review</option>
                                        <option value="Submitted">Submitted</option>
                                      </select>
                                    </td>
                                    <td className="px-5 py-4.5 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button 
                                          onClick={() => { setViewingAppId(item.id); setAppSubView('details'); }}
                                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="View Details"
                                        >
                                          <Eye size={16} />
                                        </button>
                                        <button 
                                          onClick={() => deleteInquiry(item.id)}
                                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete Entry"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Details View for Inquiries */}
                  {appSubView === 'details' && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                      {/* Subview Header */}
                      <div className="flex items-center gap-4 border-b border-gray-150 pb-4">
                        <button 
                          onClick={() => setAppSubView('list')}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-950 transition-colors shadow-sm"
                        >
                          <ArrowLeft size={18} />
                        </button>
                        <div>
                          <h2 className="text-xl font-black text-blue-950">
                            Online Registration Details
                          </h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Inquiries / View Registration
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                            <h3 className="font-black text-blue-950 text-base mb-6 border-b border-gray-100 pb-3">Applicant Information</h3>
                            
                            {(() => {
                              const inq = inquiries.find(i => i.id === viewingAppId);
                              if (!inq) return <div>Inquiry not found</div>;
                              return (
                                <>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Full Name</div>
                                      <div className="text-lg font-black text-blue-950">{inq.name}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Phone Number</div>
                                      <div className="text-base font-bold text-blue-950 flex items-center gap-2">
                                        <Phone size={14} className="text-slate-400" />
                                        {inq.phone}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Email Address</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <Mail size={14} className="text-slate-400" />
                                        {inq.email || 'N/A'}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Passport Number</div>
                                      <div className="text-base font-bold text-slate-700 uppercase">{inq.passportNumber || 'N/A'}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Education Level</div>
                                      <div className="text-base font-bold text-slate-700">{inq.educationLevel || 'N/A'}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Present District</div>
                                      <div className="text-base font-bold text-slate-700">{inq.presentDistrict || 'N/A'}</div>
                                    </div>
                                  </div>

                                  <h3 className="font-black text-blue-950 text-base mt-8 mb-6 border-b border-gray-100 pb-3">Visa Requirements</h3>
                                  
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Visa Category</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <Briefcase size={16} className="text-blue-500" />
                                        {inq.visaType === 'work' ? 'Work Permit' : 'Student Visa'}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Country</div>
                                      <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                        <MapPinCheck size={16} className="text-[#da1e28]" />
                                        {inq.destination}
                                      </div>
                                    </div>
                                    {inq.visaType === 'work' ? (
                                      <div>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Skills & Experience</div>
                                        <div className="text-base font-bold text-blue-800">{inq.skillsExperience || 'N/A'}</div>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">IELTS Score</div>
                                        <div className="text-base font-bold text-emerald-800">{inq.ieltsScore || 'N/A'}</div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Message / Special Notes</div>
                                    <div className="bg-slate-50 border border-gray-150 rounded-xl p-4 text-sm font-medium text-slate-700 leading-relaxed min-h-[80px]">
                                      {inq.message || 'No additional message provided by the applicant.'}
                                    </div>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                          {/* Publish/Status Card */}
                          <div className="bg-slate-50 rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="p-5 border-b border-gray-200 bg-white">
                              <h3 className="font-black text-blue-950 text-sm">Processing Status</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                              {(() => {
                                const inq = inquiries.find(i => i.id === viewingAppId);
                                if (!inq) return null;
                                return (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Update Status</label>
                                    <select 
                                      value={inq.status}
                                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900 cursor-pointer shadow-sm"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Counselling Scheduled">Scheduled</option>
                                      <option value="Document Review">Doc Review</option>
                                      <option value="Submitted">Submitted</option>
                                    </select>
                                  </div>
                                );
                              })()}

                              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-gray-200">
                                <Clock size={16} className="text-gray-400" />
                                Applied on: {inquiries.find(i => i.id === viewingAppId)?.date || 'Today'}
                              </div>
                              
                              <button className="w-full py-3 bg-blue-950 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-900 shadow-md flex justify-center items-center gap-2">
                                <CheckCircle size={14} /> 
                                Save Status
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-xs">
                            <h3 className="font-black text-blue-950 text-sm mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Phone size={16} className="text-emerald-500" />
                                <span className="text-xs font-bold text-slate-700">Call Applicant</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Mail size={16} className="text-blue-500" />
                                <span className="text-xs font-bold text-slate-700">Email Applicant</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <FileText size={16} className="text-amber-500" />
                                <span className="text-xs font-bold text-slate-700">Request Documents</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
`;
  content = content.slice(0, tab7Start) + replacement + '\n' + content.slice(tab8Start);
  fs.writeFileSync('src/components/AdminPanelSection.tsx', content);
}
