const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanelSection.tsx', 'utf8');

const tab6Start = content.indexOf('{/* TAB 6: APPLICATIONS */}');
const tab7Start = content.indexOf('{/* TAB 7: INQUIRIES */}');

if (tab6Start !== -1 && tab7Start !== -1) {
  const replacement = `
              {/* TAB 6: APPLICATIONS */}
              {activeTab === 'applications' && (
                <div className="flex flex-col gap-6 animate-fade-in text-left">
                  
                  {appSubView === 'list' && (
                    <>
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-black text-blue-950">Manage Applications</h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Applications / All Applicants
                          </div>
                        </div>
                        <button 
                          onClick={() => setAppSubView('add')}
                          className="bg-[#da1e28] hover:bg-red-700 text-white font-black text-sm px-5 py-3 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide shrink-0 shadow-sm"
                        >
                          <Plus size={16} />
                          Add Application
                        </button>
                      </div>

                      {/* Table of applications */}
                      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-gray-100 text-[10px] uppercase font-black tracking-widest text-gray-500 select-none">
                                <th className="px-6 py-4.5">#</th>
                                <th className="px-6 py-4.5">Student Name</th>
                                <th className="px-6 py-4.5">Target Country</th>
                                <th className="px-6 py-4.5">Visa Category</th>
                                <th className="px-6 py-4.5">Status</th>
                                <th className="px-6 py-4.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-slate-800">
                              {applications.map((app, idx) => (
                                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-6 py-4.5 text-gray-400 font-extrabold">{idx + 1}</td>
                                  <td className="px-6 py-4.5">
                                    <div className="flex flex-col">
                                      <span className="font-extrabold text-blue-950">{app.name}</span>
                                      <span className="text-xs text-gray-400 mt-0.5">{app.date}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4.5 text-slate-600 font-bold">{app.country}</td>
                                  <td className="px-6 py-4.5 text-slate-600">{app.visaType}</td>
                                  <td className="px-6 py-4.5">
                                    <span className={\`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider \${
                                      app.status === 'New' ? 'bg-emerald-100 text-emerald-800' :
                                      app.status === 'In Review' ? 'bg-blue-100 text-blue-800' :
                                      app.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                      app.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }\`}>
                                      {app.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4.5 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button 
                                        onClick={() => { setViewingAppId(app.id); setAppSubView('details'); }}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      >
                                        <Eye size={16} />
                                      </button>
                                      <button 
                                        onClick={() => deleteApp(app.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

                  {/* Add / Details View for Applications */}
                  {(appSubView === 'add' || appSubView === 'details') && (
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
                            {appSubView === 'add' ? 'Add Online Registration' : 'Registration Details'}
                          </h2>
                          <div className="text-xs font-extrabold text-gray-400 mt-1 uppercase tracking-wider">
                            Dashboard / Applications / {appSubView === 'add' ? 'New Entry' : 'View Details'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-xs">
                            <h3 className="font-black text-blue-950 text-base mb-6 border-b border-gray-100 pb-3">Applicant Information</h3>
                            
                            {appSubView === 'add' ? (
                              <form onSubmit={handleAddApp} className="flex flex-col gap-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <input 
                                      type="text" required value={newAppName} onChange={(e) => setNewAppName(e.target.value)}
                                      placeholder="e.g. Fahim Hasan"
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Country</label>
                                    <input 
                                      type="text" required value={newAppCountry} onChange={(e) => setNewAppCountry(e.target.value)}
                                      placeholder="e.g. Romania"
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden focus:border-blue-900 focus:ring-1 focus:ring-blue-900 bg-slate-50"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Visa Category</label>
                                    <select 
                                      value={newAppVisaType} onChange={(e) => setNewAppVisaType(e.target.value)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden bg-slate-50"
                                    >
                                      <option value="Student Visa">Student Visa</option>
                                      <option value="Work Permit">Work Permit</option>
                                    </select>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Initial Status</label>
                                    <select 
                                      value={newAppStatus} onChange={(e) => setNewAppStatus(e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-hidden bg-slate-50"
                                    >
                                      <option value="New">New</option>
                                      <option value="In Review">In Review</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                                  <button type="button" onClick={() => setAppSubView('list')} className="px-6 py-2.5 text-sm font-black text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                                  <button type="submit" className="px-8 py-2.5 bg-[#da1e28] text-white text-sm font-black rounded-xl hover:bg-red-700 shadow-md">Register App</button>
                                </div>
                              </form>
                            ) : (
                              <div className="flex flex-col gap-6">
                                {(() => {
                                  const app = applications.find(a => a.id === viewingAppId);
                                  if (!app) return <div>App not found</div>;
                                  return (
                                    <>
                                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Student Name</div>
                                          <div className="text-lg font-black text-blue-950">{app.name}</div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Target Country</div>
                                          <div className="text-lg font-black text-blue-950 flex items-center gap-2">
                                            <MapPinCheck size={18} className="text-[#da1e28]" />
                                            {app.country}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Visa Category</div>
                                          <div className="text-base font-bold text-slate-700 flex items-center gap-2">
                                            <Briefcase size={16} className="text-blue-500" />
                                            {app.visaType}
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Date Applied</div>
                                          <div className="text-base font-bold text-slate-700">{app.date}</div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 pt-6 border-t border-gray-100">
                                        <h4 className="font-black text-sm text-blue-950 mb-3">Internal Notes</h4>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm font-medium text-amber-900 leading-relaxed">
                                          No special notes added for this applicant yet. Contact them immediately to proceed with the document collection step.
                                        </div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-1 flex flex-col gap-6">
                          {/* Publish/Status Card */}
                          <div className="bg-slate-50 rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
                            <div className="p-5 border-b border-gray-200 bg-white">
                              <h3 className="font-black text-blue-950 text-sm">Application Workflow</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                              {appSubView === 'details' && (() => {
                                const app = applications.find(a => a.id === viewingAppId);
                                if (!app) return null;
                                return (
                                  <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Update Status</label>
                                    <select 
                                      value={app.status}
                                      onChange={(e) => updateAppStatus(app.id, e.target.value as any)}
                                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-900 cursor-pointer shadow-sm"
                                    >
                                      <option value="New">New</option>
                                      <option value="In Review">In Review</option>
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                    </select>
                                  </div>
                                );
                              })()}

                              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white p-3 rounded-xl border border-gray-200">
                                <Clock size={16} className="text-gray-400" />
                                Last updated: Just now
                              </div>
                              
                              <button className="w-full py-3 bg-blue-950 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-900 shadow-md flex justify-center items-center gap-2">
                                <CheckCircle size={14} /> 
                                {appSubView === 'add' ? 'Save Entry' : 'Update Application'}
                              </button>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="bg-white rounded-3xl border border-gray-150 p-5 shadow-xs">
                            <h3 className="font-black text-blue-950 text-sm mb-4">Quick Actions</h3>
                            <div className="flex flex-col gap-2">
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Mail size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Send Email Update</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <Phone size={16} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-700">Log Phone Call</span>
                              </button>
                              <button className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 rounded-xl text-left transition-colors border border-transparent hover:border-gray-200">
                                <FileText size={16} className="text-slate-400" />
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
  content = content.slice(0, tab6Start) + replacement + content.slice(tab7Start);
  fs.writeFileSync('src/components/AdminPanelSection.tsx', content);
}
